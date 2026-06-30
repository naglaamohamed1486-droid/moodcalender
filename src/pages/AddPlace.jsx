import { useState, useRef } from "react";
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
  { governorate: "Cairo", cities: ["Cairo", "Maadi", "Heliopolis", "Nasr City", "New Cairo", "6th of October City"] },
  { governorate: "Giza", cities: ["Giza", "Dokki", "Mohandessin", "Haram", "Faisal", "Sheikh Zayed"] },
  { governorate: "Alexandria", cities: ["Alexandria", "Montaza", "Smouha", "Miami", "Agami"] },
  { governorate: "Aswan", cities: ["Aswan", "Kom Ombo", "Edfu", "Abu Simbel"] },
  { governorate: "Luxor", cities: ["Luxor", "Karnak", "Esna", "Armant"] },
  { governorate: "South Sinai", cities: ["Sharm El-Sheikh", "Dahab", "Nuweiba", "Taba", "Saint Catherine"] },
  { governorate: "North Sinai", cities: ["Arish", "Rafah", "Bir al-Abed"] },
  { governorate: "Red Sea", cities: ["Hurghada", "Marsa Alam", "El Gouna", "Safaga", "Quseer"] },
  { governorate: "Matrouh", cities: ["Marsa Matruh", "Siwa", "Alamein", "Sidi Barrani"] },
  { governorate: "New Valley", cities: ["Kharga", "Dakhla", "Farafra", "Bahariya"] },
  { governorate: "Fayoum", cities: ["Fayoum", "Tamiya", "Sinnuris"] },
  { governorate: "Beni Suef", cities: ["Beni Suef", "Al Fashn", "Nasser"] },
  { governorate: "Minya", cities: ["Minya", "Mallawi", "Samalut", "Ashmunin"] },
  { governorate: "Asyut", cities: ["Asyut", "Manfalut", "Abu Tig"] },
  { governorate: "Sohag", cities: ["Sohag", "Akhmim", "Tahta", "Girga"] },
  { governorate: "Qena", cities: ["Qena", "Nag Hammadi", "Qift", "Dendara"] },
  { governorate: "Suez", cities: ["Suez", "Ain Sokhna"] },
  { governorate: "Ismailia", cities: ["Ismailia", "Fayed", "Qantara"] },
  { governorate: "Port Said", cities: ["Port Said", "Port Fouad"] },
  { governorate: "Damietta", cities: ["Damietta", "New Damietta", "Ras El Bar"] },
  { governorate: "Dakahlia", cities: ["Mansoura", "Talkha", "Mit Ghamr", "Sherbin"] },
  { governorate: "Sharqia", cities: ["Zagazig", "10th of Ramadan", "Belbeis", "Abu Hammad"] },
  { governorate: "Qalyubia", cities: ["Banha", "Shubra El Kheima", "Qalyub", "Khanka"] },
  { governorate: "Gharbia", cities: ["Tanta", "Mahalla El Kubra", "Kafr El Zayat", "Zefta"] },
  { governorate: "Monufia", cities: ["Shebeen El Kom", "Menouf", "Sadat City", "Ashmoun"] },
  { governorate: "Beheira", cities: ["Damanhur", "Kafr El Dawwar", "Rashid", "Abu Hummus"] },
  { governorate: "Kafr El Sheikh", cities: ["Kafr El Sheikh", "Desouk", "Fouh", "Metoubes"] },
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
  const [toastVisible, setToastVisible] = useState(false);

  const availableCities = LOCATIONS.find(l => l.governorate === form.governorate)?.cities || [];


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

  // ── validation ────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Short description is required";
    if (!form.category) e.category = "Pick a category";
    if (!form.governorate) e.governorate = "Pick a governorate";
    if (!form.city) e.city = "Pick a city";
    if (!form.lat || !form.lng) e.lat = "Pin a location on the map";
    if (!form.coverImage) e.coverImage = "Cover image is required";
    return e;
  };

  // ── submit ────────────────────────────────────────────────
  const handleSubmit = () => {
  const e = validate();
  if (Object.keys(e).length > 0) { setErrors(e); return; }

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

    setToastVisible(true);
    setTimeout(() => navigate("/contributions"), 1800);
  } catch (err) {
    console.error("Submit failed:", err);
    alert("Something went wrong: " + err.message);
  }
};
  return (
    <div className="addplace-main">
      <Toast message="Place created successfully!" visible={toastVisible} />

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
                  key={markerPos ? `${markerPos.lat}-${markerPos.lng}` : "default"}
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