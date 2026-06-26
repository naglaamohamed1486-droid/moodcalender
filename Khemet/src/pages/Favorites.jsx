import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import "../css/Favorites.css";


function Favorites() {
  const { user, favorites } = useAuth();

  if (!user) {
    return (
       <div className="fav-empty">
        <p>Please sign in to see your saved places.</p>
        <Link to="/login" className="fav-explore-btn">Sign In</Link>
      </div>
    );
  }

  

  return (
    <div className="fav-page">
      <div className="fav-header">
        <small>YOUR COLLECTION</small>
        <h1>Saved Places</h1>
        <p>{favorites.length} place{favorites.length !== 1 ? "s" : ""} saved</p>
      </div>

      {favorites.length === 0 ? (
        <div className="pf-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Z" fill="#C9A84C" opacity="0.3"/>
                </svg>
                <p className="pf-empty-title">No saved places yet</p>
                <p className="pf-empty-sub">Explore the map and save places you love</p>
                <Link to="/map" className="pf-empty-btn">Explore Map</Link>
            </div>
      ) : (
        <div className="fav-grid">
          {favorites.map((place) => (
            <Card key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;