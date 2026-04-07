# Shelair Admin Guide

This guide covers everything you need to know to manage your website through the admin dashboard.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Posts](#managing-posts)
4. [Managing Services](#managing-services)
5. [Managing Industries](#managing-industries)
6. [Managing Brands](#managing-brands)
7. [Managing Projects](#managing-projects)
8. [Managing Testimonials](#managing-testimonials)
9. [Managing Locations](#managing-locations)
10. [Managing FAQs](#managing-faqs)
11. [Managing Pricing](#managing-pricing)
12. [Legal Pages](#legal-pages)
13. [Employee Portal](#employee-portal)
14. [User Management](#user-management)
15. [Settings](#settings)
16. [Activity Logs](#activity-logs)
17. [Maintenance](#maintenance)
18. [Roles & Permissions](#roles--permissions)

---

## Getting Started

### Logging In

1. Navigate to `/admin/login` on your website.
2. Enter your email and password.
3. Click **Sign In**.

If you forget your password, contact an admin to send you a password reset link.

### Navigation

Once logged in, you'll see the **sidebar** on the left with four groups:

- **Content** -- Home, Posts, Services, Industries, Brands, Projects, Locations
- **Engage** -- Pricing, Testimonials, FAQs
- **People** -- Employee Portal, Users
- **Admin** -- Legal Pages, Settings, Logs, Maintenance

On mobile, tap the hamburger menu icon to open the sidebar.

At the bottom of the sidebar you'll find:

- Your email and role badge
- **View Site** -- opens the public website in a new tab
- **Sign Out** -- logs you out

---

## Dashboard Overview

The **Home** page (`/admin/home`) gives you a quick snapshot of your site content:

- **Stats cards** showing the count of published posts, services, industries, brands, testimonials, locations, FAQs, and pricing tiers.
- **Connected sections** -- content managed through the database with quick-edit links.
- **Static sections** -- parts of the home page that require code changes (Hero, Trust Bar, Problem/Solution, etc.).

---

## Managing Posts

**Path:** Content > Posts

Posts are your blog articles, guides, case studies, and videos that appear on the Resources page.

### Viewing Posts

The posts list shows a paginated table (20 per page) with:

- Title, type, status, and date
- **Search bar** to find posts by title
- **Type filter** -- Guide, Article, Case Study, or Video
- **Status filter** -- Published or Draft

### Creating a Post

1. Click **New Post**.
2. Fill in the basic fields:
   - **Title** -- the slug is auto-generated when you click out of the title field.
   - **Slug** -- the URL path (auto-filled, but you can edit it).
   - **Type** -- choose Guide, Article, Case Study, or Video.
   - **Date** and **Read Time**.
   - **Description** -- a short summary shown on listing cards.
   - **Meta Description** -- for SEO (appears in search engine results).
   - **Related Post Slugs** -- comma-separated slugs to link related posts.
   - **Published** toggle -- turn on to make the post live.
3. **Cover Image** -- upload a JPG, PNG, or WebP image. It will be automatically converted to WebP format.

### Adding Content Sections

Posts are structured with **sections**, and each section contains **content blocks**.

1. Click **Add Section** to create a new section.
2. Give the section a **heading**.
3. Add content blocks within the section. Available block types:
   - **Paragraph** -- a text block.
   - **Image** -- upload an image with alt text and caption.
   - **Blockquote** -- a highlighted quote with an optional citation.
   - **List** -- bullet points, numbered, or lettered items. Use the add button to add list items.
   - **FAQ** -- question and answer pairs within the post content.
4. Use the **arrow buttons** to reorder blocks within a section.
5. Click the **trash icon** to remove a block.

### Editing a Post

Click the **Edit** button on any post in the list to open the editor with all fields pre-filled.

### Publishing / Unpublishing

- Toggle the **Published** switch in the editor, or
- Use the inline **publish/unpublish toggle** directly from the list page.

### Deleting a Post

Click the **Delete** button on the post list. You'll be asked to confirm before the post is removed.

---

## Managing Services

**Path:** Content > Services

Services appear on the home page and the dedicated Services page.

### Viewing Services

Services are shown as cards with their icon, title, and description. Use the **arrow buttons** to reorder them.

### Creating / Editing a Service

The service editor has two main sections:

**Card Info** (how it appears on listings):
- **Icon** -- pick from the icon grid.
- **Title** -- the slug is auto-generated.
- **Description** -- short text shown on the card.
- **Position** -- display order number.

**Detail Page** (the full service page):
- **Slug**, **Subtitle** (badge text), **Hero Description** (intro paragraph).
- **Meta Description** -- for SEO.
- **Overview** -- the "What's Included" section.
- **Related Service Slugs** -- link to other services.

**Dynamic content** (add/remove items as needed):
- **Stats** -- value and label pairs (e.g., "2hr" / "Avg Response").
- **Benefits** -- a list of key benefits.
- **Process Steps** -- step number, title, and description.
- **FAQs** -- question and answer pairs specific to this service.

---

## Managing Industries

**Path:** Content > Industries

Industries are the vertical markets you serve (Restaurants, Supermarkets, etc.).

### Creating / Editing an Industry

**Card Info**:
- **Icon**, **Title** (auto-slug), **Position**.
- **Short Description** -- shown on the home section.
- **Full Description** -- shown on the industries listing page.
- **Cover Image** -- upload a hero image.

**Features**:
- Add feature pills that display on the industry card (e.g., "Walk-in Coolrooms", "Display Fridges").

**Detail Page**:
- **Subtitle**, **Hero Description**, **Meta Description**, **Related Industry Slugs**.

**Dynamic content**:
- **Stats** -- value/label pairs.
- **Challenges** -- title and description of common industry challenges.
- **How We Help** -- services with icon, title, and description.
- **Case Study** (optional) -- fill in Company Name to show the case study section. Leave it blank to hide it. Includes Challenge, Solution, and Result fields.

---

## Managing Brands

**Path:** Content > Brands

Brands are the manufacturers and equipment brands you work with.

### Viewing Brands

Brands are split into two categories: **Featured Brands** and **Other Brands**. You can reorder within each category using the arrow buttons.

### Creating / Editing a Brand

**Listing Card**:
- **Name** (auto-slug), **Slug**, **Speciality** (badge text), **Detail** (one-liner).
- **Description**, **Position**.

**Detail Page**:
- **Tagline** (page heading), **Hero Description**, **About** (Why Choose section).

**Dynamic content**:
- **Stats** -- value/label pairs.
- **Common Issues** -- title and description.
- **Services Offered** -- text list.
- **Product Types** -- text list.
- **Related Brands** -- slug, name, and description of linked brands.

---

## Managing Projects

**Path:** Content > Projects

Projects are your portfolio and case studies.

### Creating / Editing a Project

**Card Info**:
- **Title** (auto-slug), **Slug**, **Type** (badge text), **Size/Scope**.
- **Location**, **Client Name**, **Short Description**.

**Detail Page**:
- **The Challenge** -- describe the problem.
- **Our Solution** -- describe what you did.

**Results & Outcomes**:
- Add bullet points for key results.

**Settings**:
- **Project Images** -- upload multiple images. The first image becomes the cover (marked with a badge). Drag to reorder, hover to delete.
- **Position** -- display order.
- **Featured** -- check this to show the project on the home page (maximum 3 featured projects).

---

## Managing Testimonials

**Path:** Engage > Testimonials

Testimonials appear in the carousel on the home page.

### Adding a Testimonial

1. Click **Add Testimonial**.
2. Fill in the fields in the dialog:
   - **Name** -- client's name.
   - **Role / Company** -- their title and company.
   - **Quote** -- the testimonial text.
   - **Rating** -- click 1-5 stars.
3. Click **Save**.

### Editing / Deleting

- Click **Edit** on any testimonial card to update it.
- Click **Delete** to remove it (with confirmation).
- Use the **arrow buttons** to reorder testimonials.

---

## Managing Locations

**Path:** Content > Locations

Locations define the cities and suburbs you service.

### Structure

Locations are organised hierarchically:
- **Cities** are the top level (e.g., Brisbane, Gold Coast).
- **Suburbs** are nested under each city.

Use the arrow buttons to reorder both cities and suburbs.

---

## Managing FAQs

**Path:** Engage > FAQs

FAQs appear in the accordion section on the home page.

### Adding an FAQ

1. Click **Add FAQ**.
2. Enter the **Question** and **Answer** in the dialog.
3. Click **Save**.

### Editing / Deleting

- Click **Edit** to update a question or answer.
- Click **Delete** to remove it.
- Use the **arrow buttons** to change the display order.

---

## Managing Pricing

**Path:** Engage > Pricing

Pricing tiers appear on the `/pricing` page.

### Adding a Pricing Tier

1. Click **Add Tier**.
2. Fill in:
   - **Name** -- tier name (e.g., "Standard", "Premium").
   - **Description** -- short description of the tier.
   - **Price** -- the dollar amount.
   - **Unit** -- pricing period (e.g., "/month", "/call-out").
   - **Features** -- click the add button to add feature items to the list.
   - **Popular** -- click the star icon to mark a tier as "Most Popular".
3. Click **Save**.

### Editing / Deleting

- Click **Edit** to update a tier.
- Click **Delete** to remove it.
- Use the **arrow buttons** to reorder tiers.

---

## Legal Pages

**Path:** Admin > Legal Pages

Manage your Terms & Conditions and Privacy Policy pages.

### Editing Legal Content

1. Use the **tabs** to switch between Terms & Conditions and Privacy Policy.
2. Edit the **page header**:
   - **Title**, **Intro** paragraph.
   - **Effective Date**.
   - **QBCC Licence #** and **ABN** (Terms only).
3. Edit **sections**:
   - Each section has a **Heading** and **Body** text.
   - Use blank lines in the body to create paragraph breaks.
   - Add, remove, or reorder sections as needed.
4. Click **Save**.

**Note:** Changes are published immediately when you save -- there is no draft mode for legal pages.

---

## Employee Portal

**Path:** People > Employee Portal

The portal is a shared space for team documents, forms, and SWMS.

### Structure

Content is organised into **sections**, each containing **resources**.

### Managing Sections

- Add a new section with a **name** and optional **description**.
- Reorder or delete sections as needed.

### Managing Resources

Each resource can be either a **file** or a **link**:

**Files:**
- Upload one or multiple files at once.
- Supported types are auto-detected: PDF, Excel, Word, or Other.
- You can change the file type label manually if needed.

**Links:**
- Paste an external URL.

For both types, you can set a **title**, change the **type**, **reorder**, or **delete** the resource.

### Access

- All employees can view the portal.
- Only users with the `portal` permission (or admins) can edit content.

---

## User Management

**Path:** People > Users

Manage all admin and employee accounts.

### Viewing Users

A paginated table showing each user's email, role, status, and last sign-in date.

### Adding a User

Two options:

- **Send Invite** -- sends an email with a link to set their password.
- **Create User** -- creates the account immediately with a password you set (no email confirmation required).

### User Actions

Click the **more actions** menu (three dots) on any user to access:

- **Role & Permissions** -- change between Admin and Employee roles. For employees, select which sections they can access from the permissions grid. Use permission presets for quick setup.
- **Update Email** -- change the user's email address.
- **Change Password** -- set a new password for the user.
- **Send Password Reset** -- send a reset link via email.
- **Confirm Email** -- force-confirm an unverified email.
- **Ban / Unban User** -- block or restore access.
- **Delete User** -- permanently remove the account (requires confirmation).

---

## Settings

**Path:** Admin > Settings

Configure global site settings such as contact information, business hours, and social media links.

---

## Activity Logs

**Path:** Admin > Logs

View a full audit trail of all actions taken in the admin dashboard.

### Viewing Logs

- **Stats cards** at the top show counts for Create, Update, and Delete actions.
- The log table shows each action with:
  - **Action** type (Create / Update / Delete) with a colour-coded badge.
  - **Table** -- which content type was affected.
  - **Details** -- what was changed.
  - **User** -- who performed the action.
  - **When** -- relative timestamp (e.g., "2h ago").

### Filtering Logs

- **Action filter** -- show only Creates, Updates, or Deletes.
- **Table filter** -- filter by content type.
- **Search** -- search by details or user email.

Logs are paginated at 20 entries per page.

---

## Maintenance

**Path:** Admin > Maintenance

System health monitoring and cache management tools.

### Database Status

- Shows whether the database connection is healthy (green) or down (red).
- Displays current latency.

### Database Records

A card grid showing the record count for each table (Posts, Services, Industries, Brands, Projects, Pricing, Testimonials, FAQs, Users, Logs, etc.).

### Cache Revalidation

When you update content through the admin, the public website uses cached pages for performance. If changes don't appear immediately:

1. Click one of the **revalidation buttons**:
   - **All Public Pages** -- clears all caches.
   - **Resources/Blog**, **Services**, **Industries**, **Brands**, **Home** -- clear specific sections.
2. Wait for the success checkmark to appear.

### Log Cleanup

Remove old activity logs to keep the database tidy:
- Choose a timeframe: **30 days**, **60 days**, or **90 days**.
- Confirm the deletion.
- The number of deleted logs will be displayed.

### Supabase Quick Links

Direct links to your Supabase dashboard for advanced operations:
- Table Editor, SQL Editor, Auth Users, Storage, API Docs, Logs.

---

## Roles & Permissions

There are two roles in the system:

### Admin

- Full access to all sections and features.
- Can manage users, settings, legal pages, logs, and maintenance.
- The first registered user is automatically an admin.

### Employee

- Access is controlled by assigned permissions.
- The sidebar only shows sections the employee has permission to access.
- Available permissions include: Posts, Services, Industries, Brands, Locations, Testimonials, Portal, and more.
- Employees can view their own profile and change their password at **Profile** (accessible from the sidebar).

### Permission Presets

When assigning permissions to an employee, you can use **presets** to quickly apply a predefined set of permissions instead of selecting them individually.

---

## Tips & Best Practices

- **Slugs** are auto-generated from titles. You can edit them, but avoid changing slugs on published content as it will break existing links.
- **Images** are automatically converted to WebP format for optimal performance. Upload JPG, PNG, or WebP files.
- **Reordering** uses the arrow buttons on list pages. The position is saved immediately.
- **Cache** may need to be revalidated after making changes. If updates don't appear on the public site, go to Maintenance and revalidate the relevant section.
- **Activity logging** tracks all changes automatically. Use the Logs page to audit who changed what and when.
- **Save frequently** when editing long content like posts or legal pages to avoid losing work.
