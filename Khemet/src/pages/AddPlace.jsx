import { useState, useRef,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { setPlaceImages ,uploadSingleImage } from "../components/PicCache"
import L from "leaflet";
import Toast from "../components/toast";
import "leaflet/dist/leaflet.css";
import "../css/addplace.css"
import placesData from "../places.json";
import { CATEGORIES, LOCATIONS, getNextId } from '../data/placesdatahandling'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
  const skipMapFlyRef = useRef(false);
 
  const showToast = (type, message) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, type, message });
    toastTimeout.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 3000);
  };

  const availableCities = LOCATIONS.find(l => l.governorate === form.governorate)?.cities || [];
  const FIELD_ORDER = ["title", "description", "category", "governorate", "city", "lat", "rating", "coverImage"];

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
  const handleTagOutside = () => {
  const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
  if (tag && !form.tags.includes(tag)) {
    setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
  }
  setTagInput("");
};
  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // ── map zoom ──────────────────────────────────────────────
  const mapRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current) return;
    if (skipMapFlyRef.current) {
    skipMapFlyRef.current = false; 
    return;
  }
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
        const revRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${parsedLat}&lon=${parsedLng}&format=json`
        );
        const revData = await revRes.json();
        const addr = revData.address || {};
        const rawGov = addr.state || addr.county || addr.province || "";
        const rawCity = addr.city || addr.town || addr.village || addr.suburb || "";
        
        const matchedLocation = LOCATIONS.find((l) =>
          rawGov.toLowerCase().includes(l.governorate.toLowerCase()) ||
          l.governorate.toLowerCase().includes(rawGov.toLowerCase())
        );

          const matchedCity = matchedLocation?.cities.find((c) =>
          rawCity.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(rawCity.toLowerCase())
        );
    
        setMarkerPos({ lat: parsedLat, lng: parsedLng });
        skipMapFlyRef.current = true;
        setForm(prev => ({
                ...prev,
                lat: parsedLat.toFixed(6),
                lng: parsedLng.toFixed(6),
                ...(matchedLocation && { governorate: matchedLocation.governorate }),
                ...(matchedCity   && { city: matchedCity }),
              }));
        
        mapRef.current?.flyTo([parsedLat, parsedLng], 15, { duration: 1.2 });
           
        setErrors(prev => ({
            ...prev,
            lat: "",
            lng: "",
            ...(matchedLocation && { governorate: "" }),
            ...(matchedCity     && { city: "" }),
        }));
          if (!matchedLocation) {
          setSearchError("Location pinned, but governorate not recognised — please select manually.");
        } else if (!matchedCity) {
          setSearchError(`Governorate set to ${matchedLocation.governorate} — city not recognised, please select manually.`);
        } else {
          setSearchError("");
        }
          }
       
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  // ── images ────────────────────────────────────────────────
  const ImgToLink = (file) => new Promise((res, rej) => {
     const reader = new FileReader();
      reader.onloadend = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
  });

 const handleCoverImage = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { alert("Cover image must be under 2MB"); return; }
  const link = await ImgToLink(file);
  try {
    const url = await uploadSingleImage(link);
    setForm(prev => ({ ...prev, coverImage: url }));
  } catch (err) {
    console.error("Cover upload error:", err);
    showToast("error", "Failed to upload cover image");
  }
};

const handleGalleryImages = async (e) => {
  const files = Array.from(e.target.files);
  const remainingSlots = 3 - form.gallery.length;
  if (remainingSlots <= 0) { e.target.value = ""; return; }
  const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024).slice(0, remainingSlots);
  const links = await Promise.all(validFiles.map(ImgToLink));
  try {
    const urls = await Promise.all(links.map(uploadSingleImage));
    setForm(prev => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
  } catch (err) {
    console.error("Gallery upload error:", err);
    showToast("error", "Failed to upload gallery images");
  }
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
    if (!form.coverImage) e.coverImage = "Cover image is required";
    return e;
  };

  // ── submit ────────────────────────────────────────────────
  const handleSubmit = async () => {

  if (user.banned) {
    showToast("error", "Your account has been suspended and can't submit new places.");
    return;
  }  
  const e = validate();

  if (Object.keys(e).length > 0) {
    setErrors(e);

    const firstKey = FIELD_ORDER.find((key) => e[key]);
    const missingCount = Object.keys(e).length;
    const firstMessage = e[firstKey] || "Please fill in the required fields";

    showToast(
      "error",
      missingCount > 1
        ? `${firstMessage} (+${missingCount - 1} more)`
        : firstMessage
    );
    return;
  }

  const submittedForm =
    !form.gallery || form.gallery.length === 0
      ? { ...form, gallery: [form.coverImage] }
      : form;

  try {
    const nextId = await getNextId();

    const placeFields = { ...submittedForm };
    delete placeFields.rating;
    delete placeFields.reviewText;
    delete placeFields.coverImage;
    delete placeFields.gallery;

    let newPlace = {
      ...placeFields,
      id: nextId,
      lat: parseFloat(submittedForm.lat),
      lng: parseFloat(submittedForm.lng),
      rating: 0,
      reviews: 0,
      reviewsList: [],
      addedByname: user.name,
      addedByemail: user.email,
      createdAt: Date.now(),
      status: "pending",
    };

    newPlace = addReviewToPlace(newPlace, {
      rating: submittedForm.rating,
      text: submittedForm.reviewText,
      author: user.email,
    });

    const images = await setPlaceImages(newPlace.id, {
      coverImage: submittedForm.coverImage,
      gallery: submittedForm.gallery,
    });

    newPlace = {
      ...newPlace,
      coverImage: images.coverImage,
      gallery: images.gallery,
    };

    await updateUser({
      contributions: [...(user.contributions || []), newPlace],
    });

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

            {user.banned && (
              <div className="add-banned-notice">
                Your account is currently suspended. You can't add new places while suspended.
              </div>
            )}

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
                  onBlur={handleTagOutside}
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