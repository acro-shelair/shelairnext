-- Migration: add detail page fields to services table

alter table services
  add column if not exists slug             text unique,
  add column if not exists subtitle         text not null default '',
  add column if not exists hero_desc        text not null default '',
  add column if not exists meta_description text not null default '',
  add column if not exists overview         text not null default '',
  add column if not exists benefits         text[]  default '{}',
  add column if not exists stats            jsonb   default '[]',
  add column if not exists process_steps    jsonb   default '[]',
  add column if not exists faqs             jsonb   default '[]',
  add column if not exists related_service_slugs text[] default '{}';

-- ── Seed existing services with slug + detail data ────────────────────────────

update services set
  slug = 'emergency-refrigeration-repairs',
  subtitle = 'Emergency Repairs',
  hero_desc = 'When your refrigeration breaks down at 2am, every minute counts. Our emergency team is on call 24/7 with an average 2-hour response time across South-East Queensland.',
  meta_description = 'When your refrigeration breaks down at 2am, every minute counts. Our emergency team is on call 24/7 with an average 2-hour response time across South-East Queensland.',
  overview = 'A refrigeration breakdown doesn''t wait for business hours — and neither do we. Our emergency repair team carries the most common parts on every van, so we diagnose and fix on the first visit 98% of the time. From compressor failures and refrigerant leaks to electrical faults and defrost issues, we''ve seen it all and fixed it fast.',
  benefits = array['Average 2-hour response time across SEQ','98% first-visit fix rate — no repeat call-outs','Fully stocked vans with common parts','All major brands serviced — Bitzer, Copeland, Danfoss','Post-repair compliance documentation included','Transparent pricing — no hidden call-out fees'],
  stats = '[{"value":"2hr","label":"Avg Response"},{"value":"98%","label":"First-Visit Fix"},{"value":"24/7","label":"Always On Call"},{"value":"500+","label":"Emergencies/Year"}]',
  process_steps = '[{"step":"1","title":"Call Us","desc":"Call our 24/7 emergency line. A qualified technician answers — not a call centre."},{"step":"2","title":"Priority Dispatch","desc":"We dispatch the nearest available technician with the right parts for your system."},{"step":"3","title":"Diagnose & Fix","desc":"On-site diagnosis and repair, typically within a single visit."},{"step":"4","title":"Certify & Document","desc":"Post-repair testing, compliance checks and digital documentation."}]',
  faqs = '[{"q":"How quickly can you get to me?","a":"Our average response time is 2 hours across South-East Queensland, including Brisbane, Gold Coast and Sunshine Coast."},{"q":"Do you charge extra for after-hours call-outs?","a":"We have transparent after-hours rates with no hidden fees. You''ll know the cost before we start work."},{"q":"What brands do you repair?","a":"We service all major commercial air conditioning brands including Bitzer, Copeland, Danfoss, Daikin, Carrier and more."}]',
  related_service_slugs = array['commercial-refrigeration-maintenance','cold-room-construction']
where title = '24/7 Emergency Repairs';

update services set
  slug = 'commercial-refrigeration-maintenance',
  subtitle = 'Preventative Maintenance',
  hero_desc = 'Scheduled maintenance that catches problems before they become costly breakdowns. Extend system life, cut energy costs and stay HACCP-compliant year-round.',
  meta_description = 'Scheduled maintenance that catches problems before they become costly breakdowns. Extend system life, cut energy costs and stay HACCP-compliant year-round.',
  overview = 'Reactive repairs cost 3x more than prevention. Our maintenance plans include quarterly inspections, refrigerant checks, condenser cleaning, electrical testing and compliance documentation — everything you need to keep systems running efficiently and avoid surprise breakdowns.',
  benefits = array['Quarterly scheduled inspections by qualified technicians','Refrigerant pressure and leak testing','Condenser and evaporator cleaning','Electrical connection and safety testing','HACCP compliance documentation and temperature logs','Priority emergency response for plan members'],
  stats = '[{"value":"60%","label":"Fewer Breakdowns"},{"value":"30%","label":"Energy Savings"},{"value":"2x","label":"System Lifespan"},{"value":"100%","label":"HACCP Compliant"}]',
  process_steps = '[{"step":"1","title":"System Audit","desc":"We assess your current systems, age, condition and compliance status."},{"step":"2","title":"Custom Plan","desc":"A maintenance schedule tailored to your equipment and industry requirements."},{"step":"3","title":"Scheduled Visits","desc":"Regular inspections with full reporting and compliance documentation."},{"step":"4","title":"Ongoing Monitoring","desc":"Track system health over time with trend reporting and proactive alerts."}]',
  faqs = '[{"q":"How often do you service?","a":"Most plans include quarterly visits, but we tailor frequency to your system age, usage and compliance needs."},{"q":"Do maintenance plan members get priority for emergencies?","a":"Yes — maintenance plan members receive priority dispatch with guaranteed faster response times."},{"q":"Will this actually save me money?","a":"On average, our clients see 60% fewer breakdowns and 30% lower energy costs within the first year."}]',
  related_service_slugs = array['emergency-refrigeration-repairs','cold-room-construction']
