import places from "../../../places.json";
import { useAuth } from "../../../app/providers/AuthContext";
import { useState } from "react";
import { savePlan } from "../../booking/BookingComponents/bookingDB";
import { useNavigate } from "react-router-dom";

function TripOrganizer({
  trip,
  setTrip,
  closeTrip,
  duplicateTrip,
  deleteTrip,
}) {
  // ===========================
  // Add New Day
  // ===========================

  const navigate = useNavigate();

  const [showBookingPopup, setShowBookingPopup] = useState(false);

  const { saveTrip } = useAuth();
  const [savedMessage, setSavedMessage] = useState(false);

  const addDay = () => {
    setTrip({
      ...trip,
      itinerary: [...trip.itinerary, []],
    });
  };

  // ===========================
  // Delete Day
  // ===========================

  const deleteDay = (dayIndex) => {
    const updated = trip.itinerary.filter((_, index) => index !== dayIndex);

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };
  // ===========================
  // Add Place
  // ===========================

  const addPlace = (dayIndex, placeId) => {
    if (!placeId) return;

    const place = places.find((p) => String(p.id) === placeId);

    if (!place) return;

    const updated = [...trip.itinerary];

    updated[dayIndex].push(place);

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  // ===========================
  // Remove Place
  // ===========================

  const removePlace = (dayIndex, placeIndex) => {
    const updated = [...trip.itinerary];

    updated[dayIndex].splice(placeIndex, 1);

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  // ===========================
  // Move Up
  // ===========================

  const moveUp = (dayIndex, placeIndex) => {
    if (placeIndex === 0) return;

    const updated = [...trip.itinerary];

    [updated[dayIndex][placeIndex - 1], updated[dayIndex][placeIndex]] = [
      updated[dayIndex][placeIndex],
      updated[dayIndex][placeIndex - 1],
    ];

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  // ===========================
  // Move Down
  // ===========================

  const moveDown = (dayIndex, placeIndex) => {
    const updated = [...trip.itinerary];

    if (placeIndex === updated[dayIndex].length - 1) return;

    [updated[dayIndex][placeIndex + 1], updated[dayIndex][placeIndex]] = [
      updated[dayIndex][placeIndex],
      updated[dayIndex][placeIndex + 1],
    ];

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };
  const moveDayUp = (dayIndex) => {
    if (dayIndex === 0) return;

    const updated = [...trip.itinerary];

    [updated[dayIndex - 1], updated[dayIndex]] = [
      updated[dayIndex],
      updated[dayIndex - 1],
    ];

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  const moveDayDown = (dayIndex) => {
    if (dayIndex === trip.itinerary.length - 1) return;

    const updated = [...trip.itinerary];

    [updated[dayIndex + 1], updated[dayIndex]] = [
      updated[dayIndex],
      updated[dayIndex + 1],
    ];

    setTrip({
      ...trip,
      itinerary: updated,
    });
  };

  return (
    <section className="organizer-section">
      <div className="generator-card">
        <div className="organizer-header">
          <div className="organizer-header-top">
            <div>
              <div className="plans-step">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#C9A84C"
                    strokeWidth="2"
                  />

                  <path
                    d="M15.5 8.5L13.5 13.5L8.5 15.5L10.5 10.5L15.5 8.5Z"
                    fill="#C9A84C"
                  />
                </svg>

                <span>STEP 3 — ORGANIZE</span>
              </div>

              <h2>Trip Organizer</h2>

              <p>
                Rearrange places, add destinations and personalize your trip.
              </p>
            </div>

            {/* <button
            className="close-organizer"
            onClick={closeTrip}
            >
            ✕ Close
        </button> */}
          </div>
        </div>
        {/* <div className="generator-top">
          <h2>{trip.name}</h2>
        </div> */}
        <div className="generator-middle">
          <div className="editing-info">
            <span className="editing-label">EDITING TRIP</span>

            <h3>{trip.name}</h3>

            <p>{trip.itinerary.length} days</p>
          </div>

          <div className="editing-actions">
            {/* <button
                        className="secondary-btn"
                        onClick={duplicateTrip}
                    >
                        📄 Duplicate
                    </button> */}

            {/* <button
                        className="danger-btn"
                        onClick={deleteTrip}
                    >
                        🗑 Delete
                    </button> */}

            <button className="secondary-btn" onClick={closeTrip}>
              ✕ Close
            </button>
          </div>
        </div>

        <div className="generator-body">
          <div className="organizer-days">
            {trip.itinerary.map((day, dayIndex) => {
            const currentCity = day.length > 0 ? day[0].city : null;

            const availablePlaces = places.filter((place) => {
              // لو اليوم فيه أماكن، اعرض نفس المحافظة فقط
              if (currentCity && place.city !== currentCity) return false;

              // امنع تكرار نفس المكان في نفس اليوم
              return !day.some((p) => p.id === place.id);
            });

            return (
              
              <div className="organizer-day" key={dayIndex}>
                {/* HEADER */}

                <div className="day-toolbar">
                  <div className="day-info">
                    <span className="day-circle">{dayIndex + 1}</span>

                    <div>
                      <div className="day-title">Day {dayIndex + 1}</div>

                      <span className="places-count">{day.length} places</span>
                    </div>
                  </div>

                  <div className="day-actions">
                    <button
                      className="icon-btn"
                      onClick={() => moveDayUp(dayIndex)}
                      title="Move day up"
                    >
                      ⬆
                    </button>

                    <button
                      className="icon-btn"
                      onClick={() => moveDayDown(dayIndex)}
                      title="Move day down"
                    >
                      ⬇
                    </button>
                    <select
                      defaultValue=""
                      onChange={(e) => addPlace(dayIndex, e.target.value)}
                    >
                      <option value="">Add a place...</option>

                      {availablePlaces.map((place) => (
                        <option key={place.id} value={place.id}>
                          {place.title}
                        </option>
                      ))}
                    </select>

                    <button
                      className="icon-btn delete"
                      onClick={() => deleteDay(dayIndex)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* PLACES */}

                <div className="organizer-places">
                  {day.map((place, placeIndex) => (
                    <div
                      className="organizer-place"
                      key={place.id + "-" + placeIndex}
                    >
                      <div className="move-buttons">
                        <button
                          className="icon-btn"
                          onClick={() => moveUp(dayIndex, placeIndex)}
                        >
                          ▲
                        </button>

                        <button
                          className="icon-btn"
                          onClick={() => moveDown(dayIndex, placeIndex)}
                        >
                          ▼
                        </button>
                      </div>

                      <img src={place.coverImage} alt={place.title} />

                      <div className="place-details">
                        <h4>{place.title}</h4>

                        <p>
                          {place.city}
                          {" • "}
                          {place.tags?.[0]}
                        </p>
                      </div>

                      <button
                        className="icon-btn delete"
                        onClick={() => removePlace(dayIndex, placeIndex)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
                        );
          })}
          </div>

          {/* FOOTER */}

          <button className="add-day-btn" onClick={addDay}>
            + Add another day
          </button>

          <div className="organizer-footer">
            <button
              className="save-trip-btn"
              onClick={async () => {
                try {
                  await savePlan(trip);

                  saveTrip(trip);

                  setSavedMessage(true);
                  setTimeout(() => {
                    setSavedMessage(false);
                  }, 1500);

                  setShowBookingPopup(true);

                  setShowBookingPopup(true); // <-- دي أهم سطر
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              Save Trip
            </button>
            {savedMessage && (
              <div className="saved-message">
                ✓ Trip saved to your Saved Trips!
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookingPopup && (
        <div className="booking-popup-overlay">
          <div className="booking-popup">
            <h2>Trip Saved Successfully!</h2>

            <p>Would you like to continue with booking?</p>

            <div className="popup-buttons">
              <button
                onClick={() => {
                    setShowBookingPopup(false);
                    closeTrip();
                  }}
              >
                Not Now
              </button>

              <button
                onClick={() => {
                  setShowBookingPopup(false);
                  closeTrip();

                  navigate("/booking", {
                    state: {
                      plan: trip,
                    },
                  });
                }}
              >
                Continue Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TripOrganizer;
