export interface Suburb {
  slug: string;
  name: string;
  zone: string;
  businessTypes: string;
  venueTypes: string[];
  localContextText: string;
  nearbySuburbs: string[];
}

export interface CityData {
  slug: string;
  name: string;
  regionDescription: string;
  stats: { label: string; value: string }[];
  zones: string[];
  suburbs: Suburb[];
  sampleSuburbs: string[];
}

export const cities: CityData[] = [
  {
    slug: "brisbane",
    name: "Brisbane",
    regionDescription:
      "South-East Queensland's capital — from CBD high-rises to suburban shopping centres, we keep Brisbane's cold chains running 24/7.",
    stats: [
      { label: "Avg Response", value: "90 min" },
      { label: "Brisbane Jobs Done", value: "1,800+" },
      { label: "First-Visit Fix", value: "98%" },
      { label: "Local Techs", value: "12" },
    ],
    zones: ["CBD", "Northside", "Southside", "Bayside", "Logan"],
    sampleSuburbs: ["Fortitude Valley", "Chermside", "Mount Gravatt", "Wynnum", "Logan Central", "South Brisbane"],
    suburbs: [
      { slug: "fortitude-valley", name: "Fortitude Valley", zone: "CBD", businessTypes: "Bars, restaurants & nightlife venues", venueTypes: ["Cocktail Bars", "Nightclubs", "Fine Dining", "Cafés"], localContextText: "Fortitude Valley is Brisbane's premier entertainment and dining precinct. With hundreds of restaurants, bars and cafés operating late into the night, reliable refrigeration isn't optional — it's critical to survival. Our techs are on-call 24/7 to keep your venue running.", nearbySuburbs: ["South Brisbane", "Newstead", "Bowen Hills"] },
      { slug: "south-brisbane", name: "South Brisbane", zone: "CBD", businessTypes: "Cultural precinct restaurants & cafés", venueTypes: ["Cafés", "Restaurants", "Convention Centres", "Hotels"], localContextText: "Home to South Bank and the Brisbane Convention Centre, South Brisbane demands impeccable food safety standards across high-traffic hospitality venues. We provide rapid-response repairs and scheduled maintenance to keep you compliant.", nearbySuburbs: ["Fortitude Valley", "West End", "Woolloongabba"] },
      { slug: "newstead", name: "Newstead", zone: "CBD", businessTypes: "Modern eateries & boutique grocers", venueTypes: ["Boutique Grocers", "Restaurants", "Breweries", "Cafés"], localContextText: "Newstead's rapidly growing dining scene includes craft breweries, upscale restaurants and specialty food retailers. Our preventative maintenance plans keep your systems efficient and your produce fresh.", nearbySuburbs: ["Fortitude Valley", "Bowen Hills", "Teneriffe"] },
      { slug: "chermside", name: "Chermside", zone: "Northside", businessTypes: "Shopping centre food courts & supermarkets", venueTypes: ["Shopping Centres", "Supermarkets", "Fast Food", "Medical Centres"], localContextText: "Chermside is anchored by Westfield Chermside, one of Queensland's largest shopping centres. The food court and supermarket tenants rely on uninterrupted refrigeration — and we're the team they call when things go wrong.", nearbySuburbs: ["Aspley", "Kedron", "Stafford"] },
      { slug: "aspley", name: "Aspley", zone: "Northside", businessTypes: "Suburban restaurants & aged care facilities", venueTypes: ["Restaurants", "Aged Care", "Childcare Centres", "Takeaway"], localContextText: "Aspley's mix of family restaurants, aged care facilities and childcare centres each have strict temperature compliance needs. We offer tailored maintenance plans for every facility type.", nearbySuburbs: ["Chermside", "Zillmere", "Geebung"] },
      { slug: "kedron", name: "Kedron", zone: "Northside", businessTypes: "Local cafés & food production", venueTypes: ["Cafés", "Bakeries", "Small Manufacturers", "Delis"], localContextText: "Kedron's small business community includes bakeries, delis and boutique food producers who depend on consistent cold storage. Our techs know the area and provide fast, reliable service.", nearbySuburbs: ["Chermside", "Stafford", "Lutwyche"] },
      { slug: "mount-gravatt", name: "Mount Gravatt", zone: "Southside", businessTypes: "Restaurants, pubs & food warehouses", venueTypes: ["Pubs", "Restaurants", "Warehouses", "Wholesalers"], localContextText: "Mount Gravatt's commercial strip and nearby industrial areas house restaurants, pubs and food distribution warehouses. We service everything from single coolrooms to multi-zone warehouse systems.", nearbySuburbs: ["Holland Park", "Upper Mount Gravatt", "Sunnybank"] },
      { slug: "sunnybank", name: "Sunnybank", zone: "Southside", businessTypes: "Asian dining precincts & fresh markets", venueTypes: ["Asian Restaurants", "Fresh Markets", "Supermarkets", "Bakeries"], localContextText: "Sunnybank is famous for its vibrant Asian dining scene and fresh food markets. High foot traffic means high refrigeration demand — our emergency repairs get you back online fast.", nearbySuburbs: ["Mount Gravatt", "Runcorn", "Robertson"] },
      { slug: "wynnum", name: "Wynnum", zone: "Bayside", businessTypes: "Seafood restaurants & waterfront dining", venueTypes: ["Seafood Restaurants", "Fish Markets", "Cafés", "Pubs"], localContextText: "Wynnum's waterfront dining precinct serves some of Brisbane's freshest seafood. When your coolroom goes down, every minute counts — our bayside techs respond in under 90 minutes.", nearbySuburbs: ["Manly", "Lota", "Tingalpa"] },
      { slug: "manly", name: "Manly", zone: "Bayside", businessTypes: "Marina hospitality & boat clubs", venueTypes: ["Yacht Clubs", "Restaurants", "Cafés", "Fish & Chips"], localContextText: "Manly's marina and harbour precinct attracts locals and tourists alike. The restaurants and clubs here need reliable cold storage year-round, especially during peak summer season.", nearbySuburbs: ["Wynnum", "Lota", "Wellington Point"] },
      { slug: "logan-central", name: "Logan Central", zone: "Logan", businessTypes: "Multicultural food retailers & wholesalers", venueTypes: ["Ethnic Grocers", "Wholesalers", "Restaurants", "Butchers"], localContextText: "Logan Central's diverse food retail landscape includes ethnic grocers, butchers and wholesalers. We service all refrigeration brands and system types across the Logan corridor.", nearbySuburbs: ["Woodridge", "Underwood", "Springwood"] },
      { slug: "springwood", name: "Springwood", zone: "Logan", businessTypes: "Shopping centres & medical facilities", venueTypes: ["Shopping Centres", "Pharmacies", "Medical Centres", "Supermarkets"], localContextText: "Springwood's commercial hub includes Arndale Shopping Centre and surrounding medical and retail businesses. Our maintenance contracts cover everything from display fridges to pharmaceutical cold storage.", nearbySuburbs: ["Logan Central", "Underwood", "Daisy Hill"] },
    ],
  },
  {
    slug: "gold-coast",
    name: "Gold Coast",
    regionDescription:
      "From Surfers Paradise to Coolangatta — fast emergency repairs and maintenance for the Coast's booming hospitality industry.",
    stats: [
      { label: "Avg Response", value: "2 hrs" },
      { label: "Gold Coast Jobs", value: "900+" },
      { label: "First-Visit Fix", value: "97%" },
      { label: "Local Techs", value: "6" },
    ],
    zones: ["Surfers Paradise", "Broadbeach", "Southport", "Robina", "Coolangatta"],
    sampleSuburbs: ["Surfers Paradise", "Broadbeach", "Southport", "Robina", "Burleigh Heads", "Coolangatta"],
    suburbs: [
      { slug: "surfers-paradise", name: "Surfers Paradise", zone: "Surfers Paradise", businessTypes: "Hotels, resorts & tourist dining", venueTypes: ["Hotels", "Resorts", "Restaurants", "Bars"], localContextText: "Surfers Paradise is the Gold Coast's tourism epicentre. Hotels and restaurants here can't afford downtime — our 24/7 emergency service keeps your guests comfortable and your kitchens compliant.", nearbySuburbs: ["Broadbeach", "Main Beach", "Southport"] },
      { slug: "broadbeach", name: "Broadbeach", zone: "Broadbeach", businessTypes: "Convention centres & fine dining", venueTypes: ["Convention Centres", "Fine Dining", "Cafés", "Bars"], localContextText: "Home to The Star and the Gold Coast Convention Centre, Broadbeach is a hub for premium dining. We provide preventative maintenance to keep these high-profile venues running smoothly.", nearbySuburbs: ["Surfers Paradise", "Mermaid Beach", "Robina"] },
      { slug: "southport", name: "Southport", zone: "Southport", businessTypes: "Medical precincts & retail centres", venueTypes: ["Hospitals", "Pharmacies", "Shopping Centres", "Restaurants"], localContextText: "Southport's medical precinct and Australia Fair shopping centre require temperature-critical refrigeration for pharmaceutical storage and food retail.", nearbySuburbs: ["Surfers Paradise", "Labrador", "Runaway Bay"] },
      { slug: "robina", name: "Robina", zone: "Robina", businessTypes: "Town centres & sports facilities", venueTypes: ["Shopping Centres", "Sports Venues", "Restaurants", "Supermarkets"], localContextText: "Robina Town Centre and the surrounding commercial district house major retail and dining tenants. Our scheduled maintenance plans prevent costly breakdowns during peak trade.", nearbySuburbs: ["Broadbeach", "Varsity Lakes", "Mudgeeraba"] },
      { slug: "burleigh-heads", name: "Burleigh Heads", zone: "Broadbeach", businessTypes: "Beachside cafés & boutique dining", venueTypes: ["Cafés", "Restaurants", "Juice Bars", "Gelato Shops"], localContextText: "Burleigh Heads' trendy café scene demands reliable refrigeration for fresh produce and specialty beverages. We keep Burleigh cool from dawn service to late-night dining.", nearbySuburbs: ["Broadbeach", "Palm Beach", "Miami"] },
      { slug: "coolangatta", name: "Coolangatta", zone: "Coolangatta", businessTypes: "Airport dining & surf clubs", venueTypes: ["Airport Restaurants", "Surf Clubs", "Hotels", "Cafés"], localContextText: "Coolangatta serves as the gateway to the Gold Coast with airport dining and beachside venues. Our southern Gold Coast techs provide fast response times for this border region.", nearbySuburbs: ["Tweed Heads", "Kirra", "Bilinga"] },
    ],
  },
  {
    slug: "sunshine-coast",
    name: "Sunshine Coast",
    regionDescription:
      "Noosa to Caloundra — expert refrigeration maintenance and emergency repairs for the Sunshine Coast's growing food and hospitality sector.",
    stats: [
      { label: "Avg Response", value: "2 hrs" },
      { label: "Sunshine Coast Jobs", value: "600+" },
      { label: "First-Visit Fix", value: "97%" },
      { label: "Local Techs", value: "4" },
    ],
    zones: ["Noosa", "Maroochydore", "Caloundra", "Nambour", "Coolum"],
    sampleSuburbs: ["Noosa Heads", "Maroochydore", "Caloundra", "Mooloolaba", "Nambour", "Coolum Beach"],
    suburbs: [
      { slug: "noosa-heads", name: "Noosa Heads", zone: "Noosa", businessTypes: "Premium dining & boutique hotels", venueTypes: ["Fine Dining", "Boutique Hotels", "Cafés", "Delicatessens"], localContextText: "Noosa Heads is synonymous with premium dining on Hastings Street. These high-end restaurants demand impeccable refrigeration uptime — we deliver with priority service contracts.", nearbySuburbs: ["Noosaville", "Sunshine Beach", "Tewantin"] },
      { slug: "maroochydore", name: "Maroochydore", zone: "Maroochydore", businessTypes: "CBD dining & retail centres", venueTypes: ["Shopping Centres", "Restaurants", "Supermarkets", "Office Buildings"], localContextText: "As the Sunshine Coast's commercial hub, Maroochydore's Sunshine Plaza and surrounding businesses rely on consistent cold chain management. Our local team is just minutes away.", nearbySuburbs: ["Mooloolaba", "Alexandra Headland", "Buderim"] },
      { slug: "caloundra", name: "Caloundra", zone: "Caloundra", businessTypes: "Seaside hospitality & aged care", venueTypes: ["Restaurants", "Cafés", "Aged Care", "RSL Clubs"], localContextText: "Caloundra's seaside restaurants and growing aged care sector both need reliable, compliant refrigeration. We offer tailored maintenance plans for every business type in the region.", nearbySuburbs: ["Golden Beach", "Moffat Beach", "Pelican Waters"] },
      { slug: "mooloolaba", name: "Mooloolaba", zone: "Maroochydore", businessTypes: "Wharf dining & seafood markets", venueTypes: ["Seafood Restaurants", "Fish Markets", "Cafés", "Ice Creameries"], localContextText: "Mooloolaba's iconic Wharf precinct and Esplanade dining strip serve fresh seafood daily. When your coolroom fails, our techs respond fast to protect your stock and reputation.", nearbySuburbs: ["Maroochydore", "Alexandra Headland", "Buderim"] },
      { slug: "nambour", name: "Nambour", zone: "Nambour", businessTypes: "Regional food processing & retail", venueTypes: ["Food Processors", "Supermarkets", "Butchers", "Bakeries"], localContextText: "Nambour's hinterland location makes it a hub for regional food processing and distribution. We service large-scale coolrooms and blast freezers for manufacturers and wholesalers.", nearbySuburbs: ["Woombye", "Palmwoods", "Yandina"] },
      { slug: "coolum-beach", name: "Coolum Beach", zone: "Coolum", businessTypes: "Resort hospitality & surf clubs", venueTypes: ["Resorts", "Surf Clubs", "Restaurants", "Cafés"], localContextText: "Coolum Beach's resort and hospitality businesses need refrigeration they can count on, especially during the busy holiday season. Our preventative maintenance keeps you running year-round.", nearbySuburbs: ["Peregian Beach", "Marcoola", "Yandina"] },
    ],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getSuburbBySlug(
  citySlug: string,
  suburbSlug: string
): { city: CityData; suburb: Suburb } | undefined {
  const city = getCityBySlug(citySlug);
  if (!city) return undefined;
  const suburb = city.suburbs.find((s) => s.slug === suburbSlug);
  if (!suburb) return undefined;
  return { city, suburb };
}
