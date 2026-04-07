-- Migration: post_warranty_vs_workmanship
-- Adds the blog post: "Refrigeration Warranty vs. Workmanship Guarantee: What's Covered?"
-- Source: https://shelair.com.au/refrigeration-warranty-vs-workmanship-guarantee/
-- Published: July 2025 | Author: Paul Simmons

with inserted as (
  insert into posts (slug, type, title, description, meta_description, date, read_time, related_slugs, published) values
  (
    'refrigeration-warranty-vs-workmanship-guarantee',
    'Article',
    'Refrigeration Warranty vs. Workmanship Guarantee: What''s Covered?',
    'Understanding the difference between a manufacturer''s warranty and a workmanship guarantee — and why your business needs both.',
    'Learn the difference between a refrigeration manufacturer''s warranty and a workmanship guarantee. Shelair backs every installation with a 5-year workmanship guarantee across SE Queensland.',
    'Jul 2025',
    '5 min read',
    array['haccp-compliant-cold-rooms','cold-room-monthly-maintenance','smart-monitoring-roi'],
    true
  )
  returning id
)
insert into post_sections (post_id, heading, content, position) values

-- 0 ── Introduction
(
  (select id from inserted),
  'Two Protections That Cover Very Different Things',
  array[
    'When investing in a commercial air conditioning system, understanding the difference between a manufacturer''s warranty and a workmanship guarantee is critical. These two protections cover very different things, and knowing what each covers can save your business time, money, and significant headaches if something goes wrong.',
    'At Shelair, we back every installation and service job with a 5-year workmanship guarantee — giving our clients clarity and peace of mind that most contractors simply don''t offer.'
  ],
  0
),

-- 1 ── Manufacturer's Warranty
(
  (select id from inserted),
  'What Is a Refrigeration Warranty?',
  array[
    'A refrigeration warranty is provided by the manufacturer of the equipment, not the installer. It typically covers parts and components such as compressors, fans and sensors, manufacturing defects, and performance failures under normal use. Coverage duration is typically 1–5 years depending on the brand and model — some components like compressors may have extended warranty periods.',
    'Importantly, manufacturer warranties do not cover incorrect installation, misuse, poor maintenance, or external damage such as power surges or water damage. This distinction matters significantly when something goes wrong after installation — the manufacturer''s obligation stops at the factory gate.'
  ],
  1
),

-- 2 ── Workmanship Guarantee
(
  (select id from inserted),
  'What Is a Workmanship Guarantee?',
  array[
    'A workmanship guarantee is offered by the installer — not the manufacturer — to cover the quality and reliability of the installation work itself. At Shelair, our 5-year workmanship guarantee covers installation errors, faulty or unsafe wiring or connections, incorrect refrigerant charging, and issues caused by poor fitment or shortcuts taken during the job.',
    'Without a workmanship guarantee, you can be left stranded between the supplier and the installer when something goes wrong. Each party points to the other. Our guarantee eliminates that grey area entirely — if the fault is caused by how our technicians performed the work, we return and fix it at zero labour cost to you.'
  ],
  2
),

-- 3 ── Why You Need Both
(
  (select id from inserted),
  'Why You Need Both',
  array[
    'For full protection, you need both the equipment warranty and the workmanship guarantee. One covers the hardware — the parts and components manufactured to a specification. The other covers the human work that brings it to life.',
    'Even high-quality equipment can fail due to poor installation — and without a workmanship guarantee, you would foot the bill. A compressor installed with incorrect refrigerant charge, for example, will fail prematurely. That failure may look like a manufacturer defect on the surface, but if the root cause is installation error, the manufacturer warranty won''t apply. You need an installer willing to stand behind their own work.'
  ],
  3
),

-- 4 ── Shelair Gives You Both
(
  (select id from inserted),
  'Shelair Gives You Both',
  array[
    'We only use reputable, warranty-backed commercial air conditioning brands, and every project is delivered by our licensed technicians under our exclusive 5-year workmanship guarantee. Manufacturer warranties are honoured, workmanship is guaranteed, and you have full support for claims, diagnostics and repairs throughout — with transparent documentation for asset managers and compliance teams.',
    'Our mobile technicians are on-call 24/7 across South-East Queensland including Brisbane, Gold Coast, Sunshine Coast, Logan, Ipswich and northern NSW. If something goes wrong after an installation, you speak directly to a real technician — not a call centre.'
  ],
  4
),

-- 5 ── FAQs
(
  (select id from inserted),
  'Frequently Asked Questions',
  array[
    'What does a refrigeration manufacturer''s warranty usually cover? It typically covers faulty parts, manufacturing defects, and performance failures under normal conditions — such as a compressor failure or faulty fan motor. It does not cover installation issues or damage caused by misuse, power surges, or lack of maintenance.',
    'How long do refrigeration warranties last? Most commercial air conditioning warranties last between 1 and 5 years depending on the brand and model. Some components like compressors may carry extended warranty periods. Always confirm the exact terms with your installer at time of purchase.',
    'What is covered under a workmanship guarantee? A workmanship guarantee covers the quality of the installation or repair — including correct refrigerant charging, proper electrical connections, and correct fitment. Our 5-year workmanship guarantee ensures that any fault arising from how our technicians performed the work is rectified at no labour cost to you.',
    'Who do I contact if something goes wrong — the installer or the manufacturer? If the issue is related to installation quality, contact the installer. If it appears to be a component failure, your installer can help assess the fault and lodge a warranty claim with the manufacturer where applicable. Shelair supports you through both processes.',
    'What happens if I void the warranty by accident? Warranties can be voided by not maintaining the equipment to the manufacturer''s schedule, by tampering with components, or by using unlicensed technicians for service work. Regular preventative maintenance by qualified professionals protects your warranty entitlements.',
    'Can I have both a manufacturer warranty and a workmanship guarantee at the same time? Yes — and you should. The manufacturer warranty covers the unit itself, while the workmanship guarantee protects you from installation-related faults. At Shelair, we provide both on every job to ensure complete coverage from day one.'
  ],
  5
);
