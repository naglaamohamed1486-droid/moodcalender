import { useState } from "react";

function TripPlanning({
  booking,
  setBooking,
  nextStep,
  prevStep,
}) {
  const [startDate, setStartDate] = useState(
    booking.startDate || ""
  );

  const itinerary = booking.plan.itinerary.map((day, index) => {
    if (Array.isArray(day)) {
      return {
        day: index + 1,
        places: day,
      };
    }

    return day;
  });

  const handleContinue = () => {
    if (!startDate) {
      alert("Please choose a start date.");
      return;
    }

    if (startDate < today) {
      alert("Trip start date cannot be in the past.");
      return;
    }

    const updatedItinerary = itinerary.map(
      (day, index) => {
        const date = new Date(startDate);

        date.setDate(date.getDate() + index);

        return {
          ...day,
          date: date.toISOString().split("T")[0],
        };
      }
    );

    const end = new Date(startDate);

    end.setDate(
      end.getDate() + updatedItinerary.length - 1
    );

    setBooking({
      ...booking,
      startDate,
      endDate: end.toISOString().split("T")[0],
      plan: {
        ...booking.plan,
        itinerary: updatedItinerary,
      },
    });

    nextStep();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-card">

      <h2>Trip Schedule</h2>

      <p>
        Choose when your journey begins.
        Your itinerary dates will be generated
        automatically.
      </p>

      <div className="flight-grid">

        <div>
          <label>Trip Start Date</label>

          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />
        </div>

        <div>
          <label>Duration</label>

          <input
            disabled
            value={`${itinerary.length} Days`}
          />
        </div>

      </div>

      <div className="trip-preview">

        {itinerary.map((day, index) => {

          let date = "";

          if (startDate) {
            const d = new Date(startDate);

            d.setDate(d.getDate() + index);

            date = d.toLocaleDateString();
          }

          return (

            <div
              key={index}
              className="trip-day"
            >

              <h3>
                Day {day.day}
              </h3>

              {date && (
                <small>{date}</small>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "18px",
                }}
              >

                {day.places.map((place) => (
  <div
    key={place.id}
    style={{
      display: "flex",
      flexDirection: "column",
      padding: "14px",
      borderRadius: "12px",
      background: "#fbf2df",
      border: "1px solid #e9dcbc",
    }}
  >

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="#C9A84C"
        style={{ flexShrink: 0 }}
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
      </svg>

      <strong>
        {place.title}
      </strong>
    </div>

    <div
      style={{
        color: "#8a7a5c",
        fontSize: "14px",
        marginTop: "4px",
        marginLeft: "26px",
      }}
    >
      {place.category || "Destination"}
    </div>

  </div>
))}
                              </div>

            </div>

          );

        })}

      </div>

      <div className="booking-buttons">

        <button
          className="back-btn"
          onClick={prevStep}
        >
          ← Back
        </button>

        <button
          className="next-btn"
          onClick={handleContinue}
        >
          Continue →
        </button>

      </div>

    </div>
  );
}

export default TripPlanning;