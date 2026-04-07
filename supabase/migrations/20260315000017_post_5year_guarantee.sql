-- Migration: post_5year_guarantee
-- Adds the blog post: "Why Our 5-Year Workmanship Guarantee Gives You Total Peace of Mind"
-- Source: https://shelair.com.au/5-year-workmanship-guarantee/
-- Published: June 7, 2025 | Author: Paul Simmons

with inserted as (
  insert into posts (slug, type, title, description, meta_description, date, read_time, related_slugs, published) values
  (
    '5-year-workmanship-guarantee',
    'Article',
    'Why Our 5-Year Workmanship Guarantee Gives You Total Peace of Mind',
    'Most contractors walk away once the job is done. We stay accountable for five full years — here''s exactly what that means for your business.',
    'Shelair backs every installation and repair with a 5-year workmanship guarantee — on top of any manufacturer''s warranty. Here''s what that means for your business.',
    'Jun 2025',
    '4 min read',
    array['refrigeration-warranty-vs-workmanship-guarantee','haccp-compliant-cold-rooms','reduce-refrigeration-energy-costs'],
    true
  )
  returning id
)
insert into post_sections (post_id, heading, content, position) values

-- 0 ── Introduction
(
  (select id from inserted),
  'We Go Further Than a Manufacturer''s Warranty',
  array[
    'When you invest in commercial air conditioning or HVAC work, you expect it to last. So do we. While most contractors only offer coverage based on the manufacturer''s warranty on parts, Shelair goes further — backing every installation and repair with our own 5-Year Workmanship Guarantee.',
    'This guarantee is entirely separate from — and in addition to — any manufacturer''s warranty on the equipment itself. It covers something the manufacturer will never cover: the quality of the human work that installs, connects, and commissions your system.'
  ],
  0
),

-- 1 ── What's covered
(
  (select id from inserted),
  'What Does the 5-Year Workmanship Guarantee Cover?',
  array[
    'Our guarantee covers faults that arise directly from how our technicians performed the work. That includes installation errors, faulty workmanship, incorrect fittings or connections, and issues that result directly from how the job was executed — not from the equipment itself.',
    'If a fault is caused by our workmanship within five years of the job, we return to site and rectify it at zero labour cost to you. No disputes about blame. No grey areas between the installer and the supplier. If it''s our work, we own it.'
  ],
  1
),

-- 2 ── Why it matters
(
  (select id from inserted),
  'Why This Guarantee Matters',
  array[
    'Workmanship issues don''t always surface immediately. An incorrectly charged refrigerant system may run fine for six months before efficiency drops noticeably. A marginal electrical connection may hold for a year before it causes an intermittent fault. By the time the symptom appears, most installers are long gone — and proving the cause is your problem.',
    'Our 5-year guarantee shifts that accountability back where it belongs: with us. It provides financial protection for your business, assurance that the installation was done right, and a clear path to resolution if it wasn''t.'
  ],
  2
),

-- 3 ── Technician standards
(
  (select id from inserted),
  'Our Technicians Are Held to a Higher Standard',
  array[
    'The guarantee isn''t just a promise on paper — it changes how our technicians approach every job. When your team knows their work is backed by a 5-year commitment, shortcuts aren''t an option. Every connection is made correctly. Every refrigerant charge is verified. Every installation is documented.',
    'All Shelair technicians are fully licensed and work to Australian standards. Our work is documented with compliance paperwork after every job — giving you an audit trail that satisfies HACCP and TGA requirements, and a record that supports any future guarantee claim.'
  ],
  3
),

-- 4 ── Peace of mind by industry
(
  (select id from inserted),
  'Peace of Mind for Every Industry We Serve',
  array[
    'For restaurant and hospitality operators, a refrigeration failure doesn''t just mean a service call — it means spoiled stock, a failed health inspection, and potentially a closed kitchen. For supermarkets, pharmaceutical facilities, and logistics operators, the stakes are even higher.',
    'Our guarantee is designed for businesses where downtime has real consequences. It means that when your system is installed by Shelair, you don''t just have a piece of equipment — you have five years of accountability behind the work that brought it to life.',
    'To book a service visit, get a free maintenance quote, or ask about our guarantee terms, call 1300 227 600 or submit an enquiry online. You''ll speak to a real technician — not a call centre.'
  ],
  4
);
