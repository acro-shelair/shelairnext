/**
 * WordPress Users → Supabase Auth Migration Script
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/migrate-wp-users.ts <path-to-users.csv> [--dry-run]
 *
 * What it does:
 *   1. Parses the WordPress CSV user export
 *   2. Creates each user in Supabase Auth with a temporary random password
 *   3. Auto-confirms their email so they can log in immediately
 *   4. Creates a user_profile with the appropriate role & permissions
 *   5. Users click "Forgot password" on first login to set their own password
 *
 * WordPress roles → Supabase roles:
 *   administrator → admin
 *   everything else (um_employee, editor, etc.) → employee
 *
 * Flags:
 *   --dry-run   Preview what would be created without making any changes
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DRY_RUN = process.argv.includes("--dry-run");

if (!DRY_RUN && (!SUPABASE_URL || !SUPABASE_KEY)) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  console.error("Run with: npx tsx --env-file=.env.local scripts/migrate-wp-users.ts <file.csv>");
  process.exit(1);
}

const supabase = DRY_RUN
  ? (null as any)
  : createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

// ── Types ───────────────────────────────────────────────────────────────────

interface WpUser {
  wpId: string;
  login: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: string;
  registered: string;
}

// ── CSV Parsing ─────────────────────────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

function parseWpUsersCsv(csvContent: string): WpUser[] {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);

  // Find column indices
  const col = (name: string) => headers.indexOf(name);
  const idIdx = col("ID");
  const loginIdx = col("user_login");
  const emailIdx = col("user_email");
  const displayIdx = col("display_name");
  const firstIdx = col("first_name");
  const lastIdx = col("last_name");
  const rolesIdx = col("roles");
  const registeredIdx = col("user_registered");

  if (emailIdx === -1) {
    console.error("CSV is missing 'user_email' column.");
    process.exit(1);
  }

  const users: WpUser[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    const email = fields[emailIdx]?.trim();

    if (!email) {
      console.warn(`  ⚠ Skipping row ${i + 1} — no email address`);
      continue;
    }

    users.push({
      wpId: fields[idIdx]?.trim() || "",
      login: fields[loginIdx]?.trim() || "",
      email,
      displayName: fields[displayIdx]?.trim() || "",
      firstName: fields[firstIdx]?.trim() || "",
      lastName: fields[lastIdx]?.trim() || "",
      role: fields[rolesIdx]?.trim() || "um_employee",
      registered: fields[registeredIdx]?.trim() || "",
    });
  }

  return users;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function generateTempPassword(): string {
  return crypto.randomBytes(24).toString("base64url");
}

function mapRole(wpRole: string): "admin" | "employee" {
  return wpRole.toLowerCase() === "administrator" ? "admin" : "employee";
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // process.argv: [node, tsx, ...flags, script.ts, csvFile, --dry-run, ...]
  // Find the first arg that ends with .csv
  const csvPath = process.argv.find((arg) => arg.endsWith(".csv"));

  if (!csvPath) {
    console.error(
      "Usage: npx tsx --env-file=.env.local scripts/migrate-wp-users.ts <path-to-users.csv> [--dry-run]"
    );
    process.exit(1);
  }

  const resolvedPath = path.resolve(csvPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  console.log("── WordPress Users → Supabase Migration ──\n");
  if (DRY_RUN) console.log("🔍 DRY RUN — no users will be created\n");
  console.log(`Reading: ${resolvedPath}`);

  const csvContent = fs.readFileSync(resolvedPath, "utf-8");
  const users = parseWpUsersCsv(csvContent);

  console.log(`Found ${users.length} users\n`);

  if (users.length === 0) {
    console.log("No users to migrate.");
    return;
  }

  if (DRY_RUN) {
    for (const user of users) {
      const role = mapRole(user.role);
      const name = user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.login;
      console.log(`  ▸ ${user.email}`);
      console.log(`    Name:       ${name}`);
      console.log(`    WP Login:   ${user.login}`);
      console.log(`    WP Role:    ${user.role} → ${role}`);
      console.log(`    Registered: ${user.registered}`);
      console.log();
    }

    const admins = users.filter((u) => mapRole(u.role) === "admin");
    const employees = users.filter((u) => mapRole(u.role) === "employee");

    console.log(`── Dry Run Summary ──`);
    console.log(`${users.length} users would be created`);
    console.log(`${admins.length} admins, ${employees.length} employees`);
    console.log(`\nRun without --dry-run to execute the migration.`);
    return;
  }

  // ── Real Migration ──
  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of users) {
    const role = mapRole(user.role);
    const name = user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.login;

    console.log(`▸ Creating: ${user.email} (${name}) as ${role}`);

    // 1. Create user in Supabase Auth
    const tempPassword = generateTempPassword();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        display_name: name,
        first_name: user.firstName,
        last_name: user.lastName,
        wp_login: user.login,
        wp_id: user.wpId,
      },
    });

    if (authError) {
      if (
        authError.message.includes("already been registered") ||
        authError.message.includes("already exists")
      ) {
        console.log(`  ⏭ Skipped — email already exists`);
        skipped++;
      } else {
        console.error(`  ✗ Failed: ${authError.message}`);
        failed++;
      }
      continue;
    }

    const userId = authData.user.id;

    // 2. Create user profile (id and created_at are auto-populated)
    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert(
        {
          user_id: userId,
          role,
        },
        { onConflict: "user_id" }
      );

    if (profileError) {
      console.error(`  ⚠ User created but profile failed: ${profileError.message}`);
    }

    console.log(`  ✓ Created (${role})`);
    success++;
  }

  console.log(`\n── Done ──`);
  console.log(`✓ ${success} users created`);
  if (skipped > 0) console.log(`⏭ ${skipped} skipped (already exist)`);
  if (failed > 0) console.log(`✗ ${failed} failed`);
  console.log(`\nUsers can log in by clicking "Forgot password" to set their own password.`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
