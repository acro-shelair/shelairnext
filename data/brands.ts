// Brand data used by BrandsSection (home), Brands page, and BrandPage

export interface FeaturedBrand {
  slug: string;
  name: string;
  desc: string;
  speciality: string;
  detail: string;
}

export interface OtherBrand {
  name: string;
  category: string;
}

export interface BrandIssue {
  title: string;
  desc: string;
}

export interface BrandDetail {
  name: string;
  tagline: string;
  heroDesc: string;
  stats: { value: string; label: string }[];
  about: string;
  commonIssues: BrandIssue[];
  services: string[];
  productTypes: string[];
  relatedBrands: { slug: string; name: string; desc: string }[];
}

// ─── Page-level copy ──────────────────────────────────────────────────────────

export const brandsPage = {
  badge: "Brand Specialists",
  heading: "All Major Brands. One Expert Team.",
  subheading:
    "We service and repair every major commercial air conditioning brand — from compressor overhauls to control system diagnostics. If it's refrigeration, we know it.",
  emergencyBanner: {
    heading: "Brand Equipment Failure?",
    subheading:
      "Call now — average 2-hour response, 24/7 across Brisbane & SE Queensland.",
    phone: "1300227600",
  },
  featuredHeading: "Featured Brand Specialists",
  featuredSubheading:
    "Deep expertise in these brands with dedicated service pages, parts supply and specialist technicians.",
  otherBrandsHeading: "Also Servicing These Brands",
  otherBrandsSubheading:
    "Our technicians are trained across the full range of commercial air conditioning equipment — whatever brand you run, we can help.",
  notListedHeading: "Don't See Your Brand?",
  notListedDesc:
    "We service and repair virtually all commercial air conditioning brands. If you don't see your equipment listed, get in touch — chances are we've worked on it before.",
};

// Home section copy (BrandsSection component)
export const brandsHomeSection = {
  badge: "Brand Specialists",
  heading: "All Major Brands. One Expert Team.",
  subheading:
    "We service and repair every major commercial air conditioning brand — from compressor overhauls to control system diagnostics.",
};

// ─── Featured brands (used on home + brands listing page) ─────────────────────

export const featuredBrands: FeaturedBrand[] = [
  {
    slug: "bitzer",
    name: "Bitzer",
    desc: "Semi-hermetic reciprocating and screw compressor repairs, overhauls and preventative maintenance.",
    speciality: "Compressors",
    detail:
      "One of the world's leading compressor manufacturers — trusted in cold rooms, supermarkets and industrial facilities across Australia.",
  },
  {
    slug: "copeland",
    name: "Copeland",
    desc: "Scroll and semi-hermetic compressor diagnostics, replacement and efficiency optimisation.",
    speciality: "Compressors",
    detail:
      "Widely used scroll and semi-hermetic compressors found in everything from supermarket display cases to large cold rooms.",
  },
  {
    slug: "danfoss",
    name: "Danfoss",
    desc: "Expansion valves, electronic controllers, pressure controls and variable speed drive repairs.",
    speciality: "Controls & Valves",
    detail:
      "Global leader in refrigeration controls, valves and drives found in virtually every commercial air conditioning system.",
  },
];

// ─── Other brands ─────────────────────────────────────────────────────────────

export const otherBrands: OtherBrand[] = [
  { name: "Daikin", category: "Refrigeration & HVAC" },
  { name: "Carrier", category: "Refrigeration & HVAC" },
  { name: "Heatcraft", category: "Refrigeration" },
  { name: "Embraco", category: "Compressors" },
  { name: "Tecumseh", category: "Compressors" },
  { name: "Hussmann", category: "Display Cases" },
  { name: "Reflex", category: "Controls" },
  { name: "Kirloskar", category: "Compressors" },
  { name: "Panasonic", category: "Refrigeration & HVAC" },
  { name: "LG Commercial", category: "Refrigeration & HVAC" },
];

// Name-only list used by the home BrandsSection pill row
export const otherBrandNames = otherBrands.map((b) => b.name);

