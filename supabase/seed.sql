-- ============================================================
-- Seed data — run after migrations
-- ============================================================

-- ── Services ────────────────────────────────────────────────
insert into services (icon_name, title, description, position) values
('Clock',       '24/7 Emergency Repairs',       'Round-the-clock emergency breakdown service with rapid response times across Brisbane, Gold Coast and SE Queensland.', 0),
('Wrench',      'Preventative Maintenance',      'Scheduled maintenance plans that catch issues before they become costly breakdowns. Extend system life, cut energy costs and stay compliant.', 1),
('ShieldCheck', 'Compliance & Certification',    'Post-repair compliance checks, HACCP documentation and temperature logging for food safety and pharmaceutical audits.', 2),
('Thermometer', 'Smart Monitoring',              'IoT-enabled temperature monitoring with cloud dashboards, automated alerts and compliance logging.', 3),
('BarChart3',   'Energy Audits & Upgrades',      'Comprehensive energy efficiency assessments and system upgrades that reduce running costs by up to 30% on ageing systems.', 4),
('Snowflake',   'Cold Room Construction',        'When you need new capacity, our in-house team designs, fabricates and installs custom HACCP-compliant cold rooms built to last.', 5);

-- ── Industries ──────────────────────────────────────────────
insert into industries (slug, icon_name, title, short_desc, description, features, position) values
('restaurants-hospitality', 'UtensilsCrossed', 'Restaurants & Hospitality',
 'Walk-in coolrooms and freezers built for commercial kitchens.',
 'Walk-in coolrooms, freezer rooms, and bar refrigeration designed for the demands of commercial kitchens. HACCP-compliant systems that keep your kitchen inspection-ready.',
 array['Walk-in coolrooms','Blast chillers','Bar fridges','HACCP compliance'], 0),

('supermarkets-retail', 'ShoppingCart', 'Supermarkets & Retail',
 'Display cases, cold rooms and multi-temperature zones.',
 'Multi-temperature display cases, cold rooms, and energy-efficient refrigeration systems for retail environments. Maximise product visibility while minimising energy costs.',
 array['Display cases','Multi-temp zones','Night blinds','Energy management'], 1),

('pharmaceuticals', 'Pill', 'Pharmaceuticals',
 'Temperature-critical storage for vaccines and medicines.',
 'Precision temperature-controlled storage for vaccines, medicines, and biological materials. Meets TGA and cold chain requirements with redundant monitoring systems.',
 array['Vaccine storage','TGA compliance','Redundant systems','Audit trails'], 2),

('warehousing-logistics', 'Warehouse', 'Warehousing & Logistics',
 'Large-scale cold storage for distribution centres.',
 'Large-scale cold storage solutions for distribution centres and logistics hubs. Designed for high-throughput operations with dock-level integration.',
 array['Dock integration','Pallet racking','Rapid cycling','Scale flexibility'], 3),

('food-production', 'Factory', 'Food Production',
 'Processing and blast freezing rooms for manufacturers.',
 'Processing rooms, blast freezers, and production-line refrigeration for food manufacturers. Engineered for continuous operation and regulatory compliance.',
 array['Blast freezing','Processing rooms','Clean rooms','Continuous ops'], 4);

-- ── Featured Brands ─────────────────────────────────────────
insert into brands (slug, name, description, speciality, detail, tagline, hero_desc, about, stats, common_issues, services_offered, product_types, related_brands, position) values