where title = 'Preventative Maintenance';

update services set
  slug = 'haccp-compliance-certification',
  subtitle = 'Compliance & Certification',
  hero_desc = 'Stay audit-ready year-round. We provide post-repair compliance checks, HACCP documentation, temperature logging and certification for food safety, pharmaceutical and council requirements.',
  meta_description = 'Stay audit-ready year-round. We provide post-repair compliance checks, HACCP documentation, temperature logging and certification for food safety, pharmaceutical and council requirements.',
  overview = 'A failed food safety audit can cost your business thousands in fines, forced closures and reputational damage. Our compliance service ensures every repair, maintenance visit and system modification is fully documented to the standard required by EHOs, TGA auditors and HACCP inspectors.',
  benefits = array['Post-repair compliance certificates for every job','HACCP-ready temperature logs and maintenance records','TGA cold chain documentation for pharmaceutical storage','Council compliance assistance for new cold room builds','Digital records retained for 2+ years','On-demand report export for audits and inspections'],
  stats = '[{"value":"100%","label":"Audit Pass Rate"},{"value":"2yr","label":"Records Retained"},{"value":"24/7","label":"Monitoring Available"},{"value":"15yr","label":"Compliance Experience"}]',
  process_steps = '[{"step":"1","title":"System Assessment","desc":"We review your current documentation, equipment and compliance gaps."},{"step":"2","title":"Repair & Certify","desc":"All work is performed by ARCtick-licensed technicians and documented to compliance standard."},{"step":"3","title":"Documentation","desc":"Digital compliance report issued — temperature validation, parts replaced, technician sign-off."},{"step":"4","title":"Ongoing Records","desc":"All records stored in your compliance portal, accessible anytime for audits."}]',
  faqs = '[{"q":"What does a compliance certificate include?","a":"Our compliance certificates document the work performed, refrigerant handled, post-repair temperature validation, and technician ARCtick licence number."},{"q":"Do you provide HACCP documentation?","a":"Yes. Every maintenance visit includes a service report suitable for inclusion in your HACCP records."},{"q":"Can you help with TGA cold chain requirements?","a":"Yes — we are experienced with TGA cold chain guidelines for pharmaceutical cold rooms, including validation protocols and redundant monitoring requirements."}]',
  related_service_slugs = array['commercial-refrigeration-maintenance','refrigeration-temperature-monitoring']
where title = 'Compliance & Certification';

update services set
  slug = 'refrigeration-temperature-monitoring',
  subtitle = 'Smart Monitoring',
  hero_desc = 'IoT-enabled temperature monitoring with real-time cloud dashboards, automated alerts and continuous HACCP logging. Know about problems before your stock is at risk.',
  meta_description = 'IoT-enabled temperature monitoring with real-time cloud dashboards, automated alerts and continuous HACCP logging. Know about problems before your stock is at risk.',
  overview = 'Smart monitoring transforms refrigeration management from reactive to proactive. Wireless sensors inside every cold room and display case transmit temperature data to a cloud dashboard every few minutes. If temperature rises above your threshold, an SMS and email alert is sent immediately.',
  benefits = array['Wireless sensors — no cabling, fast installation','Real-time cloud dashboard accessible from any device','Customisable SMS and email alerts by threshold','Automated HACCP-ready temperature logs with timestamps','Historical data and trend analysis','Multi-site management from a single dashboard'],
  stats = '[{"value":"24/7","label":"Continuous Monitoring"},{"value":"<5min","label":"Alert Response Time"},{"value":"2yr+","label":"Data Retention"},{"value":"30%","label":"Fewer Emergencies"}]',
  process_steps = '[{"step":"1","title":"Site Assessment","desc":"We identify monitoring points — cold rooms, display cases, freezers — and specify the right sensors."},{"step":"2","title":"Installation","desc":"Wireless sensors installed and calibrated. Platform configured with your alert thresholds."},{"step":"3","title":"Dashboard Setup","desc":"Your team is onboarded to the cloud platform with alert contacts configured."},{"step":"4","title":"Ongoing Monitoring","desc":"Continuous data collection, alert management and periodic calibration checks."}]',
  faqs = '[{"q":"How quickly are alerts sent?","a":"Alerts are typically sent within 2–5 minutes of a temperature excursion being detected."},{"q":"Can I monitor multiple sites from one dashboard?","a":"Yes. Our platform supports unlimited sites and monitoring points from a single login."},{"q":"Does this replace manual temperature checks?","a":"For HACCP purposes, automated monitoring with timestamped logs is actually more defensible than manual checks."}]',
  related_service_slugs = array['haccp-compliance-certification','commercial-refrigeration-maintenance']
