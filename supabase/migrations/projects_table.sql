-- Run this in your Supabase SQL Editor

create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null default '',
  type        text not null default '',
  size        text not null default '',
  description text not null default '',
  location    text not null default '',
  client      text not null default '',
  challenge   text not null default '',
  solution    text not null default '',
  outcomes    jsonb not null default '[]',
  image_url   text,
  featured    boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz default now()
);

-- Row Level Security
alter table projects enable row level security;

create policy "Public can read projects"
  on projects for select using (true);

create policy "Authenticated users can manage projects"
  on projects for all using (auth.role() = 'authenticated');

-- Seed with existing data (optional — remove if you want to start fresh)
insert into projects (slug, title, type, size, description, location, client, challenge, solution, outcomes, featured, position) values
(
  'freshmart-national-fleet',
  'FreshMart National Fleet',
  'Maintenance Contract',
  '48 stores',
  'Ongoing preventative maintenance across 48 supermarket locations. Reduced emergency call-outs by 60% in the first year through proactive servicing.',
  'Nationwide, Australia',
  'FreshMart Supermarkets',
  'FreshMart was averaging 3–4 emergency call-outs per store per year across their 48-location network, resulting in significant stock losses and compliance risk. Their previous contractor lacked the national coverage and documentation standards required.',
  'Shelair implemented a structured preventative maintenance program with quarterly site visits, 24/7 remote monitoring, and centralised compliance reporting. Each store received a full system audit before the program commenced.',
  '["60% reduction in emergency call-outs in the first 12 months","Zero food safety compliance failures across the fleet","Centralised digital maintenance records for every store","Average response time of 90 minutes for any emergency during the contract"]',
  true, 0
),
(
  'harbour-kitchen-emergency',
  'Harbour Kitchen — Emergency',
  'Emergency Repair',
  'Compressor failure',
  '2am compressor failure at a high-volume waterfront restaurant. Technician on-site within 90 minutes, system restored before morning prep.',
  'Sydney, NSW',
  'Harbour Kitchen Restaurant',
  'A critical compressor failure at 2am threatened the entire cold storage system of a high-volume waterfront restaurant. With a full service the following morning, the kitchen had hours to resolve the issue or face closure and thousands in spoiled stock.',
  'Shelair dispatched a technician within 20 minutes of the call. On arrival, the technician diagnosed a seized compressor motor and sourced a replacement from our emergency parts stock. The system was restored and temperature-stable before 5:30am.',
  '["On-site within 90 minutes of the initial call","System fully operational before morning kitchen prep","Zero stock loss — cold chain maintained throughout","Follow-up preventative maintenance plan established"]',
  true, 1
),
(
  'pharmalogix-brisbane',
  'PharmaLogix Brisbane',
  'Maintenance & Monitoring',
  '120 sqm facility',
  'TGA-compliant maintenance contract with 24/7 remote monitoring. Zero temperature excursions since program inception.',
  'Brisbane, QLD',
  'PharmaLogix Pty Ltd',
  'PharmaLogix required a refrigeration maintenance partner capable of meeting strict TGA (Therapeutic Goods Administration) standards for pharmaceutical cold storage. Temperature excursions carry serious regulatory and liability consequences in this environment.',
  'We designed a bespoke maintenance and monitoring program incorporating continuous data logging, automated SMS/email alerts for any temperature deviation, quarterly calibration checks, and full audit-ready documentation.',
  '["Zero temperature excursions since program inception","Full TGA-compliant documentation delivered after every visit","24/7 real-time monitoring with sub-2-minute alert response","Successfully passed two TGA audits with no findings"]',
  true, 2
),
(
  'aussie-meats-processing',
  'Aussie Meats Processing',
  'Cold Room Build',
  '300 sqm blast freezer',
  'High-capacity blast freezing facility with processing rooms designed for continuous 24/7 operation. Delivered on time and on budget.',
  'Toowoomba, QLD',
  'Aussie Meats Processing Co.',
  'Aussie Meats needed a 300 sqm blast freezing facility capable of continuous 24/7 operation to meet growing processing volumes. The existing site had structural constraints and required HACCP-compliant design from the ground up.',
  'Shelair''s in-house design and construction team engineered a modular blast freezer system incorporating redundant compressors, positive-pressure airlocks, and a custom drainage design to meet HACCP requirements.',
  '["Delivered on time and within the agreed budget","HACCP compliance achieved — passed inspection on first attempt","Redundant compressor system providing 99.9% uptime","28% more capacity than initially scoped, within the same footprint"]',
  false, 3
),
(
  'greengrocer-co-op',
  'GreenGrocer Co-op',
  'System Upgrade',
  '80 sqm multi-temp',
  'Ageing refrigeration system upgraded with energy-efficient compressors and smart monitoring. 28% reduction in energy costs.',
  'Sunshine Coast, QLD',
  'GreenGrocer Co-operative',
  'The co-op''s 15-year-old multi-temperature refrigeration system was consuming excessive energy and generating frequent faults. Energy bills had increased 35% over the previous two years.',
  'We completed a full system audit, then replaced the ageing compressor units with inverter-driven alternatives and integrated a smart monitoring platform. The upgrade was completed over a single weekend to avoid trading disruptions.',
  '["28% reduction in energy costs within the first quarter","Consistent temperature performance across all zones","Smart monitoring dashboard accessible by management","Estimated 8-year equipment lifespan extension"]',
  false, 4
),
(
  'coldchain-logistics',
  'ColdChain Logistics',
  'Emergency + Maintenance',
  '500 sqm warehouse',
  'Started with an emergency condenser repair, now a full preventative maintenance client with quarterly servicing across two facilities.',
  'Gold Coast, QLD',
  'ColdChain Logistics Australia',
  'A condenser failure at their Gold Coast warehouse threatened time-sensitive cold chain deliveries during a peak summer period. After the emergency was resolved, it became clear the facility had not had a structured maintenance program in place.',
  'We resolved the emergency condenser failure within four hours, then conducted a full facility audit. Following the audit, ColdChain engaged Shelair for a preventative maintenance contract across both their Gold Coast and Brisbane facilities.',
  '["Emergency condenser failure resolved within 4 hours","Full facility audit completed within two weeks","Preventative maintenance now running across 2 facilities","No unplanned downtime in 14 months since contract commencement"]',
  false, 5
)
on conflict (slug) do nothing;
