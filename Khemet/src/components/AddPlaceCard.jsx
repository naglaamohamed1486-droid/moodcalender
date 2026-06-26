import { useState, useEffect } from "react";
import { getPlaceImages } from "./PicCache";

const CATEGORIES = [
  { id: "nature", title: "Nature" },
  { id: "historical", title: "Historical" },
  { id: "beach", title: "Beach" },
  { id: "urban", title: "Urban" },
  { id: "adventure", title: "Adventure" },
  { id: "cultural", title: "Cultural" },
  { id: "photography", title: "Photography" },
  { id: "romantic", title: "Romantic" },
  { id: "modern", title: "Modern" },
  { id: "diving", title: "Diving" },
  { id: "mysterious", title: "Mystery" },
  { id: "hidden", title: "Hidden Gems" },
  { id: "food", title: "Food" },
];

const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.title || id;

export default function PlaceCard({ place, onEdit, onDelete }) {
  const [images, setImages] = useState({ coverImage: "", gallery: [] });

  useEffect(() => {
    getPlaceImages(place.id).then(setImages);
  }, [place.id]);

  return (
    <div className="contrib-card">
      {images.coverImage ? (
        <div className="contrib-card-thumb">
          <img src={images.coverImage} alt={place.title} />
        </div>
      ) : (
        <div className="contrib-card-thumb contrib-card-thumb--empty">
          <span>✦</span>
        </div>
      )}

      <div className="contrib-card-body">
        <div className="contrib-card-top">
          <div>
            <h4 className="contrib-card-name">{place.title}</h4>
            <p className="contrib-card-desc">{place.description}</p>
          </div>
          {place.rating && (
            <span className="contrib-card-rating">★ {place.rating}</span>
          )}
        </div>

        <div className="contrib-card-meta">
          <span className="contrib-meta-pill contrib-meta-location">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
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
            <span key={tag} className="contrib-meta-pill contrib-meta-tag">#{tag}</span>
          ))}

          {place.tags?.length > 3 && (
            <span className="contrib-meta-pill contrib-meta-more">
              +{place.tags.length - 3}
            </span>
          )}
        </div>

        <div className="contrib-card-actions">
          <button className="contrib-btn-edit" onClick={() => onEdit(place)}>Edit</button>
          <button className="contrib-btn-delete" onClick={() => onDelete(place.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}