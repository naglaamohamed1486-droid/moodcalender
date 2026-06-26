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
        <div className="fav-empty">
          <p>You haven't saved any places yet.</p>
          <Link to="/feed" className="fav-explore-btn">
            Start Exploring →
          </Link>
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