import placesData from "../places.json";

export const CATEGORIES = [
  { id: "nature", title: "Nature", desc: "Parks, deserts, mountains" },
  { id: "historical", title: "Historical", desc: "Ruins, monuments, temples" },
  { id: "beach", title: "Beach", desc: "Coasts, shores, lagoons" },
  { id: "urban", title: "Urban", desc: "Cities, neighbourhoods, markets" },
  { id: "adventure", title: "Adventure", desc: "Trails, dives, climbing" },
  { id: "cultural", title: "Cultural", desc: "Festivals, art, cuisine" },
  { id: "photography", title: "Photography", desc: "Instagram-worthy locations" },
  { id: "romantic", title: "Romantic", desc: "Sunsets and peaceful spots" },
  { id: "modern", title: "Modern", desc: "Contemporary attractions" },
  { id: "diving", title: "Diving", desc: "Coral reefs and underwater adventures" },
  { id: "mysterious", title: "Mystery", desc: "Ancient secrets, tombs and legends" },
  { id: "hidden", title: "Hidden Gems", desc: "Less crowded unique places" },
  { id: "food", title: "Food", desc: "Local dishes and cafés" },
];

export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.title || id;

// ── LOCATIONS ──
export const LOCATIONS = [
  {
   governorate: "Cairo",
coords: { lat: 30.0444, lng: 31.2357 },

cities: [
  "Cairo",
  "Maadi",
  "Heliopolis",
  "Nasr City",
  "New Cairo",
  "Zamalek",
  "Garden City",
  "Shubra",
  "Ain Shams",
  "El Marg",
  "Helwan",
  "Basatin",
  "Mokattam",
  "Obour",
  "Badr City",
  "El Rehab",
  "Madinaty",

  "Downtown",
  "Abbassia",
  "Sayeda Zeinab",
  "Dar El Salam",
  "El Sahel",
  "Rod El Farag",
  "Zeitoun",
  "Hadayek El Qobba",
  "Nozha",
  "Tebbin",
  "15th of May City",
  "Katameya",

  // ✅ New additions
  "El Shorouk",
  "New Administrative Capital"
],

cityCoords: {
  "Cairo":              { lat: 30.0444, lng: 31.2357 },
  "Maadi":              { lat: 29.9602, lng: 31.2569 },
  "Heliopolis":         { lat: 30.0924, lng: 31.3204 },
  "Nasr City":          { lat: 30.0626, lng: 31.3361 },
  "New Cairo":          { lat: 30.0131, lng: 31.4961 },
  "Zamalek":            { lat: 30.0626, lng: 31.2197 },
  "Garden City":        { lat: 30.0385, lng: 31.2296 },
  "Shubra":             { lat: 30.0730, lng: 31.2450 },
  "Ain Shams":          { lat: 30.1290, lng: 31.3300 },
  "El Marg":            { lat: 30.1640, lng: 31.3370 },
  "Helwan":             { lat: 29.8414, lng: 31.3000 },
  "Basatin":            { lat: 29.9953, lng: 31.2797 },
  "Mokattam":           { lat: 30.0100, lng: 31.3030 },
  "Obour":              { lat: 30.2280, lng: 31.4800 },
  "Badr City":          { lat: 30.1360, lng: 31.7420 },
  "El Rehab":           { lat: 30.0637, lng: 31.4900 },
  "Madinaty":           { lat: 30.0840, lng: 31.6300 },

  "Downtown":           { lat: 30.0478, lng: 31.2385 },
  "Abbassia":           { lat: 30.0722, lng: 31.2778 },
  "Sayeda Zeinab":      { lat: 30.0293, lng: 31.2381 },
  "Dar El Salam":       { lat: 29.9950, lng: 31.2400 },
  "El Sahel":           { lat: 30.0800, lng: 31.2500 },
  "Rod El Farag":       { lat: 30.0808, lng: 31.2300 },
  "Zeitoun":            { lat: 30.1133, lng: 31.3133 },
  "Hadayek El Qobba":   { lat: 30.0985, lng: 31.2870 },
  "Nozha":              { lat: 30.1060, lng: 31.3500 },
  "Tebbin":             { lat: 29.8000, lng: 31.3000 },
  "15th of May City":   { lat: 29.8500, lng: 31.3500 },
  "Katameya":           { lat: 30.0200, lng: 31.4200 },
  "El Shorouk":         { lat: 30.1400, lng: 31.6200 },
  "New Administrative Capital": { lat: 30.0130, lng: 31.7000 }
}
  },
 {
  governorate: "Giza",
  coords: { lat: 30.0131, lng: 31.2089 },

  cities: [
    "Giza",
    "Dokki",
    "Mohandessin",
    "Haram",
    "Faisal",
    "Sheikh Zayed",
    "6th of October",

    "Abu Rawash",
    "Kerdasa",
    "Imbaba",
    "Warraq",
    "Boulaq Dakrour",
    "Ossim",
    "Atfih",

    // ✅ Added (clean, non-overlapping)
    "Agouza",
    "Kit Kat",
    "Talbia",
    "Omrania",
    "Saft El Laban",
    "Hawamdeya",
    "Badrasheen",
    "Monib",
    "Nazlet El Saman",
    "Sakkara"
  ],

  cityCoords: {
    "Giza":            { lat: 30.0131, lng: 31.2089 },
    "Dokki":           { lat: 30.0393, lng: 31.2117 },
    "Mohandessin":     { lat: 30.0566, lng: 31.2007 },
    "Haram":           { lat: 29.9772, lng: 31.1313 },
    "Faisal":          { lat: 29.9925, lng: 31.1429 },
    "Sheikh Zayed":    { lat: 30.0177, lng: 30.9419 },
    "6th of October":  { lat: 29.9397, lng: 30.9253 },

    "Abu Rawash":      { lat: 30.0310, lng: 31.0780 },
    "Kerdasa":         { lat: 30.0315, lng: 31.1070 },
    "Imbaba":          { lat: 30.0710, lng: 31.2090 },
    "Warraq":          { lat: 30.0890, lng: 31.2050 },
    "Boulaq Dakrour":  { lat: 30.0350, lng: 31.1970 },
    "Ossim":           { lat: 30.1200, lng: 31.1350 },
    "Atfih":           { lat: 29.3700, lng: 31.2700 },
    "Agouza":          { lat: 30.0580, lng: 31.2050 },
    "Kit Kat":         { lat: 30.0665, lng: 31.2095 },
    "Talbia":          { lat: 29.9900, lng: 31.1500 },
    "Omrania":         { lat: 29.9700, lng: 31.1700 },
    "Saft El Laban":   { lat: 30.0600, lng: 31.1800 },
    "Hawamdeya":       { lat: 29.9000, lng: 31.2500 },
    "Badrasheen":      { lat: 29.8500, lng: 31.3000 },
    "Monib":           { lat: 29.9800, lng: 31.2100 },
    "Nazlet El Saman": { lat: 29.9750, lng: 31.1350 },
    "Sakkara":         { lat: 29.8710, lng: 31.2165 }
  }
},
  {
    governorate: "Alexandria",
    coords: { lat: 31.2001, lng: 29.9187 },
    cities: ["Alexandria", "Montaza", "Smouha", "Miami", "Agami", "Sidi Gaber",
              "Raml Station",
              "Gleem",
              "Mandara",
              "Asafra",
              "Stanley",
              "Borg El Arab",
              "Abu Qir",
              "Dekheila",
              "Louran"],
            cityCoords: {
              "Alexandria": { lat: 31.2001, lng: 29.9187 },
              "Montaza":    { lat: 31.2876, lng: 30.0138 },
              "Smouha":     { lat: 31.2156, lng: 29.9553 },
              "Miami":      { lat: 31.2994, lng: 30.0251 },
              "Agami": { lat: 31.1659, lng: 29.7740 },
              "Sidi Gaber":    { lat: 31.2150, lng: 29.9500 },
              "Raml Station":  { lat: 31.2000, lng: 29.9000 },
              "Gleem":         { lat: 31.2300, lng: 29.9600 },
              "Mandara":       { lat: 31.2800, lng: 30.0200 },
              "Asafra":        { lat: 31.2900, lng: 30.0300 },
              "Stanley":       { lat: 31.2300, lng: 29.9500 },
              "Borg El Arab":  { lat: 30.9000, lng: 29.6000 },
              "Abu Qir":       { lat: 31.3160, lng: 30.0600 },
              "Dekheila":      { lat: 31.1500, lng: 29.8000 },
              "Louran":        { lat: 31.2400, lng: 29.9700 }
                },
  },
  {
    governorate: "Aswan",
    coords: { lat: 24.0889, lng: 32.8998 },
    cities: ["Aswan", "Kom Ombo", "Edfu", "Abu Simbel"],
    cityCoords: {
      "Aswan":      { lat: 24.0889, lng: 32.8998 },
      "Kom Ombo":   { lat: 24.4725, lng: 32.9290 },
      "Edfu":       { lat: 24.9778, lng: 32.8743 },
      "Abu Simbel": { lat: 22.3372, lng: 31.6258 },
    },
  },
  {
    governorate: "Luxor",
    coords: { lat: 25.6872, lng: 32.6396 },
    cities: ["Luxor", "Karnak", "Esna", "Armant"],
    cityCoords: {
      "Luxor":   { lat: 25.6872, lng: 32.6396 },
      "Karnak":  { lat: 25.7188, lng: 32.6573 },
      "Esna":    { lat: 25.2933, lng: 32.5525 },
      "Armant":  { lat: 25.6193, lng: 32.5325 },
    },
  },
  {
    governorate: "South Sinai",
    coords: { lat: 28.2000, lng: 34.1667 },
    cities: ["Sharm El-Sheikh", "Dahab", "Nuweiba", "Taba", "Saint Catherine"],
    cityCoords: {
      "Sharm El-Sheikh":  { lat: 27.9158, lng: 34.3300 },
      "Dahab":            { lat: 28.5096, lng: 34.5161 },
      "Nuweiba":          { lat: 29.0650, lng: 34.6670 },
      "Taba":             { lat: 29.4972, lng: 34.8978 },
      "Saint Catherine":  { lat: 28.5554, lng: 33.9760 },
    },
  },
  {
    governorate: "North Sinai",
    coords: { lat: 30.2833, lng: 33.6167 },
    cities: ["Arish", "Rafah", "Bir al-Abed"],
    cityCoords: {
      "Arish":       { lat: 31.1317, lng: 33.7986 },
      "Rafah":       { lat: 31.2894, lng: 34.2490 },
      "Bir al-Abed": { lat: 30.9289, lng: 33.0072 },
    },
  },
  {
    governorate: "Red Sea",
    coords: { lat: 24.6877, lng: 34.1536 },
    cities: ["Hurghada", "Marsa Alam", "El Gouna", "Safaga", "Quseer"],
    cityCoords: {
      "Hurghada":   { lat: 27.2579, lng: 33.8116 },
      "Marsa Alam": { lat: 25.0656, lng: 34.8941 },
      "El Gouna":   { lat: 27.3954, lng: 33.6780 },
      "Safaga":     { lat: 26.7449, lng: 33.9367 },
      "Quseer":     { lat: 26.1116, lng: 34.2820 },
    },
  },
  {
    governorate: "Matrouh",
    coords: { lat: 31.3543, lng: 27.2373 },
    cities: ["Marsa Matruh", "Siwa", "Alamein", "Sidi Barrani"],
    cityCoords: {
      "Marsa Matruh": { lat: 31.3543, lng: 27.2373 },
      "Siwa":         { lat: 29.2031, lng: 25.5195 },
      "Alamein":      { lat: 30.8338, lng: 28.9553 },
      "Sidi Barrani": { lat: 31.6219, lng: 25.9081 },
    },
  },
  {
    governorate: "New Valley",
    coords: { lat: 25.4392, lng: 30.5561 },
    cities: ["Kharga", "Dakhla", "Farafra", "Bahariya"],
    cityCoords: {
      "Kharga":   { lat: 25.4392, lng: 30.5561 },
      "Dakhla":   { lat: 25.4889, lng: 28.9870 },
      "Farafra":  { lat: 27.0588, lng: 27.9692 },
      "Bahariya": { lat: 28.3412, lng: 28.8625 },
    },
  },
  {
    governorate: "Fayoum",
    coords: { lat: 29.3084, lng: 30.8428 },
    cities: ["Fayoum", "Tamiya", "Sinnuris"],
    cityCoords: {
      "Fayoum":   { lat: 29.3084, lng: 30.8428 },
      "Tamiya":   { lat: 29.4981, lng: 30.9638 },
      "Sinnuris": { lat: 29.4117, lng: 30.8997 },
    },
  },
  {
    governorate: "Beni Suef",
    coords: { lat: 29.0744, lng: 31.0994 },
    cities: ["Beni Suef", "Al Fashn", "Nasser"],
    cityCoords: {
      "Beni Suef": { lat: 29.0744, lng: 31.0994 },
      "Al Fashn":  { lat: 28.8270, lng: 30.8997 },
      "Nasser":    { lat: 29.0400, lng: 31.0533 },
    },
  },
  {
    governorate: "Minya",
    coords: { lat: 28.1099, lng: 30.7503 },
    cities: ["Minya", "Mallawi", "Samalut", "Ashmunin"],
    cityCoords: {
      "Minya":     { lat: 28.1099, lng: 30.7503 },
      "Mallawi":   { lat: 27.7333, lng: 30.8418 },
      "Samalut":   { lat: 28.3132, lng: 30.7109 },
      "Ashmunin":  { lat: 27.7985, lng: 30.8026 },
    },
  },
  {
    governorate: "Asyut",
    coords: { lat: 27.1809, lng: 31.1837 },
    cities: ["Asyut", "Manfalut", "Abu Tig"],
    cityCoords: {
      "Asyut":    { lat: 27.1809, lng: 31.1837 },
      "Manfalut": { lat: 27.3103, lng: 30.9709 },
      "Abu Tig":  { lat: 27.0490, lng: 31.3226 },
    },
  },
  {
    governorate: "Sohag",
    coords: { lat: 26.5590, lng: 31.6957 },
    cities: ["Sohag", "Akhmim", "Tahta", "Girga"],
    cityCoords: {
      "Sohag":  { lat: 26.5590, lng: 31.6957 },
      "Akhmim": { lat: 26.5645, lng: 31.7479 },
      "Tahta":  { lat: 26.7723, lng: 31.5022 },
      "Girga":  { lat: 26.3344, lng: 31.8918 },
    },
  },
  {
    governorate: "Qena",
    coords: { lat: 26.1551, lng: 32.7160 },
    cities: ["Qena", "Nag Hammadi", "Qift", "Dendara"],
    cityCoords: {
      "Qena":         { lat: 26.1551, lng: 32.7160 },
      "Nag Hammadi":  { lat: 26.0463, lng: 32.2490 },
      "Qift":         { lat: 25.9969, lng: 32.8155 },
      "Dendara":      { lat: 26.1416, lng: 32.6706 },
    },
  },
  {
    governorate: "Suez",
    coords: { lat: 29.9668, lng: 32.5498 },
    cities: ["Suez", "Ain Sokhna"],
    cityCoords: {
      "Suez":       { lat: 29.9668, lng: 32.5498 },
      "Ain Sokhna": { lat: 29.5913, lng: 32.3480 },
    },
  },
  {
    governorate: "Ismailia",
    coords: { lat: 30.5965, lng: 32.2715 },
    cities: ["Ismailia", "Fayed", "Qantara"],
    cityCoords: {
      "Ismailia": { lat: 30.5965, lng: 32.2715 },
      "Fayed":    { lat: 30.3171, lng: 32.2617 },
      "Qantara":  { lat: 30.8584, lng: 32.3285 },
    },
  },
  {
    governorate: "Port Said",
    coords: { lat: 31.2653, lng: 32.3019 },
    cities: ["Port Said", "Port Fouad"],
    cityCoords: {
      "Port Said":  { lat: 31.2653, lng: 32.3019 },
      "Port Fouad": { lat: 31.2587, lng: 32.3249 },
    },
  },
  {
    governorate: "Damietta",
    coords: { lat: 31.4165, lng: 31.8133 },
    cities: ["Damietta", "New Damietta", "Ras El Bar"],
    cityCoords: {
      "Damietta":     { lat: 31.4165, lng: 31.8133 },
      "New Damietta": { lat: 31.4029, lng: 31.6714 },
      "Ras El Bar":   { lat: 31.4879, lng: 31.8395 },
    },
  },
  {
    governorate: "Dakahlia",
    coords: { lat: 31.0364, lng: 31.3807 },
    cities: ["Mansoura", "Talkha", "Mit Ghamr", "Sherbin"],
    cityCoords: {
      "Mansoura": { lat: 31.0364, lng: 31.3807 },
      "Talkha":   { lat: 31.0580, lng: 31.3757 },
      "Mit Ghamr":{ lat: 30.7228, lng: 31.2594 },
      "Sherbin":  { lat: 31.1985, lng: 31.5600 },
    },
  },
  {
    governorate: "Sharqia",
    coords: { lat: 30.5877, lng: 31.5021 },
    cities: ["Zagazig", "10th of Ramadan", "Belbeis", "Abu Hammad"],
    cityCoords: {
      "Zagazig":         { lat: 30.5877, lng: 31.5021 },
      "10th of Ramadan": { lat: 30.2951, lng: 31.7423 },
      "Belbeis":         { lat: 30.8679, lng: 31.5577 },
      "Abu Hammad":      { lat: 30.7384, lng: 31.6729 },
    },
  },
  {
    governorate: "Qalyubia",
    coords: { lat: 30.3309, lng: 31.2469 },
    cities: ["Banha", "Shubra El Kheima", "Qalyub", "Khanka"],
    cityCoords: {
      "Banha":           { lat: 30.4667, lng: 31.1833 },
      "Shubra El Kheima":{ lat: 30.1286, lng: 31.2422 },
      "Qalyub":          { lat: 30.1797, lng: 31.2044 },
      "Khanka":          { lat: 30.2166, lng: 31.3622 },
    },
  },
  {
    governorate: "Gharbia",
    coords: { lat: 30.8648, lng: 31.0323 },
    cities: ["Tanta", "Mahalla El Kubra", "Kafr El Zayat", "Zefta"],
    cityCoords: {
      "Tanta":           { lat: 30.7865, lng: 31.0004 },
      "Mahalla El Kubra":{ lat: 30.9756, lng: 31.1635 },
      "Kafr El Zayat":   { lat: 30.8232, lng: 30.8232 },
      "Zefta":           { lat: 30.9394, lng: 30.9933 },
    },
  },
  {
    governorate: "Monufia",
    coords: { lat: 30.5972, lng: 30.9876 },
    cities: ["Shebeen El Kom", "Menouf", "Sadat City", "Ashmoun"],
    cityCoords: {
      "Shebeen El Kom": { lat: 30.5227, lng: 30.9478 },
      "Menouf":         { lat: 30.4646, lng: 30.9336 },
      "Sadat City":     { lat: 30.3614, lng: 30.0236 },
      "Ashmoun":        { lat: 30.2952, lng: 30.9779 },
    },
  },
  {
    governorate: "Beheira",
    coords: { lat: 30.8480, lng: 30.3436 },
    cities: ["Damanhur", "Kafr El Dawwar", "Rashid", "Abu Hummus"],
    cityCoords: {
      "Damanhur":      { lat: 31.0364, lng: 30.4685 },
      "Kafr El Dawwar":{ lat: 31.1341, lng: 30.1285 },
      "Rashid":        { lat: 31.4019, lng: 30.4178 },
      "Abu Hummus":    { lat: 31.0674, lng: 30.2627 },
    },
  },
  {
    governorate: "Kafr El Sheikh",
    coords: { lat: 31.1107, lng: 30.9388 },
    cities: ["Kafr El Sheikh", "Desouk", "Fouh", "Metoubes"],
    cityCoords: {
      "Kafr El Sheikh": { lat: 31.1107, lng: 30.9388 },
      "Desouk":         { lat: 31.1283, lng: 30.6436 },
      "Fouh":           { lat: 31.2059, lng: 30.7284 },
      "Metoubes":       { lat: 31.1416, lng: 30.7748 },
    },
  },
];

// ── Derived place data (replaces the standalone "places" localStorage key) ──

export function getAllContributedPlaces() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.flatMap((u) => u.contributions || []);
}

export function getApprovedPlaces() {
  return getAllContributedPlaces().filter((p) => p.status === "approved");
}

const FALLBACK_LAST_ID = 200;

export function getNextId() {
  const ids = [
    FALLBACK_LAST_ID,
    ...placesData.map((p) => p.id),
    ...getAllContributedPlaces().map((p) => p.id),
  ];
  return Math.max(...ids) + 1;
}