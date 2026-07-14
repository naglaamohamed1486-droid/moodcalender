import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import "./PlaceCard.css";

export default function PlaceCard({ place, onSelect }) {
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite } = useAuth();

  const saved = isFavorite(place.id);
  const category = place.category || place.tags?.[0] || "Historical";

  const [avgRating, setAvgRating] = useState(place.rating || 0);
  const [totalReviews, setTotalReviews] = useState(place.reviews || 0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const q = query(
          collection(db, "comments"),
          where("placeId", "==", String(place.id))
        );
        const snap = await getDocs(q);
        const firebaseRatings = snap.docs
          .map((doc) => doc.data().rating)
          .filter((r) => r !== null && r !== undefined);

        const jsonRating = place.rating || 0;
        const jsonReviews = place.reviews || 0;

        const allRatings = [...firebaseRatings];
        if (allRatings.length === 0) {
          setAvgRating(jsonRating);
          setTotalReviews(jsonReviews);
        } else {
          allRatings.push(jsonRating);
          const sum = allRatings.reduce((a, b) => a + b, 0);
          setAvgRating(sum / allRatings.length);
          setTotalReviews(jsonReviews + firebaseRatings.length);
        }
      } catch (err) {
        console.error("Error fetching ratings:", err)
        setAvgRating(place.rating || 0);
        setTotalReviews(place.reviews || 0);
      }
    };

    fetchRatings();
  }, [place.id]);

  return (
    <div className="place-card">
      {/* IMAGE */}
      <div className="place-card-image">
        <img src={place.coverImage} alt={place.title} />
        <div className="place-card-overlay"></div>
        <span className="place-category">{category.toUpperCase()}</span>
        {user?.role == "user" && (
          <button
            className={`favorite-btn ${saved ? "favorite-btn--active" : ""}`}
            aria-label="Save"
            onClick={(e) => {
              e.stopPropagation();
              if (!user) return;
              toggleFavorite(place);
            }}
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

      {/* BODY */}
      <div className="place-card-body">
        <h2>{place.title}</h2>
        <p className="place-city">📍 {place.city}</p>
        <p className="place-description">{place.description}</p>

        {/* TAGS */}
        <div className="place-tags">
          {place.tags?.slice(0, 4).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
          {place.tags?.length > 4 && <small>+{place.tags.length - 4}</small>}
        </div>

        {/* FOOTER */}
        <div className="place-footer">
          <div className="place-rating">
            ★ {avgRating.toFixed(1)}
            <span>({totalReviews} reviews)</span>
          </div>

          <div className="place-actions">
            <button
              className="details-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/place/${place.id}`);
              }}
            >
              👁 Show Details
            </button>

            <button
              className="map-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (!place.lat || !place.lng) return;
                onSelect((prev) => (prev?.id === place.id ? null : place));
              }}
            >
              📍 Show on Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}