// ─── Individual brand detail pages ───────────────────────────────────────────

export const brandDetails: Record<string, BrandDetail> = {
  bitzer: {
    name: "Bitzer",
    tagline: "Authorised Bitzer Compressor Repairs & Servicing",
    heroDesc:
      "Specialist Bitzer compressor diagnostics, repairs and maintenance. Our technicians are trained on the full Bitzer range — from semi-hermetic reciprocating compressors to screw compressors and condensing units.",
    stats: [
      { value: "500+", label: "Bitzer Repairs" },
      { value: "98%", label: "First-Visit Fix" },
      { value: "24/7", label: "Emergency Service" },
      { value: "15yr", label: "Bitzer Experience" },
    ],
    about:
      "Bitzer is one of the world's leading manufacturers of refrigeration compressors, trusted across commercial and industrial applications. Their semi-hermetic and screw compressors are the backbone of cold rooms, supermarket systems and industrial facilities across Australia. When a Bitzer compressor fails, you need a technician who knows the product inside-out — not a generalist who's guessing.",
    commonIssues: [
      { title: "Compressor Burnout", desc: "Electrical or mechanical failure requiring expert diagnosis to identify root cause and prevent recurrence." },
      { title: "Oil Logging & Migration", desc: "Incorrect oil levels or migration causing reduced efficiency and potential compressor damage." },
      { title: "Valve Plate Failure", desc: "Worn or damaged valve plates reducing compression efficiency and increasing energy consumption." },
      { title: "Electrical Contactor Issues", desc: "Failed contactors and overloads causing intermittent starting or complete failure to start." },
      { title: "Refrigerant Leaks", desc: "Shaft seal or gasket leaks requiring specialist tools and certified refrigerant handling." },
      { title: "Capacity Control Faults", desc: "Unloader or capacity control issues causing systems to run inefficiently or short-cycle." },
    ],
    services: [
      "Emergency compressor repairs — 24/7",
      "Compressor overhauls and rebuilds",
      "Oil analysis and management",
      "Valve plate replacement",
      "Electrical diagnostics and contactor replacement",
      "Refrigerant leak detection and repair",
      "Capacity control servicing",
      "Preventative maintenance programs",
      "Genuine Bitzer parts supply",
      "System efficiency assessments",
    ],
    productTypes: [
      "Semi-Hermetic Reciprocating Compressors",
      "Screw Compressors",
      "Scroll Compressors",
      "Condensing Units",
      "Pressure Vessels",
      "Oil Separators",
    ],
    relatedBrands: [
      { slug: "copeland", name: "Copeland", desc: "Scroll and semi-hermetic compressor repairs and servicing." },
      { slug: "danfoss", name: "Danfoss", desc: "Controls, compressors and valve repairs across all product lines." },
      { slug: "daikin", name: "Daikin", desc: "Commercial refrigeration and air conditioning system servicing." },
    ],
  },
  copeland: {
    name: "Copeland",
    tagline: "Expert Copeland Compressor Repairs & Servicing",
    heroDesc:
      "Trusted Copeland scroll and semi-hermetic compressor servicing. We diagnose and repair the full Copeland range used in commercial air conditioning and air conditioning systems across SEQ.",
    stats: [
      { value: "400+", label: "Copeland Repairs" },
      { value: "98%", label: "First-Visit Fix" },
      { value: "24/7", label: "Emergency Service" },
      { value: "12yr", label: "Copeland Experience" },
    ],
    about:
      "Copeland (formerly Emerson Climate Technologies) manufactures some of the most widely used scroll and semi-hermetic compressors in the commercial air conditioning industry. Found in everything from supermarket display cases to cold rooms and food processing facilities, Copeland compressors are reliable — but when they fail, specialist knowledge is essential for fast, correct diagnosis.",
    commonIssues: [
      { title: "Scroll Compressor Failure", desc: "Internal scroll wear or seizure requiring replacement or rebuild." },
      { title: "Liquid Slugging", desc: "Liquid refrigerant entering the compressor causing mechanical damage." },
      { title: "High Discharge Temperature", desc: "Overheating due to low charge, dirty condensers or restricted airflow." },
      { title: "Start Component Failure", desc: "Failed start capacitors, relays or run capacitors preventing startup." },
      { title: "Oil Return Issues", desc: "Poor oil return causing lubrication failure and compressor wear." },
      { title: "Internal Relief Valve Trips", desc: "High compression ratios causing the internal relief to open repeatedly." },
    ],
    services: [
      "Emergency compressor diagnostics and repairs",
      "Scroll compressor replacement",
      "Electrical component testing and replacement",
      "Refrigerant charge correction",
      "Oil level and return system servicing",
      "Condenser cleaning and airflow optimisation",
      "System performance testing",
      "Preventative maintenance contracts",
      "Genuine Copeland parts supply",
      "Compressor upgrade recommendations",
    ],
    productTypes: [
      "Scroll Compressors",
      "Semi-Hermetic Compressors",
      "Digital Scroll Compressors",
      "Condensing Units",
      "Compressor Racks",
    ],
    relatedBrands: [
      { slug: "bitzer", name: "Bitzer", desc: "Semi-hermetic and screw compressor specialist repairs." },
      { slug: "danfoss", name: "Danfoss", desc: "Controls, compressors and valve repairs across all product lines." },
      { slug: "daikin", name: "Daikin", desc: "Commercial refrigeration and air conditioning system servicing." },
    ],
  },
  danfoss: {
    name: "Danfoss",
    tagline: "Danfoss Controls & Compressor Repairs",
    heroDesc:
      "Expert servicing of Danfoss controls, valves, compressors and drives. From expansion valve replacements to controller programming and compressor diagnostics.",
    stats: [
      { value: "300+", label: "Danfoss Jobs/Year" },
      { value: "98%", label: "First-Visit Fix" },
      { value: "24/7", label: "Emergency Service" },
      { value: "10yr", label: "Danfoss Experience" },
    ],
    about:
      "Danfoss is a global leader in refrigeration controls, valves and compressors. Their products — from electronic expansion valves and pressure controls to variable speed drives and controllers — are found in virtually every commercial air conditioning system. Faults in Danfoss controls can be complex to diagnose without specialist knowledge of their product ecosystem.",
    commonIssues: [
      { title: "Expansion Valve Failure", desc: "Electronic or thermostatic expansion valves failing to regulate correctly." },
      { title: "Controller Faults", desc: "ERC or AK controller errors requiring programming or hardware replacement." },
      { title: "Pressure Control Issues", desc: "High/low pressure switches and regulators failing or out of calibration." },
      { title: "VSD/Drive Faults", desc: "Variable speed drive errors causing compressor performance issues." },
      { title: "Solenoid Valve Failures", desc: "Stuck-open or stuck-closed solenoid valves disrupting system operation." },
      { title: "Sensor Faults", desc: "Temperature and pressure sensor failures causing incorrect system responses." },
    ],
    services: [
      "Expansion valve diagnostics and replacement",
      "Controller programming and commissioning",
      "Pressure control calibration and replacement",
      "VSD fault diagnosis and repair",
      "Solenoid valve testing and replacement",
      "Sensor replacement and calibration",
      "System optimisation and tuning",
      "Preventative maintenance",
      "Genuine Danfoss parts supply",
      "Control system upgrades",
    ],
    productTypes: [
      "Electronic Expansion Valves",
      "Thermostatic Expansion Valves",
      "Pressure Controls",
      "Electronic Controllers",
      "Variable Speed Drives",
      "Solenoid Valves",
      "Compressors",
    ],
    relatedBrands: [
      { slug: "bitzer", name: "Bitzer", desc: "Semi-hermetic and screw compressor specialist repairs." },
      { slug: "copeland", name: "Copeland", desc: "Scroll and semi-hermetic compressor repairs and servicing." },
      { slug: "daikin", name: "Daikin", desc: "Commercial refrigeration and air conditioning system servicing." },
    ],
  },
};
