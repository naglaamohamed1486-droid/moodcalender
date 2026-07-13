import { useAuth } from "../../app/providers/AuthContext";
import SavedTripsList from "../../shared/components/savedTripsList";
import "../../shared/components/SavedTrips.css";
import useScrollToTop from "../../shared/utils/UseScrollToTop";
import { Link } from "react-router-dom";
export default function SavedTrips() {
  useScrollToTop();
  const { savedTrips, deleteTrip } = useAuth();
  

  return (
      <section className="saved-page">
        <div className="saved-header">
        <div className="title-area">
          <span className="saved-step">MY COLLECTION</span>
          <h1>Saved Trips</h1>
        </div>

        <Link to="/trip-planner" className="new-trip-btn">
          + Create New Trip
        </Link>
      </div>

      {savedTrips.length === 0 ? (
        <div className="saved-empty">
          <div className="empty-icon">🧳</div>

          <h2>No Saved Trips Yet</h2>

          <p>Start planning your next adventure and save it here.</p>
        </div>
      ) : (
        <SavedTripsList trips={savedTrips} onDelete={deleteTrip} />
      )}
    </section>
  );
}
