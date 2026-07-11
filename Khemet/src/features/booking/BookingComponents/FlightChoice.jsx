import { useState } from "react";
import Toast from "../Toast";

function FlightChoice({
  booking,
  setBooking,
  nextStep,
  openFlightForm,
}) {

  const [choice, setChoice] = useState(null);
  const [toast, setToast] = useState({
  visible: false,
  message: "",
  type: "error",
});

const showToast = (message, type = "error") => {
  setToast({
    visible: true,
    message,
    type,
  });

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  }, 2500);
};

  const handleContinue = () => {

   if (choice === null) {
  showToast("Please choose a flight option first.");
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
    <>

    <div className="booking-card">

      <h2>
        Do you need a flight?
      </h2>

      <p>
        Choose whether you'd like us to arrange
        your flight or continue using your own
        reservation.
      </p>

      <div className="choice-container">

        <div
          className={`choice-box ${
            choice === true
              ? "selected"
              : ""
          }`}
          onClick={() => setChoice(true)}
        >

          <input
            type="radio"
            checked={choice === true}
            readOnly
          />

          <div>

            <h3>
              ✈ Book Flight
            </h3>

            <p>
              Choose from EgyptAir,
              Emirates, Qatar Airways
              and Turkish Airlines.
            </p>

          </div>

        </div>

        <div
          className={`choice-box ${
            choice === false
              ? "selected"
              : ""
          }`}
          onClick={() => setChoice(false)}
        >

          <input
            type="radio"
            checked={choice === false}
            readOnly
          />

          <div>

            <h3>
              🎫 I already have one
            </h3>

            <p>
              Skip this step and continue
              to planning your trip.
            </p>

          </div>

        </div>

      </div>

      <div className="booking-buttons">
                <button
          className="back-btn"
          onClick={() => window.history.back()}
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
    <Toast
    visible={toast.visible}
    message={toast.message}
    type={toast.type}
  />
  </>

  );
}

export default FlightChoice;