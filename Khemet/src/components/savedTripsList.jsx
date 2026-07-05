import { useAuth } from "../context/AuthContext";
import "../css/SavedTrips.css";
import {
  FiEye,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";
import { PiTicketBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TripDetailsModal from "../components/TripDetailsModal";

function SavedTripsList({
  trips,
  onDelete,
  previewMode = false,
}){
   const {
  deleteTrip,
} = useAuth();

    const navigate = useNavigate();
    const [selectedTrip, setSelectedTrip] = useState(null);


  return (
    <div className="saved-grid">

      {trips.map((trip, index) => (

        <div
          key={index}
          className="trip-card"
        >

          <div className="trip-cover">

            <img
              src={trip.itinerary?.[0]?.[0]?.coverImage}
              alt={trip.name}
            />

            <span className="saved-badge">
              {trip.itinerary.length} Days
            </span>
             
            <div className="overlay">

            <h3>{trip.name}</h3>

            <p>
              {trip.itinerary.reduce(
                (sum, day) => sum + day.length,
                0
              )} Places
            </p>

          </div>

          </div>


          <button className="book-btn">
                  <PiTicketBold />
                  Book this trip
                </button>

          

          <div className="card-footer">

            <button className="edit-btn" onClick={() =>
                navigate("/trip-plan", {
                state: { trip },
                })
            }>
                    <FiEdit2 />
                    Edit
                  </button>

                  <div className="footer-icons">

                    <button
                        onClick={() => setSelectedTrip(trip)}
                        >
                        <FiEye />
                        </button>

                    <button
                      className="delete"
                      onClick={() =>
                        onDelete(index)
                      }
                    >
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
                alert("Booking page coming soon ✈️");
                }}
            />
            )}

      

    </div>
  );
}

export default SavedTripsList;