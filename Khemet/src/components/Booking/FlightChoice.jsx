import { useState } from "react";

function FlightChoice({
  booking,
  setBooking,
  nextStep,
  openFlightForm,
}) {
  const [choice, setChoice] = useState(null);

  const handleContinue = () => {
    if (choice === null) {
      alert("Please choose an option.");
      return;
    }

    if (choice) {
      setBooking({
        ...booking,
        needFlight: true,
      });

      openFlightForm();
    } else {
      setBooking({
        ...booking,
        needFlight: false,
        flight: null,
      });

      nextStep();
    }
  };

  return (
    <div className="booking-card">

      <h2>Do you need a flight?</h2>

      <p>
        Choose whether you'd like us to book your flight.
      </p>

      <div className="choice-container">

        <div
          className={`choice-box ${
            choice === true ? "selected" : ""
          }`}
          onClick={() => setChoice(true)}
        >
          <input
            type="radio"
            checked={choice === true}
            readOnly
          />

          <div>
            <h3>Book Flight</h3>

            <p>
              EgyptAir • Emirates • Qatar • Turkish
            </p>
          </div>
        </div>

        <div
          className={`choice-box ${
            choice === false ? "selected" : ""
          }`}
          onClick={() => setChoice(false)}
        >
          <input
            type="radio"
            checked={choice === false}
            readOnly
          />

          <div>
            <h3>Skip</h3>

            <p>I already have a flight.</p>
          </div>
        </div>

      </div>

      <div className="booking-buttons">

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

export default FlightChoice;