('bitzer', 'Bitzer',
 'Semi-hermetic reciprocating and screw compressor repairs, overhauls and preventative maintenance.',
 'Compressors',
 'One of the world''s leading compressor manufacturers — trusted in cold rooms, supermarkets and industrial facilities across Australia.',
 'Authorised Bitzer Compressor Repairs & Servicing',
 'Specialist Bitzer compressor diagnostics, repairs and maintenance. Our technicians are trained on the full Bitzer range — from semi-hermetic reciprocating compressors to screw compressors and condensing units.',
 'Bitzer is one of the world''s leading manufacturers of refrigeration compressors, trusted across commercial and industrial applications. Their semi-hermetic and screw compressors are the backbone of cold rooms, supermarket systems and industrial facilities across Australia. When a Bitzer compressor fails, you need a technician who knows the product inside-out — not a generalist who''s guessing.',
 '[{"value":"500+","label":"Bitzer Repairs"},{"value":"98%","label":"First-Visit Fix"},{"value":"24/7","label":"Emergency Service"},{"value":"15yr","label":"Bitzer Experience"}]',
 '[{"title":"Compressor Burnout","desc":"Electrical or mechanical failure requiring expert diagnosis to identify root cause and prevent recurrence."},{"title":"Oil Logging & Migration","desc":"Incorrect oil levels or migration causing reduced efficiency and potential compressor damage."},{"title":"Valve Plate Failure","desc":"Worn or damaged valve plates reducing compression efficiency and increasing energy consumption."},{"title":"Electrical Contactor Issues","desc":"Failed contactors and overloads causing intermittent starting or complete failure to start."},{"title":"Refrigerant Leaks","desc":"Shaft seal or gasket leaks requiring specialist tools and certified refrigerant handling."},{"title":"Capacity Control Faults","desc":"Unloader or capacity control issues causing systems to run inefficiently or short-cycle."}]',
 array['Emergency compressor repairs — 24/7','Compressor overhauls and rebuilds','Oil analysis and management','Valve plate replacement','Electrical diagnostics and contactor replacement','Refrigerant leak detection and repair','Capacity control servicing','Preventative maintenance programs','Genuine Bitzer parts supply','System efficiency assessments'],
 array['Semi-Hermetic Reciprocating Compressors','Screw Compressors','Scroll Compressors','Condensing Units','Pressure Vessels','Oil Separators'],
 '[{"slug":"copeland","name":"Copeland","desc":"Scroll and semi-hermetic compressor repairs and servicing."},{"slug":"danfoss","name":"Danfoss","desc":"Controls, compressors and valve repairs across all product lines."},{"slug":"daikin","name":"Daikin","desc":"Commercial refrigeration and air conditioning system servicing."}]',
 0),

('copeland', 'Copeland',
 'Scroll and semi-hermetic compressor diagnostics, replacement and efficiency optimisation.',
 'Compressors',
 'Widely used scroll and semi-hermetic compressors found in everything from supermarket display cases to large cold rooms.',
 'Expert Copeland Compressor Repairs & Servicing',
 'Trusted Copeland scroll and semi-hermetic compressor servicing. We diagnose and repair the full Copeland range used in commercial air conditioning and air conditioning systems across SEQ.',
 'Copeland (formerly Emerson Climate Technologies) manufactures some of the most widely used scroll and semi-hermetic compressors in the commercial air conditioning industry. Found in everything from supermarket display cases to cold rooms and food processing facilities, Copeland compressors are reliable — but when they fail, specialist knowledge is essential for fast, correct diagnosis.',
 '[{"value":"400+","label":"Copeland Repairs"},{"value":"98%","label":"First-Visit Fix"},{"value":"24/7","label":"Emergency Service"},{"value":"12yr","label":"Copeland Experience"}]',
 '[{"title":"Scroll Compressor Failure","desc":"Internal scroll wear or seizure requiring replacement or rebuild."},{"title":"Liquid Slugging","desc":"Liquid refrigerant entering the compressor causing mechanical damage."},{"title":"High Discharge Temperature","desc":"Overheating due to low charge, dirty condensers or restricted airflow."},{"title":"Start Component Failure","desc":"Failed start capacitors, relays or run capacitors preventing startup."},{"title":"Oil Return Issues","desc":"Poor oil return causing lubrication failure and compressor wear."},{"title":"Internal Relief Valve Trips","desc":"High compression ratios causing the internal relief to open repeatedly."}]',
 array['Emergency compressor diagnostics and repairs','Scroll compressor replacement','Electrical component testing and replacement','Refrigerant charge correction','Oil level and return system servicing','Condenser cleaning and airflow optimisation','System performance testing','Preventative maintenance contracts','Genuine Copeland parts supply','Compressor upgrade recommendations'],
 array['Scroll Compressors','Semi-Hermetic Compressors','Digital Scroll Compressors','Condensing Units','Compressor Racks'],
 '[{"slug":"bitzer","name":"Bitzer","desc":"Semi-hermetic and screw compressor specialist repairs."},{"slug":"danfoss","name":"Danfoss","desc":"Controls, compressors and valve repairs across all product lines."},{"slug":"daikin","name":"Daikin","desc":"Commercial refrigeration and air conditioning system servicing."}]',
 1),

