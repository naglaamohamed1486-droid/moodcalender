import "./TripDetailsModal.css";
import { FiEdit2, FiX } from "react-icons/fi";
import { PiTicketBold } from "react-icons/pi";

function TripDetailsModal({ trip, onClose, onEdit, onBook }) {
  if (!trip) return null;

  const totalPlaces = trip.itinerary.reduce((sum, day) => sum + day.length, 0);

  return (
    <div className="details-overlay">
      <div className="details-modal">
        <button className="details-close" onClick={onClose}>
          <FiX />
        </button>

        {/* Hero Image */}

        <div className="details-cover">
          <img src={trip.itinerary?.[0]?.[0]?.coverImage} alt={trip.name} />

          <div className="details-cover-overlay">
            <span className="details-badge">{trip.itinerary.length} Days</span>

            <h2>{trip.name}</h2>

            <p>{totalPlaces} Places Included</p>
          </div>
        </div>

        {/* Timeline */}

        <div className="details-body">
          {trip.itinerary.map((day, index) => (
            <div key={index} className="details-day">
              <div className="details-day-header">
                <div className="day-number">{index + 1}</div>

                <h3>Day {index + 1}</h3>
              </div>

              <div className="details-places">
                {day.map((place) => (
                  <div key={place.id} className="details-place">
                    <img src={place.coverImage} alt={place.title} />

                    <div>
                      <h4>{place.title}</h4>

                      <p>{place.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="details-actions">
          <button className="details-edit" onClick={onEdit}>
            <FiEdit2 />
            Edit Trip
          </button>

          <button className="details-book" onClick={onBook}>
            <PiTicketBold />
            Book this Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripDetailsModal;
