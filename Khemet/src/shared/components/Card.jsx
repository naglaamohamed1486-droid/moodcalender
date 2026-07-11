import { Link } from "react-router-dom";
import "./Card.css";
import { useAuth } from "../../app/providers/AuthContext";

function StatusIcon({ status }) {
  if (status === "approved") {
    return (
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "rejected") {
    return (
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 7v5l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({ place, showStatus = false }) {
  const { user, toggleFavorite, isFavorite } = useAuth();
  const saved = isFavorite(place.id);

  const handleSave = (e) => {
    e.preventDefault();
    if (!user) return;
    toggleFavorite(place);
  };

  return (
    <div className="card">
      <div className="card-image">
        <img src={place.coverImage || place.image} alt={place.title} />
        <span className="card-category">
          {place.category || place.tags?.[0] || "Explore"}
        </span>
        {user?.role == "user" && (
          <button
            className={`saved-btn ${saved ? "saved-btn--active" : ""}`}
            aria-label="Save"
            onClick={handleSave}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={saved ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>

      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{place.title}</h3>
          {showStatus && (
            <span
              className={`card-status-badge card-status-${place.status || "pending"}`}
            >
              <StatusIcon status={place.status || "pending"} />
              {place.status || "pending"}
            </span>
          )}
        </div>
        <p className="card-location">
          {place.city}
          {place.governorate && place.city !== place.governorate
            ? `, ${place.governorate}`
            : ""}
        </p>
        <p className="card-description">{place.description}</p>

        <div className="card-tags">
          {place.tags?.map((tag, i) => (
            <span key={i} className="tag">
              #{tag}
            </span>
          ))}
        </div>

        <div className="card-footer">
          <div className="card-rating">
            <span className="stars">★</span>
            <span>{place.rating || 4.5}</span>
            <span className="reviews">({place.reviews || 0})</span>
          </div>
          <div className="contrib-card-actions-right">
            <Link to={`/place/${place.id}`} className="card-btn">
              View details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