('danfoss', 'Danfoss',
 'Expansion valves, electronic controllers, pressure controls and variable speed drive repairs.',
 'Controls & Valves',
 'Global leader in refrigeration controls, valves and drives found in virtually every commercial air conditioning system.',
 'Danfoss Controls & Compressor Repairs',
 'Expert servicing of Danfoss controls, valves, compressors and drives. From expansion valve replacements to controller programming and compressor diagnostics.',
 'Danfoss is a global leader in refrigeration controls, valves and compressors. Their products — from electronic expansion valves and pressure controls to variable speed drives and controllers — are found in virtually every commercial air conditioning system. Faults in Danfoss controls can be complex to diagnose without specialist knowledge of their product ecosystem.',
 '[{"value":"300+","label":"Danfoss Jobs/Year"},{"value":"98%","label":"First-Visit Fix"},{"value":"24/7","label":"Emergency Service"},{"value":"10yr","label":"Danfoss Experience"}]',
 '[{"title":"Expansion Valve Failure","desc":"Electronic or thermostatic expansion valves failing to regulate correctly."},{"title":"Controller Faults","desc":"ERC or AK controller errors requiring programming or hardware replacement."},{"title":"Pressure Control Issues","desc":"High/low pressure switches and regulators failing or out of calibration."},{"title":"VSD/Drive Faults","desc":"Variable speed drive errors causing compressor performance issues."},{"title":"Solenoid Valve Failures","desc":"Stuck-open or stuck-closed solenoid valves disrupting system operation."},{"title":"Sensor Faults","desc":"Temperature and pressure sensor failures causing incorrect system responses."}]',
 array['Expansion valve diagnostics and replacement','Controller programming and commissioning','Pressure control calibration and replacement','VSD fault diagnosis and repair','Solenoid valve testing and replacement','Sensor replacement and calibration','System optimisation and tuning','Preventative maintenance','Genuine Danfoss parts supply','Control system upgrades'],
 array['Electronic Expansion Valves','Thermostatic Expansion Valves','Pressure Controls','Electronic Controllers','Variable Speed Drives','Solenoid Valves','Compressors'],
 '[{"slug":"bitzer","name":"Bitzer","desc":"Semi-hermetic and screw compressor specialist repairs."},{"slug":"copeland","name":"Copeland","desc":"Scroll and semi-hermetic compressor repairs and servicing."},{"slug":"daikin","name":"Daikin","desc":"Commercial refrigeration and air conditioning system servicing."}]',
 2);

-- ── Other Brands ─────────────────────────────────────────────
insert into other_brands (name, category, position) values
('Daikin',       'Refrigeration & HVAC', 0),
('Carrier',      'Refrigeration & HVAC', 1),
('Heatcraft',    'Refrigeration',        2),
('Embraco',      'Compressors',          3),
('Tecumseh',     'Compressors',          4),
('Hussmann',     'Display Cases',        5),
('Reflex',       'Controls',             6),
('Kirloskar',    'Compressors',          7),
('Panasonic',    'Refrigeration & HVAC', 8),
('LG Commercial','Refrigeration & HVAC', 9);

-- ── Projects ─────────────────────────────────────────────────
insert into projects (title, type, size, description, position) values
('FreshMart National Fleet',   'Maintenance Contract',   '48 stores',              'Ongoing preventative maintenance across 48 supermarket locations. Reduced emergency call-outs by 60% in the first year through proactive servicing.', 0),
('Harbour Kitchen — Emergency','Emergency Repair',       'Compressor failure',     '2am compressor failure at a high-volume waterfront restaurant. Technician on-site within 90 minutes, system restored before morning prep.', 1),
('PharmaLogix Brisbane',       'Maintenance & Monitoring','120 sqm facility',      'TGA-compliant maintenance contract with 24/7 remote monitoring. Zero temperature excursions since program inception.', 2),
('Aussie Meats Processing',    'Cold Room Build',        '300 sqm blast freezer',  'High-capacity blast freezing facility with processing rooms designed for continuous 24/7 operation. Delivered on time and on budget.', 3),
('GreenGrocer Co-op',          'System Upgrade',         '80 sqm multi-temp',      'Ageing refrigeration system upgraded with energy-efficient compressors and smart monitoring. 28% reduction in energy costs.', 4),
('ColdChain Logistics',        'Emergency + Maintenance','500 sqm warehouse',      'Started with an emergency condenser repair, now a full preventative maintenance client with quarterly servicing across two facilities.', 5);

-- ── Pricing Tiers ────────────────────────────────────────────
insert into pricing_tiers (name, description, price, unit, features, popular, position) values
('Emergency Call-Out',  'For one-off breakdowns and urgent repairs.',        'From $220', 'per call-out',
 array['24/7 availability','2hr avg response','On-site diagnosis','Most repairs same visit','Compliance documentation','All brands serviced'],
 false, 0),
('Maintenance Plan',    'Scheduled servicing to prevent breakdowns.',        'From $450', 'per month',
 array['Quarterly servicing visits','Priority emergency response','Filter & component checks','Refrigerant monitoring','Energy efficiency reports','24/7 smart monitoring'],
 true, 1),
('Cold Room Build',     'Custom cold room design, fabrication & install.',   'From $15,000', 'project',
 array['Custom engineering','HACCP compliance','High-density insulation','Smart monitoring included','Up to 5yr warranty','Maintenance plan option'],
 false, 2);

-- ── Testimonials ─────────────────────────────────────────────
insert into testimonials (name, role, quote, position) values
('Mark Thompson', 'Operations Manager, FreshMart',
 'Shelair delivered our 200sqm cold storage facility two weeks ahead of schedule. The smart monitoring system has already prevented two potential temperature events.', 0),
