-- Migration: locations (cities + suburbs)

create table location_cities (
  id                 uuid default gen_random_uuid() primary key,
  slug               text unique not null,
  name               text not null,
  region_description text not null default '',
  stats              jsonb default '[]',
  zones              text[] default '{}',
  sample_suburbs     text[] default '{}',
  position           integer not null default 0
);

create table location_suburbs (
  id                  uuid default gen_random_uuid() primary key,
  city_id             uuid references location_cities(id) on delete cascade not null,
  slug                text not null,
  name                text not null,
  zone                text not null default '',
  business_types      text not null default '',
  venue_types         text[] default '{}',
  local_context_text  text not null default '',
  nearby_suburbs      text[] default '{}',
  position            integer not null default 0,
  unique(city_id, slug)
);

create index location_suburbs_city_id_idx on location_suburbs(city_id);
create index location_cities_slug_idx     on location_cities(slug);

alter table location_cities  enable row level security;
alter table location_suburbs enable row level security;

create policy "Public read cities"   on location_cities  for select using (true);
create policy "Public read suburbs"  on location_suburbs for select using (true);
create policy "Auth manage cities"   on location_cities  for all using (auth.role() = 'authenticated');
create policy "Auth manage suburbs"  on location_suburbs for all using (auth.role() = 'authenticated');

-- ── Seed ─────────────────────────────────────────────────────────────────────

with brisbane as (
  insert into location_cities (slug, name, region_description, stats, zones, sample_suburbs, position)
  values (
    'brisbane', 'Brisbane',
    'South-East Queensland''s capital — from CBD high-rises to suburban shopping centres, we keep Brisbane''s cold chains running 24/7.',
    '[{"label":"Avg Response","value":"90 min"},{"label":"Brisbane Jobs Done","value":"1,800+"},{"label":"First-Visit Fix","value":"98%"},{"label":"Local Techs","value":"12"}]',
    array['CBD','Northside','Southside','Bayside','Logan'],
    array['Fortitude Valley','Chermside','Mount Gravatt','Wynnum','Logan Central','South Brisbane'],
    0
  ) returning id
)
insert into location_suburbs (city_id, slug, name, zone, business_types, venue_types, local_context_text, nearby_suburbs, position) values
((select id from brisbane),'fortitude-valley','Fortitude Valley','CBD','Bars, restaurants & nightlife venues',array['Cocktail Bars','Nightclubs','Fine Dining','Cafés'],'Fortitude Valley is Brisbane''s premier entertainment and dining precinct. With hundreds of restaurants, bars and cafés operating late into the night, reliable refrigeration isn''t optional — it''s critical to survival. Our techs are on-call 24/7 to keep your venue running.',array['South Brisbane','Newstead','Bowen Hills'],0),
((select id from brisbane),'south-brisbane','South Brisbane','CBD','Cultural precinct restaurants & cafés',array['Cafés','Restaurants','Convention Centres','Hotels'],'Home to South Bank and the Brisbane Convention Centre, South Brisbane demands impeccable food safety standards across high-traffic hospitality venues. We provide rapid-response repairs and scheduled maintenance to keep you compliant.',array['Fortitude Valley','West End','Woolloongabba'],1),
((select id from brisbane),'newstead','Newstead','CBD','Modern eateries & boutique grocers',array['Boutique Grocers','Restaurants','Breweries','Cafés'],'Newstead''s rapidly growing dining scene includes craft breweries, upscale restaurants and specialty food retailers. Our preventative maintenance plans keep your systems efficient and your produce fresh.',array['Fortitude Valley','Bowen Hills','Teneriffe'],2),
((select id from brisbane),'chermside','Chermside','Northside','Shopping centre food courts & supermarkets',array['Shopping Centres','Supermarkets','Fast Food','Medical Centres'],'Chermside is anchored by Westfield Chermside, one of Queensland''s largest shopping centres. The food court and supermarket tenants rely on uninterrupted refrigeration — and we''re the team they call when things go wrong.',array['Aspley','Kedron','Stafford'],3),
((select id from brisbane),'aspley','Aspley','Northside','Suburban restaurants & aged care facilities',array['Restaurants','Aged Care','Childcare Centres','Takeaway'],'Aspley''s mix of family restaurants, aged care facilities and childcare centres each have strict temperature compliance needs. We offer tailored maintenance plans for every facility type.',array['Chermside','Zillmere','Geebung'],4),
((select id from brisbane),'kedron','Kedron','Northside','Local cafés & food production',array['Cafés','Bakeries','Small Manufacturers','Delis'],'Kedron''s small business community includes bakeries, delis and boutique food producers who depend on consistent cold storage. Our techs know the area and provide fast, reliable service.',array['Chermside','Stafford','Lutwyche'],5),
((select id from brisbane),'mount-gravatt','Mount Gravatt','Southside','Restaurants, pubs & food warehouses',array['Pubs','Restaurants','Warehouses','Wholesalers'],'Mount Gravatt''s commercial strip and nearby industrial areas house restaurants, pubs and food distribution warehouses. We service everything from single coolrooms to multi-zone warehouse systems.',array['Holland Park','Upper Mount Gravatt','Sunnybank'],6),
((select id from brisbane),'sunnybank','Sunnybank','Southside','Asian dining precincts & fresh markets',array['Asian Restaurants','Fresh Markets','Supermarkets','Bakeries'],'Sunnybank is famous for its vibrant Asian dining scene and fresh food markets. High foot traffic means high refrigeration demand — our emergency repairs get you back online fast.',array['Mount Gravatt','Runcorn','Robertson'],7),
((select id from brisbane),'wynnum','Wynnum','Bayside','Seafood restaurants & waterfront dining',array['Seafood Restaurants','Fish Markets','Cafés','Pubs'],'Wynnum''s waterfront dining precinct serves some of Brisbane''s freshest seafood. When your coolroom goes down, every minute counts — our bayside techs respond in under 90 minutes.',array['Manly','Lota','Tingalpa'],8),
((select id from brisbane),'manly','Manly','Bayside','Marina hospitality & boat clubs',array['Yacht Clubs','Restaurants','Cafés','Fish & Chips'],'Manly''s marina and harbour precinct attracts locals and tourists alike. The restaurants and clubs here need reliable cold storage year-round, especially during peak summer season.',array['Wynnum','Lota','Wellington Point'],9),
((select id from brisbane),'logan-central','Logan Central','Logan','Multicultural food retailers & wholesalers',array['Ethnic Grocers','Wholesalers','Restaurants','Butchers'],'Logan Central''s diverse food retail landscape includes ethnic grocers, butchers and wholesalers. We service all refrigeration brands and system types across the Logan corridor.',array['Woodridge','Underwood','Springwood'],10),
((select id from brisbane),'springwood','Springwood','Logan','Shopping centres & medical facilities',array['Shopping Centres','Pharmacies','Medical Centres','Supermarkets'],'Springwood''s commercial hub includes Arndale Shopping Centre and surrounding medical and retail businesses. Our maintenance contracts cover everything from display fridges to pharmaceutical cold storage.',array['Logan Central','Underwood','Daisy Hill'],11);

