import { useAuth } from "../../app/providers/AuthContext";
import "./SavedTrips.css";
import { FiEye, FiTrash2, FiEdit2 } from "react-icons/fi";
import { PiTicketBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TripDetailsModal from "../../features/trip-generator/generatorComponents/TripDetailsModal";

function SavedTripsList({ trips, onDelete, previewMode = false }) {
  const { deleteTrip } = useAuth();

  const navigate = useNavigate();
  const [selectedTrip, setSelectedTrip] = useState(null);

  return (
    <div className="saved-grid">
      {trips.map((trip, index) => (
        <div key={index} className="trip-card">
          <div className="trip-cover">
            <img src={trip.itinerary?.[0]?.[0]?.coverImage} alt={trip.title} />

            <span className="saved-badge">{trip.itinerary.length} Days</span>

            <div className="overlay">
              <h3 className="title">{trip.title}</h3>

              <p>
                {trip.itinerary.reduce((sum, day) => sum + day.length, 0)}{" "}
                Places
              </p>
            </div>
          </div>

          <button
            className="book-btn"
            onClick={() =>
              navigate("/booking", {
                state: {
                  plan: trip,
                },
              })
            }
          >
            <PiTicketBold />
            Book This Trip
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
              <FiEdit2 />
              Edit
            </button>

            <div className="footer-icons">
              <button onClick={() => setSelectedTrip(trip)}>
                <FiEye />
              </button>

              <button className="delete" onClick={() => onDelete(index)}>
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      ))}
      {selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onEdit={() => {
            navigate("/trip-plan", {
              state: { trip: selectedTrip },
            });
          }}
          onBook={() => {
            navigate("/booking", {
              state: {
                plan: selectedTrip,
              },
            });
          }}
        />
      )}
    </div>
  );
}

export default SavedTripsList;
