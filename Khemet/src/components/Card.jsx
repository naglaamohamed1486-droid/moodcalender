import { Link } from "react-router-dom";
import "../css/Card.css";
import { useAuth } from "../context/AuthContext";

function Card({ place }) {
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
        <img src={place.coverImage} alt={place.title} />
        <span className="card-category">{place.category || place.tags?.[0] || "Explore"}</span>
        <button
          className={`saved-btn ${saved ? "saved-btn--active" : ""}`}
          aria-label="Save"
          onClick={handleSave}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="card-body">
        <h3 className="card-title">{place.title}</h3>
        <p className="card-location">{place.city}</p>
        <p className="card-description">{place.description}</p>

        <div className="card-tags">
          {place.tags?.map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="card-footer">
          <div className="card-rating">
            <span className="stars">★</span>
            <span>{place.rating || 4.5}</span>
            <span className="reviews">({place.reviews || 0})</span>
          </div>
          <Link to={`/place/${place.id}`} className="card-btn">
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;