import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlaceImages } from "../components/PicCache"; 
import "../css/Card.css";

function PlaceCard({ place, onEdit, onDelete }) {
  const { user, toggleFavorite, isFavorite } = useAuth();
  const [images, setImages] = useState({ coverImage: "", gallery: [] });

  const saved = isFavorite(place.id);

  useEffect(() => {
    getPlaceImages(place.id).then(setImages);
  }, [place.id]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!user) return;
    toggleFavorite(place);
  };

  return (
    <div className="card">
      <div className="card-image">
        {images.coverImage ? (
          <img src={images.coverImage} alt={place.title} />
        ) : (
          <span className="contrib-thumb-placeholder">✦</span>
        )}

        <span className="card-category">
          {place.category || place.tags?.[0] || "Explore"}
        </span>
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

export default PlaceCard;