('Sarah Chen',    'Head Chef, Harbour Kitchen',
 'Finally a contractor who understands compliance. Our new walk-in coolroom passed HACCP inspection on the first visit. The team was professional from day one.', 1),
('David Russo',   'Warehouse Director, PharmaLogix',
 'We needed pharmaceutical-grade cold storage with zero tolerance for temperature deviation. Shelair engineered a system that''s been flawless for 18 months.', 2);

-- ── FAQs ─────────────────────────────────────────────────────
insert into faqs (question, answer, position) values
('How quickly can you respond to an emergency breakdown?',
 'We offer 24/7 emergency call-outs with an average response time of 2 hours across Brisbane, Gold Coast and SE Queensland. For critical systems, we prioritise same-hour dispatch.', 0),
('Do you service all refrigeration brands?',
 'Yes. Our technicians are trained and equipped to service, repair, and maintain all major commercial air conditioning brands including Bitzer, Copeland, Danfoss, Daikin, and more.', 1),
('What does a preventative maintenance plan include?',
 'Our plans include scheduled servicing visits, filter and component checks, refrigerant level monitoring, energy efficiency audits, 24/7 remote monitoring, and priority emergency response.', 2),
('Can you help us pass a HACCP or food safety audit?',
 'Yes. We provide post-repair compliance checks, HACCP documentation and temperature logging. We also design and install HACCP-compliant cold rooms from the ground up.', 3),
('Do you also build new cold rooms?',
 'Yes. Our in-house team designs, fabricates and installs custom cold rooms. We can also retrofit existing rooms with upgraded insulation, compressors and smart monitoring.', 4),
('What areas do you service?',
 'We service Brisbane, Gold Coast, Sunshine Coast and SE Queensland. For large-scale or national clients, we can mobilise teams across Australia.', 5);

-- ── Posts (6 existing articles) ──────────────────────────────

with inserted as (
  insert into posts (slug, type, title, description, meta_description, date, read_time, related_slugs, published) values
  ('haccp-compliant-cold-rooms','Guide','The Complete Guide to HACCP-Compliant Cold Rooms',
   'Everything you need to know about building a cold room that passes food safety inspections.',
   'A complete guide to building HACCP-compliant cold rooms. Covers temperature requirements, documentation, panel specifications, drainage and audit preparation for commercial food businesses.',
   'Feb 2026','8 min read',array['cold-room-insulation-guide','reduce-refrigeration-energy-costs','cold-room-monthly-maintenance'],true)
  returning id
)
insert into post_sections (post_id, heading, content, position) values
((select id from inserted),'What Is HACCP and Why Does It Apply to Cold Rooms?',array['HACCP — Hazard Analysis and Critical Control Points — is the internationally recognised framework for managing food safety risks. In Australia, compliance with HACCP principles is required under the Food Standards Code for any business that handles, stores or processes food commercially.','Your cold room is a Critical Control Point (CCP) in almost every food safety plan. If your refrigeration system fails to maintain safe temperatures, the entire cold chain is compromised. A non-compliant cold room can result in failed health inspections, product recalls, significant fines and reputational damage that takes years to recover from.','Understanding exactly what HACCP compliance means for your cold room — from construction through to daily operation — is the first step to protecting your business.'],0),
((select id from inserted),'Temperature Requirements by Food Category',array['Australian Standard 4674-2004 and the Food Standards Code set the baseline temperature requirements for commercial cold storage. As a rule, chilled food must be stored at or below 5°C, frozen food at or below -15°C, and cool rooms for some produce can operate between 8–12°C.','However, specific industries have tighter requirements. Seafood should ideally be stored at 0–2°C. Ready-to-eat foods, cut fruits and dairy products all have specific guidance. Pharmaceutical cold rooms typically require 2–8°C with tight variation tolerances of ±0.5°C.','Your cold room must not only reach these temperatures — it must maintain them consistently under load, accounting for door openings, stock rotation and ambient temperature changes during Queensland''s summer months.'],1),
((select id from inserted),'Construction Requirements for HACCP Compliance',array['A HACCP-compliant cold room starts with the right materials. Wall and ceiling panels should use high-density polyurethane (PU) foam insulation — minimum 100mm thick for coolrooms, 150mm for freezers — with food-grade stainless steel or powder-coated aluminium facings. All joins must be sealed and coved to prevent harbourage of bacteria.','Flooring must be non-slip, impervious and coved at the junction with walls to a minimum height of 50mm. Drainage must be adequate to handle defrost water and cleaning without pooling. Door seals must be inspected regularly — a worn seal is one of the most common causes of temperature non-compliance.','Lighting inside the cold room must be protected and shatter-resistant. All electrical penetrations must be properly sealed to prevent pest entry. These details are routinely checked during food safety audits.'],2),
((select id from inserted),'Refrigeration System Specifications',array['The refrigeration system itself must be sized correctly for your cold room''s volume, stock load and usage patterns. An undersized system will struggle to recover temperature after door openings and will run continuously, leading to premature failure. Oversized systems short-cycle, reducing efficiency and increasing wear.','For HACCP compliance, you need a system capable of pulling down to target temperature within a defined timeframe and maintaining it continuously. Systems should include high-temperature alarms set at 2°C above the target, and ideally a low-temperature alarm for freezers. Alarms must be audible and, for critical applications, connected to a monitoring system that alerts staff remotely.','Condensers must be positioned for adequate airflow and cleaned at least quarterly. Blocked condenser coils are the leading cause of high-temperature excursions during hot weather.'],3),
((select id from inserted),'Documentation and Record-Keeping',array['HACCP compliance is not just about the physical cold room — it requires documented evidence. You must be able to demonstrate that temperatures are being monitored continuously, that corrective actions are taken when excursions occur, and that your refrigeration system is maintained to schedule.','Temperature records should be logged at minimum every 4 hours, though automated IoT monitoring systems provide continuous records with timestamps that are far more defensible in an audit. Each corrective action — including repair receipts, technician reports and post-repair temperature validation — should be filed and retained for at least 2 years.','Maintenance records must document every service visit, parts replaced, refrigerant handled and compliance checks performed. Shelair provides digital compliance documentation for every repair and scheduled service visit.'],4),
((select id from inserted),'Preparing for a Food Safety Audit',array['When an EHO (Environmental Health Officer) or third-party auditor visits, they will typically check that your cold room temperatures are within spec at the time of inspection, that your monitoring records are complete and accessible, that your cleaning schedule is documented and followed, and that your refrigeration equipment has been professionally serviced.','The most common audit failures relate to incomplete temperature records, unsealed penetrations, worn door seals, and dirty condenser coils. Regular preventative maintenance — ideally on a quarterly schedule — addresses all of these systematically.','If you are preparing for your first HACCP audit or have received a non-compliance notice, contact Shelair. We can conduct a compliance assessment of your cold room and provide the documentation and rectification work needed to pass.'],5);

