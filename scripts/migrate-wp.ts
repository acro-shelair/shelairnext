/**
 * WordPress to Supabase Migration Script
 *
 * Usage:
 *   npx tsx scripts/migrate-wp.ts <path-to-wordpress-export.xml>
 *
 * What it does:
 *   1. Parses the WordPress XML export file
 *   2. Downloads all images from posts (from the live WP site)
 *   3. Uploads images to Supabase Storage ("post-images" bucket)
 *   4. Rewrites image URLs in content to point to Supabase
 *   5. Splits post content into sections (split on <h2>/<h3> headings)
 *   6. Inserts posts + post_sections into Supabase
 *
 * Prerequisites:
 *   - Create a "post-images" storage bucket in Supabase (public)
 *   - WordPress site must still be live (for image downloads)
 *   - .env.local must have SUPABASE_SERVICE_ROLE_KEY
 *
 * Flags:
 *   --dry-run   Preview what would be migrated without uploading or inserting anything
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET_NAME = "post-images";
const DRY_RUN = process.argv.includes("--dry-run");

if (!DRY_RUN && (!SUPABASE_URL || !SUPABASE_KEY)) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  console.error("Run with: npx tsx --env-file=.env.local scripts/migrate-wp.ts <file.xml>");
  process.exit(1);
}

const supabase = DRY_RUN ? (null as any) : createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Types ───────────────────────────────────────────────────────────────────

interface WpPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  status: string;
  featuredImageUrl: string | null;
}

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "blockquote"; text: string; cite?: string }
  | { type: "list"; style: "bullet" | "number" | "letter"; items: string[] };

interface Section {
  heading: string;
  content: ContentBlock[];
  position: number;
}

// ── XML Parsing (no external dependency) ────────────────────────────────────

function extractCDATA(text: string): string {
  const match = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1].trim() : text.trim();
}

function getTagContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function getTagContentCDATA(xml: string, tag: string): string {
  return extractCDATA(getTagContent(xml, tag));
}

function parseWpXml(xmlContent: string): WpPost[] {
  const posts: WpPost[] = [];

  // Extract all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch: RegExpExecArray | null;

  while ((itemMatch = itemRegex.exec(xmlContent)) !== null) {
    const item = itemMatch[1];

    // Only process posts (not pages, attachments, etc.)
    const postType = getTagContent(item, "wp:post_type");
    if (extractCDATA(postType) !== "post") continue;

    const status = getTagContent(item, "wp:status");
    if (extractCDATA(status) === "trash") continue;

    const title = getTagContentCDATA(item, "title");
    const slug = getTagContent(item, "wp:post_name");
    const date = getTagContent(item, "wp:post_date");
    const excerpt = getTagContentCDATA(item, "excerpt:encoded");
    const content = getTagContentCDATA(item, "content:encoded");

    // Try to find featured image (thumbnail) from postmeta
    let featuredImageUrl: string | null = null;
    const thumbnailMatch = item.match(
      /<wp:postmeta>[\s\S]*?<wp:meta_key>\s*<!\[CDATA\[_wp_attached_file\]\]>\s*<\/wp:meta_key>[\s\S]*?<wp:meta_value>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/wp:meta_value>[\s\S]*?<\/wp:postmeta>/
    );
    if (thumbnailMatch) {
      featuredImageUrl = thumbnailMatch[1].trim();
    }

    posts.push({
      title,
      slug: extractCDATA(slug),
      date: extractCDATA(date),
      excerpt,
      content,
      status: extractCDATA(status),
      featuredImageUrl,
    });
  }

  // Also build a map of attachment ID → URL for featured images
  const attachmentMap = new Map<string, string>();
  const itemRegex2 = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch2: RegExpExecArray | null;

  while ((itemMatch2 = itemRegex2.exec(xmlContent)) !== null) {
    const item = itemMatch2[1];
    const postType = getTagContent(item, "wp:post_type");
    if (extractCDATA(postType) !== "attachment") continue;

    const postId = getTagContent(item, "wp:post_id");
    const attachUrl = getTagContent(item, "wp:attachment_url");
    if (postId && attachUrl) {
      attachmentMap.set(extractCDATA(postId), extractCDATA(attachUrl));
    }
  }

  // Go back and resolve featured images from _thumbnail_id postmeta
  const itemRegex3 = /<item>([\s\S]*?)<\/item>/g;
  let itemMatch3: RegExpExecArray | null;
  let postIndex = 0;

  while ((itemMatch3 = itemRegex3.exec(xmlContent)) !== null) {
    const item = itemMatch3[1];
    const postType = getTagContent(item, "wp:post_type");
    if (extractCDATA(postType) !== "post") continue;

    const status = getTagContent(item, "wp:status");
    if (extractCDATA(status) === "trash") continue;

    // Find _thumbnail_id
    const thumbIdMatch = item.match(
      /<wp:postmeta>[\s\S]*?<wp:meta_key>\s*<!\[CDATA\[_thumbnail_id\]\]>\s*<\/wp:meta_key>[\s\S]*?<wp:meta_value>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/wp:meta_value>[\s\S]*?<\/wp:postmeta>/
    );
    if (thumbIdMatch && posts[postIndex]) {
      const thumbId = thumbIdMatch[1].trim();
      const url = attachmentMap.get(thumbId);
      if (url) {
        posts[postIndex].featuredImageUrl = url;
      }
    }
    postIndex++;
  }

  return posts;
}

// ── Image Handling ──────────────────────────────────────────────────────────

function extractImageUrls(html: string): string[] {
  const urls: string[] = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    console.log(`  Downloading: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  ⚠ Failed to download ${url}: ${response.status}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    return { buffer: Buffer.from(arrayBuffer), contentType };
  } catch (err) {
    console.warn(`  ⚠ Error downloading ${url}:`, err);
    return null;
  }
}

function getFileNameFromUrl(url: string): string {
  const urlPath = new URL(url).pathname;
  const original = urlPath.split("/").pop() || `image-${Date.now()}.jpg`;
  // Replace extension with .webp
  return original.replace(/\.[^.]+$/, ".webp");
}

async function convertToWebp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).webp({ quality: 80 }).toBuffer();
}

async function uploadToSupabase(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string
): Promise<string | null> {
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.warn(`  ⚠ Upload failed for ${filePath}:`, error.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
}

async function migrateImages(
  html: string,
  postSlug: string
): Promise<{ html: string; firstImageUrl: string | null }> {
  const imageUrls = extractImageUrls(html);
  let updatedHtml = html;
  let firstImageUrl: string | null = null;

  for (const originalUrl of imageUrls) {
    const downloaded = await downloadImage(originalUrl);
    if (!downloaded) continue;

    const webpBuffer = await convertToWebp(downloaded.buffer);
    const fileName = getFileNameFromUrl(originalUrl);
    const newUrl = await uploadToSupabase(webpBuffer, fileName, "image/webp", postSlug);

    if (newUrl) {
      updatedHtml = updatedHtml.split(originalUrl).join(newUrl);
      if (!firstImageUrl) firstImageUrl = newUrl;
    }
  }

  return { html: updatedHtml, firstImageUrl };
}

async function migrateFeaturedImage(url: string, postSlug: string): Promise<string | null> {
  const downloaded = await downloadImage(url);
  if (!downloaded) return null;

  const webpBuffer = await convertToWebp(downloaded.buffer);
  const fileName = getFileNameFromUrl(url);
  return uploadToSupabase(webpBuffer, fileName, "image/webp", postSlug);
}

// ── Content Processing ──────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function htmlToBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Tokenize: extract block-level elements in order
  const tokenRegex = /<(blockquote|ul|ol|figure|img|p)[^>]*>([\s\S]*?)<\/\1>|<img[^>]*\/?>|<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = tokenRegex.exec(html)) !== null) {
    // Capture any text between matched tags as paragraphs
    const between = html.slice(lastIndex, match.index);
    const betweenText = stripHtml(between);
    if (betweenText) blocks.push({ type: "paragraph", text: betweenText });
    lastIndex = match.index + match[0].length;

    const tag = (match[1] || "").toLowerCase();
    const fullMatch = match[0];

    if (tag === "blockquote") {
      const text = stripHtml(match[2] || "");
      if (text) blocks.push({ type: "blockquote", text });
    } else if (tag === "ul") {
      const items = [...(match[2] || "").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((m) => stripHtml(m[1]))
        .filter(Boolean);
      if (items.length) blocks.push({ type: "list", style: "bullet", items });
    } else if (tag === "ol") {
      const items = [...(match[2] || "").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((m) => stripHtml(m[1]))
        .filter(Boolean);
      if (items.length) blocks.push({ type: "list", style: "number", items });
    } else if (tag === "figure") {
      const imgMatch = fullMatch.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      const capMatch = fullMatch.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
      const altMatch = fullMatch.match(/alt=["']([^"']*)["']/i);
      if (imgMatch) {
        blocks.push({
          type: "image",
          src: imgMatch[1],
          alt: altMatch?.[1] || "",
          caption: capMatch ? stripHtml(capMatch[1]) : "",
        });
      }
    } else if (tag === "img" || fullMatch.startsWith("<img")) {
      const srcMatch = fullMatch.match(/src=["']([^"']+)["']/i);
      const altMatch = fullMatch.match(/alt=["']([^"']*)["']/i);
      if (srcMatch) {
        blocks.push({ type: "image", src: srcMatch[1], alt: altMatch?.[1] || "" });
      }
    } else if (tag === "p") {
      // Check if paragraph contains only an image
      const innerImgMatch = (match[2] || match[3] || "").match(/^\s*<img[^>]+src=["']([^"']+)["'][^>]*\/?>\s*$/i);
      if (innerImgMatch) {
        const altMatch = (match[2] || match[3] || "").match(/alt=["']([^"']*)["']/i);
        blocks.push({ type: "image", src: innerImgMatch[1], alt: altMatch?.[1] || "" });
      } else {
        const text = stripHtml(match[2] || match[3] || "");
        if (text) blocks.push({ type: "paragraph", text });
      }
    }
  }

  // Trailing text
  const trailing = stripHtml(html.slice(lastIndex));
  if (trailing) blocks.push({ type: "paragraph", text: trailing });

  // Fallback: if regex found nothing, treat as single paragraph
  if (blocks.length === 0) {
    const text = stripHtml(html);
    if (text) blocks.push({ type: "paragraph", text });
  }

  return blocks;
}

function splitIntoSections(html: string): Section[] {
  const sections: Section[] = [];

  // Split on h2 or h3 headings
  const parts = html.split(/(?=<h[23][^>]*>)/i);

  let position = 0;
  for (const part of parts) {
    const headingMatch = part.match(/^<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);

    if (headingMatch) {
      const heading = stripHtml(headingMatch[1]);
      const bodyHtml = part.slice(headingMatch[0].length);
      const content = htmlToBlocks(bodyHtml);

      if (heading || content.length > 0) {
        sections.push({ heading, content, position });
        position++;
      }
    } else {
      // Content before the first heading → "Introduction" section
      const content = htmlToBlocks(part);
      if (content.length > 0) {
        sections.push({ heading: "Introduction", content, position });
        position++;
      }
    }
  }

  return sections;
}

function estimateReadTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

// ── Database Insert ─────────────────────────────────────────────────────────

async function insertPost(wpPost: WpPost, imageUrl: string | null, sections: Section[]) {
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert({
      slug: wpPost.slug,
      type: "Article" as const,
      title: wpPost.title,
      description: wpPost.excerpt || stripHtml(wpPost.content).slice(0, 200) + "...",
      meta_description: wpPost.excerpt || stripHtml(wpPost.content).slice(0, 160),
      date: wpPost.date.split(" ")[0], // YYYY-MM-DD
      read_time: estimateReadTime(wpPost.content),
      related_slugs: [],
      published: wpPost.status === "publish",
      image_url: imageUrl,
      created_at: new Date(wpPost.date).toISOString(),
      updated_at: new Date(wpPost.date).toISOString(),
    })
    .select("id")
    .single();

  if (postError) {
    console.error(`  ✗ Failed to insert post "${wpPost.title}":`, postError.message);
    return false;
  }

  if (sections.length > 0) {
    const { error: sectionsError } = await supabase.from("post_sections").insert(
      sections.map((s) => ({
        post_id: post.id,
        heading: s.heading,
        content: s.content,
        position: s.position,
      }))
    );

    if (sectionsError) {
      console.error(`  ✗ Failed to insert sections for "${wpPost.title}":`, sectionsError.message);
      return false;
    }
  }

  return true;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const xmlPath = process.argv[2];

  if (!xmlPath) {
    console.error("Usage: npx tsx --env-file=.env.local scripts/migrate-wp.ts <path-to-export.xml> [--dry-run]");
    process.exit(1);
  }

  const resolvedPath = path.resolve(xmlPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  console.log("── WordPress → Supabase Migration ──\n");
  if (DRY_RUN) console.log("🔍 DRY RUN — nothing will be uploaded or inserted\n");
  console.log(`Reading: ${resolvedPath}`);

  const xmlContent = fs.readFileSync(resolvedPath, "utf-8");
  const posts = parseWpXml(xmlContent);

  console.log(`Found ${posts.length} posts\n`);

  if (DRY_RUN) {
    // ── Dry Run: preview only ──
    for (const wpPost of posts) {
      const imageUrls = extractImageUrls(wpPost.content);
      const sections = splitIntoSections(wpPost.content);
      const readTime = estimateReadTime(wpPost.content);
      const description = wpPost.excerpt || stripHtml(wpPost.content).slice(0, 200) + "...";

      console.log(`\n▸ "${wpPost.title}"`);
      console.log(`  Slug:        ${wpPost.slug}`);
      console.log(`  Date:        ${wpPost.date.split(" ")[0]}`);
      console.log(`  Status:      ${wpPost.status}`);
      console.log(`  Read time:   ${readTime}`);
      console.log(`  Description: ${description.slice(0, 80)}...`);
      console.log(`  Featured:    ${wpPost.featuredImageUrl || "(none)"}`);
      console.log(`  Images:      ${imageUrls.length} found in content`);
      imageUrls.forEach((url) => console.log(`               - ${url}`));
      console.log(`  Sections:    ${sections.length}`);
      sections.forEach((s) =>
        console.log(`               ${s.position + 1}. "${s.heading}" (${s.content.length} paragraphs)`)
      );
    }

    console.log(`\n── Dry Run Summary ──`);
    console.log(`${posts.length} posts would be migrated`);
    console.log(`${posts.filter((p) => p.status === "publish").length} published, ${posts.filter((p) => p.status !== "publish").length} drafts`);
    const totalImages = posts.reduce((sum, p) => sum + extractImageUrls(p.content).length, 0);
    const totalFeatured = posts.filter((p) => p.featuredImageUrl).length;
    console.log(`${totalImages} content images + ${totalFeatured} featured images to download`);
    console.log(`\nRun without --dry-run to execute the migration.`);
  } else {
    // ── Real Migration ──
    // Ensure storage bucket exists
    const { error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    });
    if (bucketError && !bucketError.message.includes("already exists")) {
      console.error("Failed to create storage bucket:", bucketError.message);
      process.exit(1);
    }
    console.log(`Storage bucket "${BUCKET_NAME}" ready\n`);

    let success = 0;
    let failed = 0;

    for (const wpPost of posts) {
      console.log(`\n▸ Migrating: "${wpPost.title}" (${wpPost.slug})`);

      // 1. Migrate images in content
      const { html: updatedContent, firstImageUrl } = await migrateImages(wpPost.content, wpPost.slug);

      // 2. Migrate featured image
      let imageUrl: string | null = null;
      if (wpPost.featuredImageUrl) {
        imageUrl = await migrateFeaturedImage(wpPost.featuredImageUrl, wpPost.slug);
      }
      // Fallback to first image in content
      if (!imageUrl) {
        imageUrl = firstImageUrl;
      }

      // 3. Split content into sections
      const sections = splitIntoSections(updatedContent);
      console.log(`  ${sections.length} sections, image: ${imageUrl ? "✓" : "✗"}`);

      // 4. Insert into Supabase
      const ok = await insertPost(wpPost, imageUrl, sections);
      if (ok) {
        console.log(`  ✓ Inserted successfully`);
        success++;
      } else {
        failed++;
      }
    }

    console.log(`\n── Done ──`);
    console.log(`✓ ${success} posts migrated`);
    if (failed > 0) console.log(`✗ ${failed} posts failed`);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
