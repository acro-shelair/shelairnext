-- Migration: add detail page fields to industries table

alter table industries
  add column if not exists subtitle             text not null default '',
  add column if not exists hero_desc            text not null default '',
  add column if not exists meta_description     text not null default '',
  add column if not exists stats                jsonb default '[]',
  add column if not exists challenges           jsonb default '[]',
  add column if not exists industry_services    jsonb default '[]',
  add column if not exists case_study           jsonb default 'null',
  add column if not exists related_industry_slugs text[] default '{}';

-- ── Seed existing industries with detail data ─────────────────────────────────

update industries set
  subtitle = 'Restaurants & Hospitality',
  hero_desc = 'Your kitchen can''t afford downtime. We provide 24/7 emergency repairs, scheduled maintenance and compliance servicing for commercial kitchens, hotels and venues across South-East Queensland.',
  meta_description = 'Commercial refrigeration repairs and maintenance for restaurants and hospitality venues. 24/7 emergency response, HACCP compliance servicing across Brisbane & SE Queensland.',
  stats = '[{"value":"2hr","label":"Avg Response"},{"value":"500+","label":"Kitchens Serviced"},{"value":"98%","label":"First-Visit Fix"},{"value":"24/7","label":"Emergency Service"}]',
  challenges = '[{"title":"Peak-Hour Breakdowns","desc":"A fridge failure during Friday dinner service means spoiled stock, lost revenue and unhappy customers."},{"title":"HACCP Compliance","desc":"Health inspections require documented temperature logs and maintenance records — gaps mean fines."},{"title":"Multiple Systems","desc":"Walk-ins, under-counter units, display cases and ice machines — all different brands, all needing service."}]',
  industry_services = '[{"icon_name":"Clock","title":"24/7 Emergency Repairs","desc":"Priority dispatch for kitchen breakdowns — average 2-hour response, day or night."},{"icon_name":"Wrench","title":"Preventative Maintenance","desc":"Quarterly servicing plans that keep systems running and HACCP documentation current."},{"icon_name":"ShieldCheck","title":"Compliance Servicing","desc":"Post-repair certification, temperature logging and audit-ready documentation."},{"icon_name":"Snowflake","title":"Cold Room Builds","desc":"Custom walk-in coolrooms and freezers designed for your kitchen layout and capacity."},{"icon_name":"Thermometer","title":"Smart Monitoring","desc":"IoT temperature sensors with alerts — know about problems before stock is at risk."},{"icon_name":"BarChart3","title":"Energy Audits","desc":"Reduce refrigeration running costs by up to 30% with targeted efficiency upgrades."}]',
  case_study = '{"company":"La Piazza Restaurant Group","challenge":"Frequent breakdowns across 4 venues, averaging 2 emergency call-outs per month with significant stock losses.","solution":"Implemented quarterly preventative maintenance across all venues with smart temperature monitoring.","result":"Zero unplanned breakdowns in 12 months. Annual refrigeration costs reduced by 40%."}',
  related_industry_slugs = array['supermarkets-retail','food-production']
where slug = 'restaurants-hospitality';

update industries set
  subtitle = 'Supermarkets & Retail',
  hero_desc = 'Protect your stock and your margins. Rapid-response breakdown service, scheduled maintenance and energy optimisation for display cases, cold rooms and multi-temperature systems.',
  meta_description = 'Commercial refrigeration repairs for supermarkets and retail. Rapid breakdown response, energy optimisation and compliance servicing across Brisbane & SE Queensland.',
  stats = '[{"value":"2hr","label":"Avg Response"},{"value":"30%","label":"Energy Savings"},{"value":"200+","label":"Stores Serviced"},{"value":"99.5%","label":"Uptime Target"}]',
  challenges = '[{"title":"Stock Loss Risk","desc":"A single display case failure can mean thousands in spoiled produce, dairy and meat."},{"title":"Energy Costs","desc":"Refrigeration accounts for 60-70% of a supermarket''s electricity bill — inefficiency is expensive."},{"title":"Customer Experience","desc":"Warm display cases and frosted-over freezers drive customers to competitors."}]',
  industry_services = '[{"icon_name":"Clock","title":"Rapid Breakdown Response","desc":"Priority dispatch for display case, cold room and freezer failures."},{"icon_name":"Wrench","title":"Scheduled Maintenance","desc":"Regular servicing to prevent breakdowns and maintain food safety compliance."},{"icon_name":"BarChart3","title":"Energy Optimisation","desc":"Audits and upgrades that cut refrigeration energy costs by up to 30%."},{"icon_name":"Thermometer","title":"Temperature Monitoring","desc":"Cloud-connected sensors with automated alerts for every case and cold room."},{"icon_name":"Snowflake","title":"New Installations","desc":"Display cases, cold rooms and freezer systems for new stores or refits."},{"icon_name":"ShieldCheck","title":"Compliance & Reporting","desc":"Automated temperature logging and maintenance records for food safety audits."}]',
  case_study = '{"company":"FreshMart Supermarkets","challenge":"12 stores experiencing frequent display case breakdowns, high energy costs and compliance gaps.","solution":"Comprehensive maintenance contracts with energy audits and IoT monitoring across all sites.","result":"60% fewer breakdowns, 28% energy cost reduction, full compliance across all stores."}',
  related_industry_slugs = array['restaurants-hospitality','food-production']