with inserted as (
  insert into posts (slug, type, title, description, meta_description, date, read_time, related_slugs, published) values
  ('reduce-refrigeration-energy-costs','Article','How to Reduce Commercial Air Conditioning Energy Costs by 30%',
   'Practical strategies for cutting energy consumption without compromising performance.',
   'Proven strategies to reduce commercial air conditioning energy costs by up to 30%. Covers condenser maintenance, door seals, night blinds, system upgrades and smart monitoring for Brisbane businesses.',
   'Jan 2026','6 min read',array['smart-monitoring-roi','haccp-compliant-cold-rooms','cold-room-monthly-maintenance'],true)
  returning id
)
insert into post_sections (post_id, heading, content, position) values
((select id from inserted),'Why Refrigeration Is Your Biggest Energy Cost',array['For most commercial food businesses, refrigeration accounts for 30–60% of total electricity consumption. For supermarkets, that figure can reach 70%. With commercial electricity rates in Queensland now exceeding $0.30/kWh for many businesses, an ageing or poorly maintained refrigeration system is a significant and largely avoidable cost.','The good news is that most commercial air conditioning systems have substantial efficiency headroom. Our energy audits consistently find savings of 25–35% are achievable without capital replacement — through a combination of maintenance, operational adjustments and low-cost upgrades.'],0),
((select id from inserted),'1. Clean Condenser Coils Quarterly',array['A dirty condenser coil is the single biggest driver of inefficiency in commercial air conditioning. When dust, grease and debris accumulate on the condenser, the system has to work significantly harder to reject heat — increasing compressor run time and power consumption by 15–30%.','In Queensland''s climate, condenser coils in food service environments should be cleaned at minimum every quarter. Kitchen environments with heavy grease may need monthly cleaning. This is the highest-ROI maintenance task available and should be the first item on any energy reduction plan.'],1),
((select id from inserted),'2. Inspect and Replace Door Seals',array['A worn or damaged door seal on a coolroom or display case allows warm, humid air to infiltrate continuously. The refrigeration system must work constantly to remove this heat load, consuming additional energy and causing excessive condensation and frost build-up.','Walk-in coolroom door seals should be inspected monthly. A simple test: close the door on a piece of paper — if you can pull it out without resistance, the seal needs replacing. Seal replacement typically costs under $200 but can save thousands in annual energy costs.'],2),
((select id from inserted),'3. Install Night Blinds on Display Cases',array['Open-front display cases in supermarkets and delis are a major source of energy loss — warm store air constantly falls into the case. Installing night blinds reduces this infiltration by up to 40% and can cut display case energy consumption by 25–30% overnight.','Many retailers are surprised to learn that display case energy consumption overnight can be nearly as high as during trading hours. Night blinds address this directly. Payback periods are typically 6–18 months.'],3),
((select id from inserted),'4. Check Refrigerant Charge and System Settings',array['An incorrectly charged refrigeration system operates inefficiently. Low refrigerant charge causes the compressor to run longer, while overcharging raises head pressure and increases power consumption.','Expansion valve settings, cut-in and cut-out pressures, and defrost cycle timing all have a significant impact on energy consumption. These settings drift over time and should be reviewed during annual service.'],4),
((select id from inserted),'5. Consider Variable Speed Drive Compressors',array['Traditional compressors operate at a fixed speed — either fully on or fully off. Variable Speed Drive (VSD) compressors modulate their speed to match actual cooling demand, reducing average power consumption by 20–40% compared to fixed-speed equivalents.','For businesses with significant refrigeration loads, upgrading to VSD compressors delivers substantial ongoing savings. Payback periods of 3–5 years are typical, with significant energy savings throughout the system''s remaining life.'],5),
((select id from inserted),'6. Monitor Continuously with Smart Systems',array['You can''t manage what you don''t measure. IoT-enabled temperature monitoring systems provide continuous data on system performance, allowing you to identify efficiency problems before they become breakdowns.','Smart monitoring dashboards can show you when a condenser is starting to run hot, when a door is being left open, or when a system is short-cycling. Our clients who deploy monitoring consistently identify and address issues 3–4 times faster than those relying on manual checks.'],6);

