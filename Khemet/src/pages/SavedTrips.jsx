import { useAuth } from "../context/AuthContext";
import SavedTripsList from "../components/savedTripsList";
import "../css/SavedTrips.css";
import useScrollToTop from "../components/UseScrollToTop";

export default function SavedTrips() {
   useScrollToTop();
  const { savedTrips,
    deleteTrip,
   } = useAuth();
   

  return (
    <section className="saved-page">

      <div className="saved-header">

        <span className="saved-step">
          MY COLLECTION
        </span>

        <h1>Saved Trips</h1>

        <p>
          Keep all your personalized itineraries in one place.
          Duplicate them, edit them later or remove them whenever you want.
        </p>

      </div>

      {savedTrips.length === 0 ? (

        <div className="saved-empty">

          <div className="empty-icon">
            🧳
          </div>

          <h2>No Saved Trips Yet</h2>

          <p>
            Start planning your next adventure and save it here.
          </p>

        </div>

      ) : (

        <SavedTripsList
          trips={savedTrips}
          onDelete={deleteTrip}
        />
      )}

    </section>
  );
}