where title = 'Smart Monitoring';

update services set
  slug = 'refrigeration-energy-audits',
  subtitle = 'Energy Audits & Upgrades',
  hero_desc = 'Comprehensive refrigeration energy assessments that identify savings of 20–30% on typical commercial systems — with a clear upgrade roadmap and payback analysis.',
  meta_description = 'Comprehensive refrigeration energy assessments that identify savings of 20–30% on typical commercial systems — with a clear upgrade roadmap and payback analysis.',
  overview = 'For most food businesses, refrigeration accounts for 30–60% of total electricity costs. Our energy audits systematically identify every source of inefficiency — from dirty condensers and worn door seals to oversized systems and poor defrost scheduling.',
  benefits = array['Full system audit with efficiency benchmarking','Prioritised recommendations with savings estimates','Payback analysis for each upgrade','Condenser cleaning and tune-up included','VSD compressor upgrade assessment','Post-upgrade measurement and verification'],
  stats = '[{"value":"30%","label":"Avg Energy Savings"},{"value":"2yr","label":"Typical Payback"},{"value":"500+","label":"Audits Completed"},{"value":"15yr","label":"Energy Experience"}]',
  process_steps = '[{"step":"1","title":"Baseline Audit","desc":"We measure current energy consumption and identify all inefficiency sources across your refrigeration assets."},{"step":"2","title":"Recommendations","desc":"Prioritised upgrade plan with projected savings, costs and payback periods for each measure."},{"step":"3","title":"Implement Upgrades","desc":"Our team carries out approved upgrades — from quick wins like coil cleaning to compressor upgrades."},{"step":"4","title":"Verify Savings","desc":"Post-upgrade monitoring confirms actual savings delivered against projections."}]',
  faqs = '[{"q":"How much can I realistically save?","a":"Most commercial air conditioning systems have 20–35% efficiency headroom. Our audits consistently find savings within this range."},{"q":"Do I need to replace my whole system?","a":"Rarely. The majority of savings come from maintenance, settings optimisation and targeted component upgrades."},{"q":"How long does an audit take?","a":"A typical commercial site audit takes 2–4 hours on-site, with a written report delivered within 5 business days."}]',
  related_service_slugs = array['commercial-refrigeration-maintenance','refrigeration-temperature-monitoring']
where title = 'Energy Audits & Upgrades';

update services set
  slug = 'cold-room-construction',
  subtitle = 'Cold Room Construction',
  hero_desc = 'When you need new cold storage capacity, our in-house team designs, fabricates and installs custom HACCP-compliant cold rooms built to last.',
  meta_description = 'When you need new cold storage capacity, our in-house team designs, fabricates and installs custom HACCP-compliant cold rooms built to last.',
  overview = 'From single-door coolrooms to multi-zone freezer facilities, we handle every stage — site survey, engineering design, panel fabrication, refrigeration fit-out and commissioning. All builds use high-density polyurethane insulation and food-grade stainless steel finishes.',
  benefits = array['Full design-to-commissioning service','High-density polyurethane insulated panels','Food-grade stainless steel finishes','Energy-efficient refrigeration systems','HACCP and council compliance included','Ongoing maintenance packages available'],
  stats = '[{"value":"200+","label":"Cold Rooms Built"},{"value":"15yr","label":"Avg Panel Life"},{"value":"100%","label":"HACCP Compliant"},{"value":"4wk","label":"Avg Build Time"}]',
  process_steps = '[{"step":"1","title":"Site Survey","desc":"On-site assessment of space, access, power and compliance requirements."},{"step":"2","title":"Design & Quote","desc":"Engineered drawings, equipment specification and detailed fixed-price quote."},{"step":"3","title":"Build & Install","desc":"Panel fabrication, refrigeration fit-out and electrical connection."},{"step":"4","title":"Commission & Certify","desc":"System testing, temperature validation and compliance certification."}]',
  faqs = '[{"q":"How long does a cold room build take?","a":"Most standard builds take 3-4 weeks from approval. Complex multi-zone facilities may take 6-8 weeks."},{"q":"Do you handle council approvals?","a":"Yes — we manage all compliance documentation and can assist with council submissions."},{"q":"Can you retrofit into an existing space?","a":"Absolutely. We specialise in retrofitting cold rooms into existing commercial kitchens and warehouses."}]',
  related_service_slugs = array['emergency-refrigeration-repairs','commercial-refrigeration-maintenance']
where title = 'Cold Room Construction';