with inserted as (
  insert into posts (slug, type, title, description, meta_description, date, read_time, related_slugs, published) values
  ('freshmart-cold-storage-case-study','Case Study','FreshMart: 200sqm Multi-Temperature Cold Storage',
   'How we delivered a complex multi-zone facility two weeks ahead of schedule.',
   'Case study: Shelair designs and builds a 200sqm multi-temperature cold storage facility for FreshMart, delivered two weeks ahead of schedule with full HACCP certification.',
   'Dec 2025','5 min read',array['haccp-compliant-cold-rooms','cold-room-insulation-guide','reduce-refrigeration-energy-costs'],true)
  returning id
)
insert into post_sections (post_id, heading, content, position) values
((select id from inserted),'The Client',array['FreshMart is a Brisbane-based independent supermarket group operating four stores across the inner suburbs. Their Mount Gravatt flagship store was undergoing a major expansion — increasing floor area from 800sqm to 1,400sqm — and required a complete rebuild of their cold storage infrastructure.','The project scope included a new coolroom for produce and dairy, a dedicated meat preparation room, a blast freezer for ice cream and frozen goods, and a separate pharmaceutical-grade storage unit for their expanding health and pharmacy section.'],0),
((select id from inserted),'The Challenge',array['The project presented three primary challenges. First, the timeline was tight: FreshMart had contractual obligations to reopen the expanded store within 16 weeks of closing for the refurbishment.','Second, the multi-temperature requirement — four distinct zones ranging from -25°C (blast freezer) to +8°C (pharmaceutical) — required careful thermal engineering to prevent cross-zone heat transfer.','Third, the pharmaceutical storage unit required compliance with TGA cold chain guidelines in addition to standard food safety requirements, meaning stricter tolerances and a detailed validation protocol.'],1),
((select id from inserted),'Our Approach',array['Shelair''s project team began with a detailed site survey and thermal modelling exercise, using the store''s trading data to accurately size each refrigeration system for peak load conditions.','We specified 150mm PU foam panels for the blast freezer and 100mm panels for the remaining zones, with all inter-zone walls designed to provide thermal breaks.','For the pharmaceutical unit, we installed a redundant monitoring system with dual temperature probes, UPS-backed alarms and cloud-connected logging required for TGA compliance.'],2),
((select id from inserted),'The Result',array['The installation was completed in 12 weeks — two weeks ahead of the contracted schedule — allowing FreshMart''s fitout team additional time before the store opening. All four zones passed temperature validation and HACCP inspection on the first attempt.','Twelve months post-installation, all systems are operating at specification. FreshMart has since engaged Shelair on a quarterly maintenance contract across all four stores.'],3),
((select id from inserted),'Key Outcomes',array['Delivered 2 weeks ahead of schedule. Four independent temperature zones from -25°C to +8°C. Full HACCP certification on first inspection. TGA cold chain validation for pharmaceutical storage. Ongoing quarterly maintenance contract across 4 sites.'],4);