with gold_coast as (
  insert into location_cities (slug, name, region_description, stats, zones, sample_suburbs, position)
  values (
    'gold-coast', 'Gold Coast',
    'From Surfers Paradise to Coolangatta — fast emergency repairs and maintenance for the Coast''s booming hospitality industry.',
    '[{"label":"Avg Response","value":"2 hrs"},{"label":"Gold Coast Jobs","value":"900+"},{"label":"First-Visit Fix","value":"97%"},{"label":"Local Techs","value":"6"}]',
    array['Surfers Paradise','Broadbeach','Southport','Robina','Coolangatta'],
    array['Surfers Paradise','Broadbeach','Southport','Robina','Burleigh Heads','Coolangatta'],
    1
  ) returning id
)
insert into location_suburbs (city_id, slug, name, zone, business_types, venue_types, local_context_text, nearby_suburbs, position) values
((select id from gold_coast),'surfers-paradise','Surfers Paradise','Surfers Paradise','Hotels, resorts & tourist dining',array['Hotels','Resorts','Restaurants','Bars'],'Surfers Paradise is the Gold Coast''s tourism epicentre. Hotels and restaurants here can''t afford downtime — our 24/7 emergency service keeps your guests comfortable and your kitchens compliant.',array['Broadbeach','Main Beach','Southport'],0),
((select id from gold_coast),'broadbeach','Broadbeach','Broadbeach','Convention centres & fine dining',array['Convention Centres','Fine Dining','Cafés','Bars'],'Home to The Star and the Gold Coast Convention Centre, Broadbeach is a hub for premium dining. We provide preventative maintenance to keep these high-profile venues running smoothly.',array['Surfers Paradise','Mermaid Beach','Robina'],1),
((select id from gold_coast),'southport','Southport','Southport','Medical precincts & retail centres',array['Hospitals','Pharmacies','Shopping Centres','Restaurants'],'Southport''s medical precinct and Australia Fair shopping centre require temperature-critical refrigeration for pharmaceutical storage and food retail.',array['Surfers Paradise','Labrador','Runaway Bay'],2),
((select id from gold_coast),'robina','Robina','Robina','Town centres & sports facilities',array['Shopping Centres','Sports Venues','Restaurants','Supermarkets'],'Robina Town Centre and the surrounding commercial district house major retail and dining tenants. Our scheduled maintenance plans prevent costly breakdowns during peak trade.',array['Broadbeach','Varsity Lakes','Mudgeeraba'],3),
((select id from gold_coast),'burleigh-heads','Burleigh Heads','Broadbeach','Beachside cafés & boutique dining',array['Cafés','Restaurants','Juice Bars','Gelato Shops'],'Burleigh Heads'' trendy café scene demands reliable refrigeration for fresh produce and specialty beverages. We keep Burleigh cool from dawn service to late-night dining.',array['Broadbeach','Palm Beach','Miami'],4),
((select id from gold_coast),'coolangatta','Coolangatta','Coolangatta','Airport dining & surf clubs',array['Airport Restaurants','Surf Clubs','Hotels','Cafés'],'Coolangatta serves as the gateway to the Gold Coast with airport dining and beachside venues. Our southern Gold Coast techs provide fast response times for this border region.',array['Tweed Heads','Kirra','Bilinga'],5);