where slug = 'supermarkets-retail';

update industries set
  subtitle = 'Pharmaceuticals',
  hero_desc = 'Precision temperature-controlled storage for vaccines, medicines and biological materials. TGA-compliant cold chain systems with redundant monitoring and full audit trails.',
  meta_description = 'Pharmaceutical refrigeration — TGA-compliant cold chain storage for vaccines and medicines. Redundant monitoring, validation protocols and emergency response across SE Queensland.',
  stats = '[{"value":"±0.5°C","label":"Temperature Accuracy"},{"value":"100%","label":"TGA Compliant"},{"value":"24/7","label":"Monitoring & Alerts"},{"value":"2hr","label":"Emergency Response"}]',
  challenges = '[{"title":"Strict Temperature Tolerances","desc":"Vaccines and biological materials require tight temperature bands — a single excursion can render stock non-compliant."},{"title":"TGA & Cold Chain Requirements","desc":"The TGA cold chain guidelines require validated storage systems, continuous logging and documented corrective action procedures."},{"title":"Redundancy Requirements","desc":"Pharmaceutical cold storage requires backup power, redundant monitoring and emergency response protocols."}]',
  industry_services = '[{"icon_name":"Clock","title":"Priority Emergency Response","desc":"Pharmaceutical cold room failures trigger immediate priority dispatch."},{"icon_name":"Wrench","title":"Validation & Commissioning","desc":"Temperature mapping studies and qualification protocols (IQ/OQ/PQ) for new cold rooms."},{"icon_name":"ShieldCheck","title":"TGA Compliance Documentation","desc":"Maintenance records, excursion reports and corrective action documentation for TGA audits."},{"icon_name":"Thermometer","title":"Redundant Monitoring","desc":"Dual-probe monitoring systems with UPS-backed alerts and cloud logging."},{"icon_name":"BarChart3","title":"Preventative Maintenance","desc":"Scheduled servicing with documentation included as standard."},{"icon_name":"Snowflake","title":"Cold Room Builds","desc":"Pharmaceutical cold rooms designed to TGA specifications with validation protocols."}]',
  case_study = '{"company":"MedStore Pharmacy Group","challenge":"Expanding vaccine storage across 6 locations, each requiring TGA-compliant cold rooms with validated monitoring.","solution":"Installed standardised 2–8°C pharmaceutical cold rooms with dual-probe monitoring, UPS backup and cloud logging across all sites.","result":"All 6 sites passed TGA cold chain audit on first inspection. Zero vaccine excursions in 18 months."}',
  related_industry_slugs = array['warehousing-logistics','food-production']
where slug = 'pharmaceuticals';

