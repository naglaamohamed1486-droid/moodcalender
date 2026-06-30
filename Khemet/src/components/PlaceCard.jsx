import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/PlaceCard.css";

export default function PlaceCard({ place, onSelect }) {
  const navigate = useNavigate();

  const { user, toggleFavorite, isFavorite } = useAuth();

  const saved = isFavorite(place.id);

  const category =
    place.category || place.tags?.[0] || "Historical";

  return (
    <div
      className="place-card"
      onClick={() => navigate(`/place/${place.id}`)}
    >
      {/* IMAGE */}

      <div className="place-card-image">
        <img
          src={place.coverImage}
          alt={place.title}
        />

        <div className="place-card-overlay"></div>

        <span className="place-category">
          {category.toUpperCase()}
        </span>

        <button
          className="favorite-btn"
          onClick={(e) => {
            e.stopPropagation();

            if (!user) return;

            toggleFavorite(place);
          }}
        >
          <span
            className={
              saved
                ? "favorite-heart active"
                : "favorite-heart"
            }
          >
            {saved ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {/* BODY */}

      <div className="place-card-body">
        <h2>{place.title}</h2>

        <p className="place-city">
          📍 {place.city}
        </p>

        <p className="place-description">
          {place.description}
        </p>

        {/* TAGS */}

        <div className="place-tags">
          {place.tags?.slice(0, 4).map((tag) => (
            <span key={tag}>
              #{tag}
            </span>
          ))}

          {place.tags?.length > 4 && (
            <small>
              +{place.tags.length - 4}
            </small>
          )}
        </div>

        {/* FOOTER */}

        <div className="place-footer">
          <div className="place-rating">
            ⭐ {place.rating}

            <span>
              ({place.reviews})
            </span>
          </div>

          <button
            className="map-btn"
            onClick={(e) => {
              e.stopPropagation();

              if (!place.lat || !place.lng) return;

              onSelect(place);
            }}
          >
            📍 Show on Map
          </button>
        </div>
      </div>
    </div>
  );
}