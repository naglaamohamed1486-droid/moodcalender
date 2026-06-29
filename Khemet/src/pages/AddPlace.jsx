import { useState, useRef,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { setPlaceImages } from "../components/PicCache"
import L from "leaflet";
import Toast from "../components/toast";
import "leaflet/dist/leaflet.css";
import "../css/addplace.css"
import placesData from "../places.json";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORIES = [
  { id: "historical", title: "History", desc: "Pyramids, temples and ancient sites" },
  { id: "adventure", title: "Adventure", desc: "Deserts, diving and exploration" },
  { id: "cultural", title: "Culture", desc: "Markets, traditions and heritage" },
  { id: "nature", title: "Nature", desc: "Oases, lakes and scenic views" },
  { id: "beach", title: "Beach", desc: "Sea, resorts and relaxation" },
  { id: "food", title: "Food", desc: "Local dishes and cafés" },
  { id: "photography", title: "Photography", desc: "Instagram-worthy locations" },
  { id: "romantic", title: "Romantic", desc: "Sunsets and peaceful spots" },
  { id: "modern", title: "Modern", desc: "Contemporary attractions" },
  { id: "diving", title: "Diving", desc: "Coral reefs and underwater adventures" },
  { id: "mysterious", title: "Mystery", desc: "Ancient secrets, tombs and legends" },
  { id: "hidden", title: "Hidden Gems", desc: "Less crowded unique places" },
];

const LOCATIONS = [
  {
    governorate: "Cairo",
    coords: { lat: 30.0444, lng: 31.2357 },
    cities: ["Cairo", "Maadi", "Heliopolis", "Nasr City", "New Cairo", "Zamalek",
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
  "Madinaty"],
    cityCoords: {
      "Cairo":              { lat: 30.0444, lng: 31.2357 },
      "Maadi":              { lat: 29.9602, lng: 31.2569 },
      "Heliopolis":         { lat: 30.0924, lng: 31.3204 },
      "Nasr City":          { lat: 30.0626, lng: 31.3361 },
      "New Cairo":          { lat: 30.0131, lng: 31.4961 },
       "Zamalek":      { lat: 30.0626, lng: 31.2197 },
      "Garden City":  { lat: 30.0385, lng: 31.2296 },
      "Shubra":       { lat: 30.0730, lng: 31.2450 },
      "Ain Shams":    { lat: 30.1290, lng: 31.3300 },
      "El Marg":      { lat: 30.1640, lng: 31.3370 },
      "Helwan":       { lat: 29.8414, lng: 31.3000 },
      "Basatin":      { lat: 29.9953, lng: 31.2797 },
      "Mokattam":     { lat: 30.0100, lng: 31.3030 },
      "Obour":        { lat: 30.2280, lng: 31.4800 },
      "Badr City":    { lat: 30.1360, lng: 31.7420 },
      "El Rehab":     { lat: 30.0637, lng: 31.4900 },
      "Madinaty":     { lat: 30.0840, lng: 31.6300 }
    },
  },
  {
    governorate: "Giza",
    coords: { lat: 30.0131, lng: 31.2089 },
    cities: ["Giza", "Dokki", "Mohandessin", "Haram", "Faisal", "Sheikh Zayed", "6th of October",
  "Hadayek October",
  "Abu Rawash",
  "Kerdasa",
  "Imbaba",
  "Warraq",
  "Boulaq Dakrour",
  "Ossim",
  "Atfih"],
    cityCoords: {
      "Giza":          { lat: 30.0131, lng: 31.2089 },
      "Dokki":         { lat: 30.0393, lng: 31.2117 },
      "Mohandessin":   { lat: 30.0566, lng: 31.2007 },
      "Haram":         { lat: 29.9772, lng: 31.1313 },
      "Faisal":        { lat: 29.9925, lng: 31.1429 },
      "Sheikh Zayed": { lat: 30.0177, lng: 30.9419 },
      "6th of October":   { lat: 29.9397, lng: 30.9253 },
      "Hadayek October":  { lat: 29.9500, lng: 30.9000 },
      "Abu Rawash":       { lat: 30.0310, lng: 31.0780 },
      "Kerdasa":          { lat: 30.0315, lng: 31.1070 },
      "Imbaba":           { lat: 30.0710, lng: 31.2090 },
      "Warraq":           { lat: 30.0890, lng: 31.2050 },
      "Boulaq Dakrour":   { lat: 30.0350, lng: 31.1970 },
      "Ossim":            { lat: 30.1200, lng: 31.1350 },
      "Atfih":            { lat: 29.3700, lng: 31.2700 }
        },
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

const FALLBACK_LAST_ID = 50;

function getNextId(storedPlaces) {
  const ids = [
    FALLBACK_LAST_ID,
    ...placesData.map((p) => p.id),
    ...storedPlaces.map((p) => p.id),
  ];
  return Math.max(...ids) + 1;
}

export function addReviewToPlace(place, { rating, text, author } = {}) {
  const existingReviews = place.reviewsList || [];
  const parsedRating = parseFloat(rating);
  const hasRating = rating !== "" && rating !== null && rating !== undefined && !Number.isNaN(parsedRating);
  const hasText = !!text && text.trim().length > 0;

  if (!hasRating && !hasText) return place;

  const newReview = {
    rating: hasRating ? Math.min(5, Math.max(0, parsedRating)) : null,
    text: hasText ? text.trim() : null,
    author: author || "anonymous",
    date: new Date().toISOString(),
  };

  const reviewsList = [...existingReviews, newReview];
  const ratingValues = reviewsList
    .filter((r) => typeof r.rating === "number" && !Number.isNaN(r.rating))
    .map((r) => r.rating);

  const avgRating = ratingValues.length
    ? Math.round((ratingValues.reduce((sum, r) => sum + r, 0) / ratingValues.length) * 10) / 10
    : place.rating || 0;

  return {
    ...place,
    reviewsList,
    reviews: reviewsList.length,
    rating: avgRating,
  };
}

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function AddPlace() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    longdescription: "",
    category: "",
    governorate: "",
    city: "",
    lat: "",
    lng: "",
    tags: [],
    coverImage: "",
    gallery: [],
    rating: "",
    reviewText: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [markerPos, setMarkerPos] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ visible: false, type: "success", message: "" });
  const toastTimeout = useRef(null);
 
  const showToast = (type, message) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, type, message });
    toastTimeout.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  };

  const availableCities = LOCATIONS.find(l => l.governorate === form.governorate)?.cities || [];
  const FIELD_ORDER = ["title", "description", "category", "governorate", "city", "lat","rating"];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "governorate" && { city: "" }),
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // ── tags ──────────────────────────────────────────────────
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
      if (tag && !form.tags.includes(tag)) {
        setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput("");
    }
  };
  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // ── map zoom ──────────────────────────────────────────────
  const mapRef = useRef(null);
  useEffect(() => {
  if (!mapRef.current) return;
  const loc = LOCATIONS.find(l => l.governorate === form.governorate);
  if (!loc) return;
    
  const cityCoords = loc.cityCoords?.[form.city];
  if (cityCoords) {
    mapRef.current.flyTo([cityCoords.lat, cityCoords.lng], 12, { duration: 1.2 });
  } else if (loc.coords) {
    mapRef.current.flyTo([loc.coords.lat, loc.coords.lng], 10, { duration: 1.2 });
  }
}, [form.governorate, form.city]);
  
  // ── map pin ───────────────────────────────────────────────
  const handleMapClick = (lat, lng) => {
    setMarkerPos({ lat, lng });
    setForm(prev => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    setErrors(prev => ({ ...prev, lat: "", lng: "" }));
  };

  // ── geocode search ────────────────────────────────────────
  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError("");
    try {
        const queryLower = searchQuery.toLowerCase();
        const cityHint = form.city && !queryLower.includes(form.city.toLowerCase()) ? form.city + ", " : "";
        const govHint = form.governorate && !queryLower.includes(form.governorate.toLowerCase()) ? form.governorate + ", " : "";
        const fullQuery = `${searchQuery}, ${cityHint}${govHint}Egypt`;
        const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + ", Egypt")}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length === 0) {
        setSearchError("Location not found. Try a different name.");
      } else {
        const { lat, lon } = data[0];
        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lon);
        setMarkerPos({ lat: parsedLat, lng: parsedLng });
        setForm(prev => ({ ...prev, lat: parsedLat.toFixed(6), lng: parsedLng.toFixed(6) }));
        mapRef.current?.flyTo([parsedLat, parsedLng], 15, { duration: 1.2 });
        setErrors(prev => ({ ...prev, lat: "", lng: "" }));
      }
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  // ── images ────────────────────────────────────────────────
  const toBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onloadend = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const handleCoverImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Cover image must be under 2MB"); return; }
    const base64 = await toBase64(file);
    setForm(prev => ({ ...prev, coverImage: base64 }));
  };

  const handleGalleryImages = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 3 - form.gallery.length;
    if (remainingSlots <= 0) { e.target.value = ""; return; }
    const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024).slice(0, remainingSlots);
    const base64s = await Promise.all(validFiles.map(toBase64));
    setForm(prev => ({ ...prev, gallery: [...prev.gallery, ...base64s] }));
    e.target.value = "";
  };

  const removeGalleryImage = (i) => {
    setForm(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }));
  };

  // ── Rating ────────────────────────────────────────────
  const isValidRating = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 && num <= 5;
};
  // ── validation ────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Short description is required";
    if (!form.category) e.category = "Pick a category";
    if (!form.governorate) e.governorate = "Pick a governorate";
    if (!form.city) e.city = "Pick a city";
    if (!form.lat || !form.lng) e.lat = "Pin a location on the map";
    if (!isValidRating(form.rating)) e.rating = "Rating must be between 0 and 5";
    return e;
  };

  // ── submit ────────────────────────────────────────────────
  const handleSubmit = () => {
    const e = validate();

    if (Object.keys(e).length > 0) {
      setErrors(e);

      const firstKey = FIELD_ORDER.find((key) => e[key]);
      const missingCount = Object.keys(e).length;
      const firstMessage = e[firstKey] || "Please fill in the required fields";

      showToast(
        "error",
        missingCount > 1 ? `${firstMessage} (+${missingCount - 1} more)` : firstMessage
      );
      return;
    }

    try {
      const storedPlaces = JSON.parse(localStorage.getItem("places")) || [];
      const nextId = getNextId(storedPlaces);

      const placeFields = { ...form };
      delete placeFields.rating;
      delete placeFields.reviewText;
      delete placeFields.coverImage;
      delete placeFields.gallery;

      let newPlace = {
        ...placeFields,
        id: nextId,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        rating: 0,
        reviews: 0,
        reviewsList: [],
        addedBy: user.email,
        createdAt: Date.now(),
      };

      newPlace = addReviewToPlace(newPlace, {
        rating: form.rating,
        text: form.reviewText,
        author: user.email,
      });

      setPlaceImages(newPlace.id, {
        coverImage: form.coverImage,
        gallery: form.gallery,
      });

      localStorage.setItem("places", JSON.stringify([...storedPlaces, newPlace]));
      updateUser({ contributions: [...(user.contributions || []), newPlace] });
      showToast("success", "Place added successfully");
      setTimeout(() => navigate("/contributions"), 1800);
    } catch (err) {
      console.error("Submit failed:", err);
      showToast("error", `Something went wrong: ${err.message}`);
    }
  };
  return (
    <div className="addplace-main">
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

      <div className="addplace-cont">
        <Link className="backTocontribute" to="/contributions">← Back to My Contributions</Link>
        <p className="addplace-intro">SHARE TO COMMUNITY</p>
        <h1 className="addplace-tit">Add New Place</h1>
        <p className="addplace-intro-p">
          Share a place with others — your discoveries help future explorers chart their own journeys through Egypt.
        </p>

        <div className="add-form-container">

          {/* ── BASIC INFO ── */}
          <section className="add-form-section">
            <h2 className="add-form-section-title">Basic Info</h2>

            <div className="add-field">
              <label className="add-label">TITLE</label>
              <input className={`add-input ${errors.title ? "input-error" : ""}`} name="title" value={form.title} onChange={handleChange} placeholder="e.g. White Desert National Park" />
              {errors.title && <span className="add-error">{errors.title}</span>}
            </div>

            <div className="add-field">
              <label className="add-label">SHORT DESCRIPTION</label>
              <input className={`add-input ${errors.description ? "input-error" : ""}`} name="description" value={form.description} onChange={handleChange} placeholder="One sentence that captures the place" />
              {errors.description && <span className="add-error">{errors.description}</span>}
            </div>

            <div className="add-field">
              <label className="add-label">FULL DESCRIPTION</label>
              <textarea className="add-input add-textarea" name="longdescription" value={form.longdescription} onChange={handleChange} placeholder="Tell the full story of this place..." rows={5} />
            </div>

            <div className="add-field">
              <label className="add-label">CATEGORY</label>
              <select className={`add-input add-select ${errors.category ? "input-error" : ""}`} name="category" value={form.category} onChange={handleChange}>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.title} — {c.desc}</option>
                ))}
              </select>
              {errors.category && <span className="add-error">{errors.category}</span>}
            </div>

            <div className="add-field">
              <label className="add-label">TAGS <span className="add-label-hint">press Enter to add</span></label>
              <div className={`add-tags-input ${errors.tags ? "input-error" : ""}`}>
                {form.tags.map(tag => (
                  <span key={tag} className="add-tag">
                    #{tag}
                    <button type="button" className="add-tag-remove" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
                <input
                  className="add-tags-field"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={form.tags.length === 0 ? "nature, adventure..." : ""}
                />
              </div>
            </div>
          </section>

          {/* ── LOCATION ── */}
          <section className="add-form-section">
            <h2 className="add-form-section-title">Location</h2>

            <div className="add-field-row">
              <div className="add-field">
                <label className="add-label">GOVERNORATE</label>
                <select className={`add-input add-select ${errors.governorate ? "input-error" : ""}`} name="governorate" value={form.governorate} onChange={handleChange}>
                  <option value="">Select governorate</option>
                  {LOCATIONS.map(l => (
                    <option key={l.governorate} value={l.governorate}>{l.governorate}</option>
                  ))}
                </select>
                {errors.governorate && <span className="add-error">{errors.governorate}</span>}
              </div>

              <div className="add-field">
                <label className="add-label">CITY</label>
                <select className={`add-input add-select ${errors.city ? "input-error" : ""}`} name="city" value={form.city} onChange={handleChange} disabled={!form.governorate}>
                  <option value="">Select city</option>
                  {availableCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <span className="add-error">{errors.city}</span>}
              </div>
            </div>

            <div className="add-field">
              <label className="add-label">PIN ON MAP <span className="add-label-hint">click the map or search below</span></label>

              <div className="add-map-search">
                <input
                  className="add-input"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLocationSearch()}
                  placeholder="Search location in Egypt..."
                />
                <button type="button" className="add-map-search-btn" onClick={handleLocationSearch} disabled={searchLoading}>
                  {searchLoading ? "..." : "Search"}
                </button>
              </div>
              {searchError && <span className="add-error">{searchError}</span>}
              {errors.lat && <span className="add-error">{errors.lat}</span>}

              <div className="add-map-wrapper">
                <MapContainer
                  center={[26.8206, 30.8025]}
                  zoom={6}
                  className="add-map"
                  ref={mapRef}
                  key="map" 
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <MapClickHandler onLocationSelect={handleMapClick} />
                  {markerPos && <Marker position={[markerPos.lat, markerPos.lng]} />}
                </MapContainer>
              </div>

              {markerPos && (
                <div className="add-coords">
                  <span>LAT: {form.lat}</span>
                  <span>LNG: {form.lng}</span>
                </div>
              )}
            </div>
          </section>

          {/* ── IMAGES ── */}
          <section className="add-form-section">
            <h2 className="add-form-section-title">Images</h2>

            <div className="add-field">
              <label className="add-label">COVER IMAGE</label>
              <div className={`add-image-upload ${errors.coverImage ? "input-error" : ""}`} onClick={() => coverInputRef.current.click()}>
                {form.coverImage ? (
                  <img src={form.coverImage} alt="cover preview" className="add-image-preview" />
                ) : (
                  <div className="add-image-placeholder">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Click to upload cover image</span>
                    <span className="add-image-hint">Max 2MB</span>
                  </div>
                )}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCoverImage} />
              {errors.coverImage && <span className="add-error">{errors.coverImage}</span>}
            </div>

            <div className="add-field">
              <label className="add-label">GALLERY <span className="add-label-hint">up to 3 images</span></label>
              <div className="add-gallery-grid">
                {form.gallery.map((img, i) => (
                  <div key={i} className="add-gallery-item">
                    <img src={img} alt={`gallery ${i}`} className="add-gallery-preview" />
                    <button type="button" className="add-gallery-remove" onClick={() => removeGalleryImage(i)}>×</button>
                  </div>
                ))}
                {form.gallery.length < 3 && (
                  <div className="add-gallery-add" onClick={() => galleryInputRef.current.click()}>
                    <span>+</span>
                  </div>
                )}
              </div>
              <input ref={galleryInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleGalleryImages} />
            </div>
          </section>

          <section className="add-form-section">
            <h2 className="add-form-section-title">Your Rating & Review <span className="add-section-optional">(optional)</span></h2>

            <div className="add-field">
              <label className="add-label">YOUR RATING <span className="add-label-hint">0 - 5</span></label>
              <input className="add-input" name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} placeholder="e.g. 4.9" />
            </div>

            <div className="add-field">
              <label className="add-label">YOUR REVIEW</label>
              <textarea className="add-input add-textarea" name="reviewText" value={form.reviewText} onChange={handleChange} placeholder="Share your experience about this place..." rows={4} />
            </div>
          </section>

          <div className="add-form-footer">
            <Link to="/contributions" className="add-cancel-btn">Cancel</Link>
            <button type="button" className="add-submit-btn" onClick={handleSubmit}>Submit Place</button>
          </div>

        </div>
      </div>
    </div>
  );
}