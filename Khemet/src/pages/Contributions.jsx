import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deletePlaceImages, getPlaceImages } from "../components/PicCache";
import PlaceCard from "../components/AddPlaceCard";
import Toast from "../components/toast";
import "../css/contribution.css";
import "../css/contributecard.css"

const CATEGORIES = [
  { id: "nature", title: "Nature", desc: "Parks, deserts, mountains" },
  { id: "historical", title: "Historical", desc: "Ruins, monuments, temples" },
  { id: "beach", title: "Beach", desc: "Coasts, shores, lagoons" },
  { id: "urban", title: "Urban", desc: "Cities, neighbourhoods, markets" },
  { id: "adventure", title: "Adventure", desc: "Trails, dives, climbing" },
  { id: "cultural", title: "Cultural", desc: "Festivals, art, cuisine" },
];

const LOCATIONS = [
  { governorate: "Cairo", cities: ["Cairo", "Maadi", "Heliopolis"] },
  { governorate: "Alexandria", cities: ["Alexandria", "Borg El Arab"] },
  { governorate: "Giza", cities: ["Giza", "6th of October", "Sheikh Zayed"] },
  { governorate: "South Sinai", cities: ["Sharm El-Sheikh", "Dahab", "Nuweiba", "Saint Catherine"] },
  { governorate: "Red Sea", cities: ["Hurghada", "El Gouna", "Marsa Alam"] },
  { governorate: "Aswan", cities: ["Aswan", "Abu Simbel"] },
  { governorate: "Luxor", cities: ["Luxor"] },
  { governorate: "Matrouh", cities: ["Marsa Matruh", "Siwa"] },
  { governorate: "New Valley", cities: ["Kharga", "Dakhla", "Farafra", "Bahariya"] },
];

export default function Contributions() {
  const { user, updateUser } = useAuth();
  const contributions = user?.contributions || [];
  const [editTarget, setEditTarget] = useState(null); 
  const [form, setForm] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); 
  const [toast, setToast] = useState({ visible: false, type: "success" });

