import { useAuth } from "../context/AuthContext";
import "../css/SavedTrips.css";
import { FiCopy, FiTrash2, FiEdit2 } from "react-icons/fi";
import { PiTicketBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function SavedTripsList() {
  const {
    savedTrips,
    duplicateTrip,
    deleteTrip,
  } = useAuth();
    const navigate = useNavigate();
    

  return (
    <div className="saved-grid">

      {savedTrips.map((trip, index) => (

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

      ))}

    </div>
  );
}

export default SavedTripsList;