import { useAuth } from "../context/AuthContext";
import "../css/SavedTrips.css";
import { FiCopy, FiTrash2, FiEdit2 } from "react-icons/fi";
import { PiTicketBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function SavedTrips() {
  const navigate = useNavigate();
  const {
    savedTrips,
    duplicateTrip,
    deleteTrip,
  } = useAuth();

  return (
    <section className="saved-page">

      <div className="saved-header">

        <span className="saved-step">
          MY TRIPS
        </span>

        <h1>Saved Trips</h1>

        <p>
          All your personalized itineraries are stored here.
          Duplicate, edit or book them anytime.
        </p>

      </div>

      {savedTrips.length === 0 ? (

        <div className="saved-empty">

          <div className="empty-icon">
            🧳
          </div>

          <h2>No Saved Trips</h2>

          <p>
            Save a generated itinerary and it will appear here.
          </p>

        </div>

      ) : (

        <div className="saved-grid">

          {savedTrips.map((trip, index) => {

            const totalPlaces =
              trip.itinerary.reduce(
                (sum, day) => sum + day.length,
                0
              );

            return (

              <div
                className="trip-card"
                key={index}
              >

                <div className="trip-cover">

                  <img
                    src={trip.itinerary?.[0]?.[0]?.coverImage}
                    alt={trip.name}
                  />

                  <span className="ai-badge">
                    AI
                  </span>

                  <div className="overlay">

                    <h3>{trip.name}</h3>

                    <p>
                      {trip.itinerary.length} Days • {totalPlaces} Stops
                    </p>

                  </div>

                </div>

                <button className="book-btn">
                  <PiTicketBold />
                  Book this trip
                </button>

                <div className="card-footer">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate("/trip-plan", {
                        state: { trip },
                      })
                    }
                  >
                    ✏ Edit
                  </button>

                  <div className="footer-icons">

                    <button
                      onClick={() =>
                        duplicateTrip(index)
                      }
                    >
                      <FiCopy />
                    </button>

                    <button
                      className="delete"
                      onClick={() =>
                        deleteTrip(index)
                      }
                    >
                      <FiTrash2 />
                    </button>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </section>
  );
}