const showToast = (type) => {
  setToast({ visible: true, type });
  setTimeout(() => setToast({ visible: false, type }), 3000);
};

  /* ── open edit popup ── */
  const openEdit = (place) => {
    setEditTarget(place);
    setForm({
      title: place.title || "",
      description: place.description || "",
      longdescription: place.longdescription || "",
      category: place.category || "",
      tags: place.tags ? [...place.tags] : [],
      governorate: place.governorate || "",
      city: place.city || "",
      lat: place.lat || "",
      lng: place.lng || "",
      rating: place.rating || "",
      reviewText: place.reviewText || "",
    });
    setTagInput("");
    setErrors({});
    setSearchQuery("");
    setSearchError("");
  };

  const closeEdit = () => {
    setEditTarget(null);
    setForm({});
    setErrors({});
  };

  /* ── field change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "governorate") next.city = "";
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const availableCities =
    LOCATIONS.find((l) => l.governorate === form.governorate)?.cities || [];

  /* ── tags ── */
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, "");
      if (tag && !form.tags.includes(tag)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput("");
    }
  };
  const removeTag = (tag) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  /* ── location search ── */
  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery + ", Egypt"
        )}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        setForm((prev) => ({
          ...prev,
          lat: parseFloat(data[0].lat).toFixed(6),
          lng: parseFloat(data[0].lon).toFixed(6),
        }));
      } else {
        setSearchError("Location not found. Try a different search.");
      }
    } catch {
      setSearchError("Search failed. Check your connection.");
    } finally {
      setSearchLoading(false);
    }
  };

  /* ── validate & save ── */
  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title = "Title is required";
    if (!form.description?.trim()) e.description = "Short description is required";
    if (!form.category) e.category = "Pick a category";
    if (!form.governorate) e.governorate = "Pick a governorate";
    if (!form.city) e.city = "Pick a city";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const updatedContributions = contributions.map((p) =>
      p.id === editTarget.id ? { ...p, ...form } : p
    );
    showToast("update");
    updateUser({ contributions: updatedContributions });
    closeEdit();
  };

  /* ── delete ── */
 const handleDelete = async (id) => {
  await deletePlaceImages(id);
   updateUser({ contributions: contributions.filter((p) => p.id !== id) });
   showToast("delete");
  setDeleteConfirm(null);
};

  /* ── category label helper ── */
  const categoryLabel = (id) =>
    CATEGORIES.find((c) => c.id === id)?.title || id;

  return (
    <main className="contributions-main">
       <Toast
  message={toast.type === "delete" ? "Place deleted successfully" : "Place edited successfully"}
  visible={toast.visible}
  type={toast.type}
/>
      <div className="contributions-page">
        {/* ── header ── */}
        <p className="contributions-eyebrow">YOUR DISCOVERED GEMS</p>
        <div className="contributions-header-row">
          <div>
            <h3 className="contributions-title">My Contributions</h3>
            <p className="contributions-subtitle">
              {contributions.length === 0
                ? "You haven't added any places yet."
                : `${contributions.length} place${contributions.length !== 1 ? "s" : ""} added`}
            </p>
          </div>
          <Link className="contributions-add-btn" to="/addplace">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add a Gem
          </Link>
        </div>

        {/* ── empty state ── */}
        {contributions.length === 0 && (
          <div className="contributions-empty">
            <div className="contributions-empty-icon">✦</div>
            <p>No places yet. Be the first to pin a hidden gem.</p>
            <Link to="/addplace" className="contributions-empty-link">Add your first place →</Link>
          </div>
        )}

        {/* ── list ── */}
       <div className="contributions-list">
          {contributions.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onEdit={openEdit}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))}
          </div>
            </div>

      {/* ═══════════════════════════════════════════
          EDIT POPUP
      ═══════════════════════════════════════════ */}
      {editTarget && (
        <div className="ep-overlay" onClick={(e) => e.target === e.currentTarget && closeEdit()}>
          <div className="ep-modal">
            <div className="ep-modal-header">
              <h2 className="ep-modal-title">Edit Place</h2>
              <button className="ep-close" onClick={closeEdit}>×</button>
            </div>

            <div className="ep-body">

              {/* Basic Info */}
              <section className="ep-section">
                <h3 className="ep-section-title">Basic Info</h3>

                <div className="ep-field">
                  <label className="ep-label">TITLE</label>
                  <input className={`ep-input ${errors.title ? "ep-input-error" : ""}`} name="title" value={form.title} onChange={handleChange} placeholder="e.g. White Desert National Park" />
                  {errors.title && <span className="ep-error">{errors.title}</span>}
                </div>

                <div className="ep-field">
                  <label className="ep-label">SHORT DESCRIPTION</label>
                  <input className={`ep-input ${errors.description ? "ep-input-error" : ""}`} name="description" value={form.description} onChange={handleChange} placeholder="One sentence that captures the place" />
                  {errors.description && <span className="ep-error">{errors.description}</span>}
                </div>

                <div className="ep-field">
                  <label className="ep-label">FULL DESCRIPTION</label>
                  <textarea className="ep-input ep-textarea" name="longdescription" value={form.longdescription} onChange={handleChange} placeholder="Tell the full story..." rows={3} />
                </div>

                <div className="ep-field-row">
                  <div className="ep-field">
                    <label className="ep-label">CATEGORY</label>
                    <select className={`ep-input ep-select ${errors.category ? "ep-input-error" : ""}`} name="category" value={form.category} onChange={handleChange}>
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    {errors.category && <span className="ep-error">{errors.category}</span>}
                  </div>

                  <div className="ep-field">
                    <label className="ep-label">RATING <span className="ep-label-hint">0 – 5</span></label>
                    <input className="ep-input" name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} placeholder="4.5" />
                  </div>
                </div>

                <div className="ep-field">
                  <label className="ep-label">TAGS <span className="ep-label-hint">press Enter to add</span></label>
                  <div className="ep-tags-input">
                    {form.tags.map((tag) => (
                      <span key={tag} className="ep-tag">
                        #{tag}
                        <button type="button" className="ep-tag-remove" onClick={() => removeTag(tag)}>×</button>
                      </span>
                    ))}
                    <input
                      className="ep-tags-field"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder={form.tags.length === 0 ? "nature, desert..." : ""}
                    />
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="ep-section">
                <h3 className="ep-section-title">Location</h3>

                <div className="ep-field-row">
                  <div className="ep-field">
                    <label className="ep-label">GOVERNORATE</label>
                    <select className={`ep-input ep-select ${errors.governorate ? "ep-input-error" : ""}`} name="governorate" value={form.governorate} onChange={handleChange}>
                      <option value="">Select governorate</option>
                      {LOCATIONS.map((l) => (
                        <option key={l.governorate} value={l.governorate}>{l.governorate}</option>
                      ))}
                    </select>
                    {errors.governorate && <span className="ep-error">{errors.governorate}</span>}
                  </div>

                  <div className="ep-field">
                    <label className="ep-label">CITY</label>
                    <select className={`ep-input ep-select ${errors.city ? "ep-input-error" : ""}`} name="city" value={form.city} onChange={handleChange} disabled={!form.governorate}>
                      <option value="">Select city</option>
                      {availableCities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.city && <span className="ep-error">{errors.city}</span>}
                  </div>
                </div>

                <div className="ep-field">
                  <label className="ep-label">COORDINATES <span className="ep-label-hint">search to update pin</span></label>
                  <div className="ep-location-search">
                    <input
                      className="ep-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
                      placeholder="Search location in Egypt..."
                    />
                    <button type="button" className="ep-search-btn" onClick={handleLocationSearch} disabled={searchLoading}>
                      {searchLoading ? "..." : "Search"}
                    </button>
                  </div>
                  {searchError && <span className="ep-error">{searchError}</span>}
                  {(form.lat || form.lng) && (
                    <div className="ep-coords">
                      <span>LAT: {form.lat}</span>
                      <span>LNG: {form.lng}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Review */}
              <section className="ep-section">
                <h3 className="ep-section-title">Your Review <span className="ep-section-optional">(optional)</span></h3>
                <div className="ep-field">
                  <label className="ep-label">REVIEW</label>
                  <textarea className="ep-input ep-textarea" name="reviewText" value={form.reviewText} onChange={handleChange} placeholder="Share your experience..." rows={3} />
                </div>
              </section>
            </div>

            <div className="ep-footer">
              <button className="ep-cancel-btn" onClick={closeEdit}>Cancel</button>
              <button className="ep-save-btn" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          DELETE CONFIRM
      ═══════════════════════════════════════════ */}
      {deleteConfirm && (
        <div className="ep-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="ep-confirm">
            <div className="ep-confirm-icon">⚠</div>
            <h3 className="ep-confirm-title">Remove this place?</h3>
            <p className="ep-confirm-body">This action can't be undone. The place will be permanently removed from your contributions.</p>
            <div className="ep-confirm-actions">
              <button className="ep-cancel-btn" onClick={() => setDeleteConfirm(null)}>Keep it</button>
              <button className="ep-delete-confirm-btn" onClick={() => handleDelete(deleteConfirm)}>Yes, remove</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}