import { useState } from "react";
import { useLocation } from "react-router-dom";

import BookingStepper from "../components/booking/BookingStepper";
import FlightChoice from "../components/booking/FlightChoice";
import FlightForm from "../components/booking/FlightForm";
import TripPlanning from "../components/booking/TripPlanning";
import Reservations from "../components/booking/Reservations";
import BookingSummary from "../components/booking/BookingSummary";

import "../css/Booking.css";

function Booking() {
  const location = useLocation();

  const selectedPlan = location.state?.plan;
  console.log(selectedPlan);

  const [step, setStep] = useState(1);
  const [showFlightForm, setShowFlightForm] = useState(false);

  const [booking, setBooking] = useState({
    plan: selectedPlan,
    flight: null,
    startDate: "",
    endDate: "",
    reservations: [],
    totalPrice: 0,
    paymentStatus: "Pending",
  });

  if (!selectedPlan) {
    return (
      <div className="booking-page">
        <h2>No plan selected.</h2>
      </div>
    );
  }

  return (
    <div className="booking-page">

      <div className="booking-header">
        <small>BOOKING</small>

        <h1>Plan & Reserve Your Trip</h1>

        <p>
          Complete your booking in a few simple steps.
        </p>
      </div>

      <BookingStepper step={step} />

      <div className="booking-content">

        {/* STEP 1 */}

        {step === 1 && !showFlightForm && (
          <FlightChoice
            booking={booking}
            setBooking={setBooking}
            nextStep={() => setStep(2)}
            openFlightForm={() => setShowFlightForm(true)}
          />
        )}

        {/* FLIGHT FORM */}

        {step === 1 && showFlightForm && (
          <FlightForm
            booking={booking}
            setBooking={setBooking}
            nextStep={() => {
              setShowFlightForm(false);
              setStep(2);
            }}
            back={() => setShowFlightForm(false)}
          />
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <TripPlanning
            booking={booking}
            setBooking={setBooking}
            nextStep={() => setStep(3)}
            prevStep={() => {
              if (booking.flight) {
                setShowFlightForm(true);
              }
              setStep(1);
            }}
          />
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <Reservations
            booking={booking}
            setBooking={setBooking}
            nextStep={() => setStep(4)}
            prevStep={() => setStep(2)}
          />
        )}

        {/* STEP 4 */}

        {step === 4 && (
          <BookingSummary
            booking={booking}
            setBooking={setBooking}
            prevStep={() => setStep(3)}
          />
        )}

      </div>

    </div>
  );
}

export default Booking;