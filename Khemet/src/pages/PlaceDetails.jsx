import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import placesData from "../places.json";
import Card from "../components/Card";
import "../css/PlaceDetails.css";
import { useAuth } from "../context/AuthContext";

function PlaceDetails() {
  const { id } = useParams();

  const { user, toggleFavorite, isFavorite } = useAuth();

  const [place, setPlace] = useState(null);
  const [relatedPlaces, setRelatedPlaces] = useState([]);

  const saved = place ? isFavorite(place.id) : false;


  useEffect(() => {
     window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    const found = placesData.find((p) => p.id === parseInt(id));
    setPlace(found);

    if (found) {
      const similar = placesData.filter((p) => {
        if (p.id === found.id) return false;

        const sameCity = p.city === found.city;
        const commonTags = p.tags?.some((tag) => found.tags?.includes(tag));

        return sameCity || commonTags;
      });

      const sorted = similar.sort((a, b) => {
        const aScore = a.city === found.city ? 2 : 0;
        const bScore = b.city === found.city ? 2 : 0;
        return bScore - aScore;
      });

      setRelatedPlaces(sorted.slice(0, 3));
    }
  }, [id]);

  if (!place) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  const uniqueImages = [
    ...new Set([place.coverImage, ...(place.gallery || [])]),
  ];

  return (
    <div className="details-page">
      <div className="hero-wrap">
        <img src={place.coverImage} alt={place.title} />
        <div className="hero-overlay">
          <Link to="/map" className="back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to map
          </Link>
          <div className="hero-text">
            <h1>{place.title}</h1>
            <p>{place.city}</p>
          </div>
        </div>
      </div>

      <div className="content-wrap">
        <div className="details-grid">
          <div className="left-col">
            <div className="block">
              <h2>About this place</h2>
              <p>{place.longdescription || place.description}</p>
              <div className="tags">
                {place.tags?.map((tag, i) => (
                  <span key={i} className="tag">#{tag}</span>
                ))}
              </div>
            </div>

            {uniqueImages.length > 0 && (
              <div className="block">
                <h2>Gallery</h2>
                <div className="gallery-thumbs">
                  {uniqueImages.map((img, i) => (
                    <div key={i} className="thumb">
                      <img src={img} alt={`${place.title}-${i}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

         <div className="right-col">
  <div className="location-block">
    <div className="actions">
    <button className="btn-primary">+ Add to trip</button>
    <button
    className={`btn-secondary ${saved ? "btn-secondary--saved" : ""}`}
    onClick={() => user && toggleFavorite(place)}
  >
    {saved ? "♥ Saved" : "♡ Save"}
  </button>
  </div>
  <br />

    <h3>LOCATION</h3>  
    <p className="location-name">{place.city}</p>
    <div className="location-map">
      <iframe
        title="map"
        width="100%"
        height="300"
        frameBorder="0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${
          place.lng - 0.015
        },${place.lat - 0.015},${place.lng + 0.015},${place.lat + 0.015}&marker=${
          place.lat
        },${place.lng}`}
      />
    </div>
  </div>
</div>          
          </div>
        </div>

        {relatedPlaces.length > 0 && (
          <div className="related">
            <h2>You may also like</h2>
            <div className="places">
              {relatedPlaces.map((item) => (
                <Card key={item.id} place={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    
  );
}

export default PlaceDetails;