with inserted as (
  insert into posts (slug, type, title, description, meta_description, date, read_time, related_slugs, published) values
  ('cold-room-insulation-guide','Guide','Choosing the Right Insulation for Your Cold Room',
   'A comparison of panel types, R-values, and cost implications for commercial applications.',
   'How to choose the right insulation for a commercial cold room. Compares polyurethane, polystyrene and PIR panels, explains R-values and thickness requirements for different temperature zones.',
   'Nov 2025','7 min read',array['haccp-compliant-cold-rooms','freshmart-cold-storage-case-study','reduce-refrigeration-energy-costs'],true)
  returning id
)
insert into post_sections (post_id, heading, content, position) values
((select id from inserted),'Why Insulation Choice Matters',array['The insulation in your cold room panels is the single most important factor in determining long-term running costs, HACCP compliance and system reliability. Poor insulation means your refrigeration system works harder, consumes more energy, and is more likely to fail to maintain temperature under load.','Yet insulation is often the first place corners are cut in cold room construction. Thinner panels and lower-grade materials reduce upfront cost but significantly increase total cost of ownership over the typical 15–20 year life of a cold room.'],0),
((select id from inserted),'The Three Main Panel Types',array['Polyurethane (PU) foam panels are the industry standard for commercial cold rooms in Australia. PU foam has a thermal conductivity of approximately 0.022 W/mK and provides excellent structural rigidity. It is resistant to moisture absorption and maintains its insulating properties over decades.','Expanded Polystyrene (EPS) panels are lower cost but significantly less effective — with a thermal conductivity of approximately 0.038 W/mK, you need nearly double the thickness to achieve the same R-value as PU. EPS is not recommended for freezer applications.','Polyisocyanurate (PIR) panels offer slightly better thermal performance than standard PU and are preferred for deep freeze and pharmaceutical applications. PIR panels typically cost 15–20% more than PU but deliver the best long-term energy performance.'],1),
((select id from inserted),'Understanding R-Values and Thickness Requirements',array['R-value measures thermal resistance — the higher the R-value, the better the insulation. For coolrooms operating at 0–5°C, a minimum of 100mm PU panels (R-value approximately 4.5) is standard. For freezers at -18°C to -25°C, 150mm PU panels are recommended.','Floor insulation is often overlooked. For freezers, inadequate floor insulation leads to frost heave — where moisture in the substrate freezes and expands, cracking the floor slab.'],2),
((select id from inserted),'Panel Facings and Food Safety',array['The outer facing of cold room panels must be smooth, impervious and easy to clean. Food-grade stainless steel (Grade 304) is the premium option — required in meat preparation and processing environments.','All panel joins should be sealed with food-grade sealant and coved at floor junctions to a height of 50mm minimum. This is a HACCP requirement checked during food safety audits.'],3),
((select id from inserted),'Cost vs. Lifetime Value',array['A 200sqm coolroom built with standard 100mm PU panels might cost $8,000–$12,000 less than the same room built with 150mm PIR panels. However, the thinner panel room will typically cost $3,000–$6,000 more per year to run in energy costs.','When commissioning a new cold room, always ask your builder to provide a lifecycle cost comparison across panel options. Shelair provides this analysis as part of our standard quoting process.'],4);

with inserted as (
  insert into posts (slug, type, title, description, meta_description, date, read_time, related_slugs, published) values
  ('cold-room-monthly-maintenance','Video','Cold Room Maintenance: What to Check Monthly',
   'A walkthrough of essential monthly maintenance tasks to prevent costly breakdowns.',
   'Monthly cold room maintenance checklist for commercial operators. Covers door seals, condenser coils, temperature logs, drainage, lighting and evaporator fans — with tips to prevent costly breakdowns.',
   'Oct 2025','4 min read',array['reduce-refrigeration-energy-costs','haccp-compliant-cold-rooms','smart-monitoring-roi'],true)
  returning id
)
insert into post_sections (post_id, heading, content, position) values
((select id from inserted),'Why Monthly Checks Matter',array['Most commercial air conditioning breakdowns don''t happen without warning. They develop gradually — a slightly worn door seal, a condenser that''s slowly blocking up, a drain that''s starting to back up. Monthly visual checks catch these issues at the $200 maintenance stage rather than the $2,000 emergency repair stage.','The following checklist is designed for operational staff — no technical knowledge required. Anything that looks wrong should be flagged to your refrigeration technician at the next scheduled service.'],0),
((select id from inserted),'1. Door Seals and Hinges',array['Check: Close the door and run your hand around the perimeter of the seal. You should not feel any cold air escaping. Visually inspect the seal for cracks, tears, compression set, or sections pulling away from the door.','Also check: Door hinges for stiffness or misalignment. A door that doesn''t hang squarely will never seal properly regardless of seal condition.'],1),
((select id from inserted),'2. Condenser Coil (External Unit)',array['Check: Look at the condenser coil for visible dust, grease or debris build-up. In kitchen environments this can accumulate rapidly. A blocked condenser is the most common cause of high-temperature alarms in summer.','You can clean light dust with a soft brush or low-pressure air. Heavy grease build-up requires a technician with appropriate cleaning chemicals.'],2),
((select id from inserted),'3. Evaporator Fans Inside the Room',array['Check: Stand inside the cold room with the door closed for a moment and listen. All evaporator fans should be running. Unusual noises indicate bearing wear that will progress to failure.','Also check: Ice build-up on the evaporator coil beyond the normal frost between defrosts. Excessive ice build-up suggests a defrost cycle fault or a refrigerant issue.'],3),
((select id from inserted),'4. Temperature Logs',array['Check: Review the last 30 days of temperature records. For automated monitoring systems, check the dashboard for any alarm events or periods where temperature drifted above set point.','A single excursion is often a door left open or a temporary load issue. Repeated excursions at the same time of day suggest a systematic problem that needs investigation.'],4),
((select id from inserted),'5. Drainage',array['Check: The floor drain inside the cold room should be clear and free-flowing. Pour a small amount of water into it — it should drain immediately. A slow drain will lead to water pooling, ice formation and a slip hazard.','Also check the condensate drain tray on the evaporator coil. A blocked condensate drain will overflow and drip water onto stock.'],5),
((select id from inserted),'6. Lighting and Door Switches',array['Check: Cold room lighting should extinguish when the door is closed. A faulty door switch that leaves the light on permanently adds unnecessary heat load inside the room.','Also check: That all light fittings are intact with no broken or cracked covers. Broken light fittings inside a food storage area are a food safety issue that must be rectified immediately.'],6);