update industries set
  subtitle = 'Warehousing & Logistics',
  hero_desc = 'Large-scale cold storage solutions for distribution centres and logistics hubs. High-throughput systems engineered for continuous operation, dock integration and scale flexibility.',
  meta_description = 'Cold storage refrigeration for warehousing and logistics. Large-scale DC systems, multi-zone monitoring and planned maintenance for continuous operation across SE Queensland.',
  stats = '[{"value":"<4hr","label":"Emergency Response"},{"value":"50+","label":"DCs Serviced"},{"value":"24/7","label":"On Call"},{"value":"15yr","label":"Industry Experience"}]',
  challenges = '[{"title":"Continuous Operation","desc":"Distribution centres operate 24/7 — any refrigeration downtime directly impacts order fulfilment and customer contracts."},{"title":"High-Throughput Door Cycling","desc":"Constant forklift and dock activity creates extreme door cycling loads that standard cold rooms are not designed to handle."},{"title":"Multi-Temperature Zones","desc":"Modern DCs require ambient, chilled and frozen zones — each with different system requirements."}]',
  industry_services = '[{"icon_name":"Clock","title":"Priority Emergency Response","desc":"Dedicated response teams for distribution centre breakdowns."},{"icon_name":"Wrench","title":"Planned Maintenance Programs","desc":"Maintenance schedules designed around your operational windows."},{"icon_name":"Snowflake","title":"Large-Scale Cold Room Builds","desc":"Multi-zone cold storage for pallet racking, dock integration and high door-cycling."},{"icon_name":"Thermometer","title":"Multi-Zone Monitoring","desc":"Centralised monitoring across all temperature zones with automated compliance logging."},{"icon_name":"BarChart3","title":"Energy Management","desc":"Energy audits and VSD upgrades that reduce refrigeration costs significantly."},{"icon_name":"ShieldCheck","title":"Compliance & Documentation","desc":"Cold chain documentation and corrective action logs for regulatory requirements."}]',
  case_study = '{"company":"ColdChain Logistics QLD","challenge":"Ageing refrigeration across a 4,000sqm DC causing frequent breakdowns and threatening cold chain compliance.","solution":"Complete refrigeration plant overhaul with new VSD compressors, multi-zone monitoring and quarterly maintenance.","result":"Zero unplanned breakdowns in 24 months. Energy costs reduced by 32%. Cold chain compliance maintained for all client audits."}',
  related_industry_slugs = array['food-production','supermarkets-retail']
where slug = 'warehousing-logistics';

update industries set
  subtitle = 'Food Production',
  hero_desc = 'Keep your production line moving. Continuous-operation servicing for processing rooms, blast freezers and production-line refrigeration systems.',
  meta_description = 'Commercial refrigeration for food production and manufacturing. Blast freezer servicing, processing room maintenance and compliance documentation across SE Queensland.',
  stats = '[{"value":"<4hr","label":"Response Time"},{"value":"100+","label":"Factories Serviced"},{"value":"24/7","label":"On Call"},{"value":"15yr","label":"Industry Experience"}]',
  challenges = '[{"title":"Production Downtime","desc":"Every hour of refrigeration failure shuts down production lines and delays shipments."},{"title":"Blast Freezer Reliability","desc":"Blast freezers run at extreme loads — they need specialist servicing to maintain performance."},{"title":"Regulatory Compliance","desc":"Export-grade facilities require strict temperature documentation and audit trails."}]',
  industry_services = '[{"icon_name":"Clock","title":"Priority Emergency Service","desc":"Dedicated response teams for production-critical breakdowns."},{"icon_name":"Wrench","title":"Preventative Programs","desc":"Scheduled maintenance designed around your production cycles."},{"icon_name":"Snowflake","title":"Blast Freezer Servicing","desc":"Specialist maintenance for high-capacity blast freezing systems."},{"icon_name":"Thermometer","title":"Process Monitoring","desc":"Continuous temperature monitoring with automated compliance logging."},{"icon_name":"ShieldCheck","title":"Compliance Documentation","desc":"Full audit trails for food safety, export and regulatory requirements."},{"icon_name":"BarChart3","title":"Efficiency Upgrades","desc":"System upgrades that reduce energy costs while maintaining performance."}]',
  case_study = '{"company":"Pacific Seafood Processing","challenge":"Ageing blast freezers causing intermittent shutdowns, risking export compliance and delivery schedules.","solution":"Comprehensive overhaul of refrigeration systems with preventative maintenance and real-time monitoring.","result":"Zero unplanned shutdowns in 18 months. Export compliance maintained with automated documentation."}',
  related_industry_slugs = array['supermarkets-retail','restaurants-hospitality']
where slug = 'food-production';
