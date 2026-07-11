import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/card.css";
import { categoryLabel } from "../data/placesdatahandling";

function StatusIcon({ status }) {
  if (status === "approved") {
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "rejected") {
    return (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M12 7v5l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlaceCard({ place, onEdit, onDelete }) {
  const { user, toggleFavorite, isFavorite } = useAuth();
  const saved = isFavorite(place.id);

  const handleSave = (e) => {
    e.preventDefault();
    if (!user) return;
    toggleFavorite(place);
  };

  return (
    <div className="contrib-card">
      {place.coverImage ? (
        <div className="contrib-card-thumb">
          <img src={place.coverImage} alt={place.title} />
          <span className="contrib-card-category-overlay">
            {categoryLabel(place.category)}
          </span>
        </div>
      ) : (
        <div className="contrib-card-thumb contrib-card-thumb--empty">
          <span>✦</span>
        </div>
      )}

      <div className="contrib-card-body">
        <div className="contrib-card-top">
          <div className="contrib-card-headline">
            <h4 className="contrib-card-name">{place.title}</h4>

            {place.status === "rejected" && place.rejectionReason ? (
              <p className="contrib-rejection-reason">
                {place.rejectionReason}
              </p>
            ) : (
              <p className="contrib-card-desc">{place.description}</p>
            )}
          </div>

          <div className="contrib-card-top-right">
            <span
              className={`contrib-status-badge contrib-status-${
                place.status || "pending"
              }`}
            >
              <StatusIcon status={place.status || "pending"} />
              {place.status || "pending"}
            </span>
          </div>
        </div>

        <div className="contrib-card-meta">
          <span className="contrib-meta-pill contrib-meta-location">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>

            {place.city}
            {place.governorate && place.city !== place.governorate
              ? `, ${place.governorate}`
              : ""}
          </span>

          <span className="contrib-meta-pill contrib-meta-category">
            {categoryLabel(place.category)}
          </span>

          {place.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="contrib-meta-pill contrib-meta-tag">
              #{tag}
            </span>
          ))}

          {place.tags?.length > 3 && (
            <span className="contrib-meta-pill contrib-meta-more">
              +{place.tags.length - 3}
            </span>
          )}
        </div>

        <div className="contrib-card-actions">
          <span className="contrib-card-rating">
            <span className="stars">★</span>
            <span>{place.rating || 4.5}</span>
            <span className="reviews">({place.reviews || 0})</span>
          </span>

          <div className="contrib-card-actions-right">
            <button
              className="x-contrib-btn-edit"
              onClick={() => onEdit(place)}
            >
              Edit
            </button>

            <button
              className="contrib-btn-delete"
              onClick={() => onDelete(place.id)}
            >
              Delete
            </button>

            <Link to={`/place/${place.id}`} className="card-btn">
              View details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}