with inserted as (
  insert into posts (slug, type, title, description, meta_description, date, read_time, related_slugs, published) values
  ('smart-monitoring-roi','Article','Smart Monitoring Systems: ROI for Commercial Air Conditioning',
   'How IoT monitoring pays for itself within the first year of operation.',
   'How IoT temperature monitoring pays for itself within 12 months for commercial air conditioning. Covers stock loss prevention, energy savings, HACCP compliance and emergency response improvements.',
   'Sep 2025','6 min read',array['reduce-refrigeration-energy-costs','cold-room-monthly-maintenance','haccp-compliant-cold-rooms'],true)
  returning id
)
insert into post_sections (post_id, heading, content, position) values
((select id from inserted),'The Case for Continuous Monitoring',array['Most commercial food businesses still monitor refrigeration temperatures manually — a staff member checks a thermometer once or twice a day and records the reading on a log sheet. This approach only captures a snapshot in time, relies on staff remembering to check, and provides no early warning of developing problems.','IoT-enabled temperature monitoring systems address all three. Wireless sensors transmit temperature data to a cloud dashboard every few minutes. If temperature rises above a set threshold, an alert is sent immediately to management via SMS or email.'],0),
((select id from inserted),'Quantifying the ROI: Stock Loss Prevention',array['The most immediate financial benefit of smart monitoring is preventing stock loss. A single overnight temperature excursion in a seafood coolroom can result in $5,000–$20,000 in spoiled product. An alert sent at 11pm allows a staff member to transfer stock or call an emergency technician — rather than discovering the problem at 7am.','Our clients report that monitoring systems pay for themselves within the first prevented stock loss event. For businesses with high-value stock, a $3,000–$5,000 monitoring installation is cheap insurance.'],1),
((select id from inserted),'Energy Efficiency Through Data',array['Beyond emergency alerts, continuous monitoring data reveals patterns that are invisible to manual checks. A system that runs continuously from 2am–6am every night is showing a symptom — perhaps a blocked condenser coil causing extended recovery times.','Our clients who deploy monitoring consistently identify and rectify efficiency issues 3–4 months earlier than those relying on manual checks. An efficiency improvement of 10% on a $15,000/year electricity bill saves $1,500 annually.'],2),
((select id from inserted),'HACCP Compliance Made Simple',array['For businesses subject to food safety audits, IoT monitoring transforms HACCP documentation from a burdensome manual process to an automatic, defensible record. Every temperature reading is timestamped and stored in the cloud for 2+ years.','During an EHO inspection, you can instantly produce a 90-day temperature record for every cold room and display case in your business. This level of documentation would take hours to compile manually — with monitoring, it takes seconds.'],3),
((select id from inserted),'What Does a Monitoring System Cost?',array['A basic monitoring system for a single cold room typically costs $800–$1,500 installed. For a business with 5–10 monitoring points, expect $3,000–$6,000 for a professionally installed system.','Over a 5-year period, total cost of ownership typically ranges from $5,000–$15,000 for a medium-sized food business. When weighed against a single prevented stock loss event and ongoing energy savings, the ROI for most businesses is measured in months, not years.'],4);