with sunshine_coast as (
  insert into location_cities (slug, name, region_description, stats, zones, sample_suburbs, position)
  values (
    'sunshine-coast', 'Sunshine Coast',
    'Noosa to Caloundra — expert refrigeration maintenance and emergency repairs for the Sunshine Coast''s growing food and hospitality sector.',
    '[{"label":"Avg Response","value":"2 hrs"},{"label":"Sunshine Coast Jobs","value":"600+"},{"label":"First-Visit Fix","value":"97%"},{"label":"Local Techs","value":"4"}]',
    array['Noosa','Maroochydore','Caloundra','Nambour','Coolum'],
    array['Noosa Heads','Maroochydore','Caloundra','Mooloolaba','Nambour','Coolum Beach'],
    2
  ) returning id
)
insert into location_suburbs (city_id, slug, name, zone, business_types, venue_types, local_context_text, nearby_suburbs, position) values
((select id from sunshine_coast),'noosa-heads','Noosa Heads','Noosa','Premium dining & boutique hotels',array['Fine Dining','Boutique Hotels','Cafés','Delicatessens'],'Noosa Heads is synonymous with premium dining on Hastings Street. These high-end restaurants demand impeccable refrigeration uptime — we deliver with priority service contracts.',array['Noosaville','Sunshine Beach','Tewantin'],0),
((select id from sunshine_coast),'maroochydore','Maroochydore','Maroochydore','CBD dining & retail centres',array['Shopping Centres','Restaurants','Supermarkets','Office Buildings'],'As the Sunshine Coast''s commercial hub, Maroochydore''s Sunshine Plaza and surrounding businesses rely on consistent cold chain management. Our local team is just minutes away.',array['Mooloolaba','Alexandra Headland','Buderim'],1),
((select id from sunshine_coast),'caloundra','Caloundra','Caloundra','Seaside hospitality & aged care',array['Restaurants','Cafés','Aged Care','RSL Clubs'],'Caloundra''s seaside restaurants and growing aged care sector both need reliable, compliant refrigeration. We offer tailored maintenance plans for every business type in the region.',array['Golden Beach','Moffat Beach','Pelican Waters'],2),
((select id from sunshine_coast),'mooloolaba','Mooloolaba','Maroochydore','Wharf dining & seafood markets',array['Seafood Restaurants','Fish Markets','Cafés','Ice Creameries'],'Mooloolaba''s iconic Wharf precinct and Esplanade dining strip serve fresh seafood daily. When your coolroom fails, our techs respond fast to protect your stock and reputation.',array['Maroochydore','Alexandra Headland','Buderim'],3),
((select id from sunshine_coast),'nambour','Nambour','Nambour','Regional food processing & retail',array['Food Processors','Supermarkets','Butchers','Bakeries'],'Nambour''s hinterland location makes it a hub for regional food processing and distribution. We service large-scale coolrooms and blast freezers for manufacturers and wholesalers.',array['Woombye','Palmwoods','Yandina'],4),
((select id from sunshine_coast),'coolum-beach','Coolum Beach','Coolum','Resort hospitality & surf clubs',array['Resorts','Surf Clubs','Restaurants','Cafés'],'Coolum Beach''s resort and hospitality businesses need refrigeration they can count on, especially during the busy holiday season. Our preventative maintenance keeps you running year-round.',array['Peregian Beach','Marcoola','Yandina'],5);
