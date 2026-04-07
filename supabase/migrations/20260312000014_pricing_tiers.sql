-- Seed pricing tiers (skip if already seeded)
insert into pricing_tiers (name, description, price, unit, features, popular, position)
select * from (values
  ('Emergency Call-Out', 'For one-off breakdowns and urgent repairs.', 'From $220', 'per call-out',
   array['24/7 availability','2hr avg response','On-site diagnosis','Most repairs same visit','Compliance documentation','All brands serviced'],
   false, 0),
  ('Maintenance Plan', 'Scheduled servicing to prevent breakdowns.', 'From $450', 'per month',
   array['Quarterly servicing visits','Priority emergency response','Filter & component checks','Refrigerant monitoring','Energy efficiency reports','24/7 smart monitoring'],
   true, 1),
  ('Cold Room Build', 'Custom cold room design, fabrication & install.', 'From $15,000', 'project',
   array['Custom engineering','HACCP compliance','High-density insulation','Smart monitoring included','Up to 5yr warranty','Maintenance plan option'],
   false, 2)
) as v(name, description, price, unit, features, popular, position)
where not exists (select 1 from pricing_tiers);
