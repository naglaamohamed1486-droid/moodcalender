import { useState ,useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deletePlaceImages } from "../components/PicCache";
import PlaceCard from "../components/AddPlaceCard";
import Toast from "../components/toast";
import "../css/contribution.css";
import "../css/contributecard.css"
import { CATEGORIES, LOCATIONS,  categoryLabel } from '../data/placesdatahandling'
import useScrollToTop from "../components/UseScrollToTop";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function Contributions() {
   useScrollToTop();
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
  const [toast, setToast] = useState({ visible: false, type: "success", message: "" });
const toastTimeout = useRef(null);
const [activeTab, setActiveTab] = useState("all");

const statusCounts = {
  all: contributions.length,
  pending: contributions.filter((p) => (p.status || "pending") === "pending").length,
  approved: contributions.filter((p) => p.status === "approved").length,
  rejected: contributions.filter((p) => p.status === "rejected").length,
};

const visibleContributions =
  activeTab === "all"
    ? contributions
    : contributions.filter((p) => (p.status || "pending") === activeTab);
const showToast = (type, message) => {
  if (toastTimeout.current) clearTimeout(toastTimeout.current);
  setToast({ visible: true, type, message });
  toastTimeout.current = setTimeout(() => {
    setToast((t) => ({ ...t, visible: false }));
  }, 3000);
};


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
      const handleTagBlur = () => {
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
      if (tag && !form.tags.includes(tag)) {
        setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      setTagInput("");
    };
  const removeTag = (tag) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));


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

    if (data.length === 0) {
      setSearchError("Location not found. Try a different name.");
      return;
    }

    const { lat, lon } = data[0];
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lon);

    // reverse geocode for structured address
    const revRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${parsedLat}&lon=${parsedLng}&format=json`
    );
    const revData = await revRes.json();
    const addr = revData.address || {};

    const rawGov  = addr.state || addr.county || addr.province || "";
    const rawCity = addr.city  || addr.town   || addr.village  || addr.suburb || "";

    const matchedLocation = LOCATIONS.find((l) =>
      rawGov.toLowerCase().includes(l.governorate.toLowerCase()) ||
      l.governorate.toLowerCase().includes(rawGov.toLowerCase())
    );

    const matchedCity = matchedLocation?.cities.find((c) =>
      rawCity.toLowerCase().includes(c.toLowerCase()) ||
      c.toLowerCase().includes(rawCity.toLowerCase())
    );

    setForm((prev) => ({
      ...prev,
      lat: parsedLat.toFixed(6),
      lng: parsedLng.toFixed(6),
      ...(matchedLocation && { governorate: matchedLocation.governorate }),
      ...(matchedCity     && { city: matchedCity }),
    }));

    setErrors((prev) => ({
      ...prev,
      lat: "",
      lng: "",
      ...(matchedLocation && { governorate: "" }),
      ...(matchedCity     && { city: "" }),
    }));

    if (!matchedLocation) {
      setSearchError("Location pinned — governorate not recognised, please select manually.");
    } else if (!matchedCity) {
      setSearchError(`Governorate set to ${matchedLocation.governorate} — city not recognised, please select manually.`);
    } else {
      setSearchError("");
    }

  } catch {
    setSearchError("Search failed. Check your connection.");
  } finally {
    setSearchLoading(false);
  }
};

  const isValidRating = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 && num <= 5;
};

  const FIELD_ORDER = ["title", "description", "category", "rating", "governorate", "city", "lat"];


  const validate = () => {
    const e = {};
    if (!form.title?.trim()) e.title = "Title is required";
    if (!form.description?.trim()) e.description = "Short description is required";
    if (!form.category) e.category = "Pick a category";
    if (!isValidRating(form.rating)) e.rating = "Rating must be between 0 and 5";
    if (!form.governorate) e.governorate = "Pick a governorate";
    if (!form.city) e.city = "Pick a city";
    if (!form.lat || !form.lng) e.lat = "Search and set a location";
      return e;
  };

const handleSave = async () => {
  const e = validate();

  if (Object.keys(e).length > 0) {
    setErrors(e);
    const firstKey = FIELD_ORDER.find((key) => e[key]);
    const missingCount = Object.keys(e).length;
    const firstMessage = e[firstKey] || "Please fill in the required fields";
    showToast("error", missingCount > 1 ? `${firstMessage} (+${missingCount - 1} more)` : firstMessage);
    return;
  }

  const wasReviewed = editTarget.status === "approved" || editTarget.status === "rejected";

  const updatedContributions = contributions.map((p) => {
    if (p.id !== editTarget.id) return p;
    return {
      ...p,
      ...form,
      ...(wasReviewed && {
        status: "pending",
        approvedAt: null,
        rejectedAt: null,
        rejectionReason: null,
      }),
    };
  });

  try {
    await updateUser({ contributions: updatedContributions });
    showToast(
      "update",
      wasReviewed ? "Place updated & resent for admin review" : "Place updated"
    );
    closeEdit();
  } catch (err) {
    console.error("Save failed:", err);
    showToast("error", `Couldn't save changes: ${err.message}`);
  }
};

const handleDelete = async (id) => {
  try {
    await deletePlaceImages(id);

    const updatedContributions = (user.contributions || []).filter((p) => p.id !== id);
    const updatedFavorites = (user.favorites || []).filter((p) => p.id !== id);

    await updateUser({
      contributions: updatedContributions,
      favorites: updatedFavorites,
    });

    showToast("delete", "Place deleted");
  } catch (err) {
    console.error("Delete failed:", err);
    showToast("error", `Something went wrong: ${err.message}`);
  } finally {
    setDeleteConfirm(null);
  }
};
  return (
    <main className="contributions-main">
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />
      <div className="contributions-page">
      
        <p className="contributions-eyebrow">YOUR DISCOVERED PLACES</p>
        <div className="contributions-header-row">
          <div>
            <h3 className="contributions-title">My Contributions</h3>
            <p className="contributions-subtitle">
              {contributions.length === 0
                ? "You haven't added any places yet."
                : `${contributions.length} place${contributions.length !== 1 ? "s" : ""} Total`}
            </p>
          </div>
          <Link className="contributions-add-btn" to="/addplace">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add a Place
          </Link>
        </div>

     
       {contributions.length > 0 && (
            <div className="ctabs">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`ctab-btn ctab-${tab.id} ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  <span className="ctab-count">{statusCounts[tab.id]}</span>
                </button>
              ))}
            </div>
          )}

          {contributions.length === 0 && (
            <div className="contributions-empty">
              <div className="contributions-empty-icon">✦</div>
              <p>No places yet. Be the first to pin a hidden gem.</p>
              <Link to="/addplace" className="contributions-empty-link">Add your first place →</Link>
            </div>
          )}

          {contributions.length > 0 && visibleContributions.length === 0 && (
            <div className="contributions-empty contributions-empty--tab">
              <div className="contributions-empty-icon">◍</div>
              <p>No {activeTab === "all" ? "" : activeTab} places here.</p>
            </div>
          )}

          <div className="contributions-list">
            {visibleContributions.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onEdit={openEdit}
                onDelete={(id) => setDeleteConfirm(id)}
              />
            ))}
          </div>
            </div>

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
                      onBlur={handleTagBlur}
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