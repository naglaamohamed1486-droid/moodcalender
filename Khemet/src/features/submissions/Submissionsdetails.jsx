import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "./adminreview.css";

const categoryLabel = (cat) => {
  if (!cat) return "Uncategorized";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SubDetails({ place, onDetClose, onhandleDecision }) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reasonText, setReasonText] = useState(place.rejectionReason || "");

  const handleApprove = () => {
    onhandleDecision(place, "approved", {
      approvedAt: new Date().toISOString(),
      rejectionReason: null,
      rejectedAt: null,
    });
    onDetClose();
  };

  const confirmReject = () => {
    if (!reasonText.trim()) return;
    onhandleDecision(place, "rejected", {
      rejectionReason: reasonText.trim(),
      rejectedAt: new Date().toISOString(),
    });
    onDetClose();
  };

  return (
    <div
      className="sub-overlay"
      onClick={(e) => e.target === e.currentTarget && onDetClose()}
    >
      <div className="sub-modal">
        <div className="sub-modal-header">
          <h2 className="sub-modal-title">Submitted Place Details</h2>
          <button
            className="sub--close"
            onClick={onDetClose}
            aria-label="Close"
          >
            ×
          </button>
          <p className="sub-data">
            Review the submitted place details and decide if this place meets
            platform standards.
          </p>
        </div>

        <div className="sub-body">
          <section className="sub-section">
            <div className="ep-coverImg">
              {place.coverImage ? (
                <div className="sub-cover-thumb">
                  <img src={place.coverImage} alt={place.title} />
                  <span className="sub-cover-category">
                    {categoryLabel(place.category)}
                  </span>
                </div>
              ) : (
                <div className="sub-card-img-placeholder" />
              )}
            </div>

            <h3 className="sub-section-title">Basic Info</h3>

            <div className="sub-field">
              <p className="sub-data sub-inline-field">
                <span className="sub-label">TITLE :</span>
                {place.title}
              </p>
            </div>

            <div className="sub-field">
              <div className="sub-location-cont">
                <div className="sub-location-data">
                  <p className="sub-data sub-inline-field">
                    <span className="sub-label">GOVERNORATE :</span>
                    {place.governorate || "—"}
                  </p>
                  <p className="sub-data sub-inline-field">
                    <span className="sub-label">CITY :</span>
                    {place.city || "—"}
                  </p>
                </div>

                {place.lat && place.lng && (
                  <div className="sub-showOnMap">
                    <MapContainer
                      center={[place.lat, place.lng]}
                      zoom={12}
                      className="add-map"
                      key={`${place.lat}-${place.lng}`}
                      dragging={false}
                      scrollWheelZoom={false}
                      doubleClickZoom={false}
                      zoomControl={false}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Marker position={[place.lat, place.lng]} />
                    </MapContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="sub-field">
              <span className="sub-label">SHORT DESCRIPTION</span>
              <div className="sub-desc-box">
                <p className="sub-data">{place.description || "—"}</p>
              </div>
            </div>

            <div className="sub-field">
              <span className="sub-label">FULL DESCRIPTION</span>
              <div className="sub-desc-box sub-desc-box-lg">
                <p className="sub-data">{place.longdescription || "—"}</p>
              </div>
            </div>

            <div className="sub-field">
              <span className="sub-label">TAGS</span>
              <div className="sub-tags-container">
                {(place.tags || []).length > 0 ? (
                  place.tags.map((tag) => (
                    <span className="sub-tag" key={tag}>
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="sub-tag sub-tag-empty">No tags added</span>
                )}
              </div>
            </div>
          </section>

          <section className="sub-section">
            <h3 className="sub-section-title">Place Gallery</h3>
            <div className="sub-gallery-cont">
              {place.gallery && place.gallery.length > 0 ? (
                place.gallery.map((img, i) => (
                  <div className="sub-img-gallery" key={i}>
                    <img src={img} alt={`${place.title} ${i + 1}`} />
                  </div>
                ))
              ) : (
                <div className="sub-gallery-empty">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      stroke="#7A6040"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="8.5"
                      cy="10"
                      r="1.5"
                      stroke="#7A6040"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M4 16l4.5-4 3 3 4-4.5L21 16"
                      stroke="#7A6040"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>No gallery images were added to this submission.</p>
                </div>
              )}
            </div>
          </section>

          <section className="sub-section">
            <h3 className="sub-section-title">User Info</h3>
            <div className="sub-user-info">
              <div className="sub-field">
                <p className="sub-data sub-inline-field">
                  <span className="sub-label">USER NAME :</span>
                  {place.addedByname || place.ownerName}
                </p>
              </div>
              <div className="sub-field">
                <p className="sub-data sub-inline-field">
                  <span className="sub-label">USER EMAIL :</span>
                  {place.addedByemail || place.ownerEmail}
                </p>
              </div>

              <div className="sub-feedback-card">
                <div className="sub-feedback-rating">
                  <span className="sub-label">USER RATING</span>
                  <span className="sub-feedback-rating-value">
                    ★ {place.rating ?? "—"}
                  </span>
                </div>
                <div className="sub-feedback-review">
                  <span className="sub-label">USER REVIEW</span>
                  {place.reviewsList?.some((r) => r.text) ? (
                    place.reviewsList
                      .filter((r) => r.text)
                      .map((r, i) => (
                        <div key={i} className="review">
                          <p className="review-text">{r.text}</p>
                          <span className="review-meta">
                            {r.author} · {new Date(r.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                  ) : (
                    <p className="review-empty">No written review provided.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {showRejectInput && (
            <section className="sub-section sub-reject-section">
              <h3 className="sub-section-title">Rejection Reason</h3>
              <textarea
                className="sub-reject-textarea"
                placeholder="Explain why this place is being rejected..."
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                rows={3}
              />
              <div className="sub-reject-actions">
                <button
                  className="sub-btn sub-btn-reject"
                  onClick={confirmReject}
                  disabled={!reasonText.trim()}
                >
                  Confirm Reject
                </button>
                <button
                  className="sub-btn sub-btn-cancel"
                  onClick={() => setShowRejectInput(false)}
                >
                  Cancel
                </button>
              </div>
            </section>
          )}
        </div>

        <section className="sub-actions">
          <button className="sub-btn sub-btn-approve" onClick={handleApprove}>
            Approve
          </button>
          {!showRejectInput && (
            <button
              className="sub-btn sub-btn-reject"
              onClick={() => setShowRejectInput(true)}
            >
              Reject
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
