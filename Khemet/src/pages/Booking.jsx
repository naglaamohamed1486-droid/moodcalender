import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import BookingStepper from "../components/booking/BookingStepper";
import FlightChoice from "../components/booking/FlightChoice";
import FlightForm from "../components/booking/FlightForm";
import TripPlanning from "../components/booking/TripPlanning";
import Reservations from "../components/booking/Reservations";
import BookingSummary from "../components/booking/BookingSummary";
import LinkedPlanCard from "../components/booking/LinkedPlanCard";
import LiveTotal from "../components/booking/LiveTotal";

import "../css/Booking.css";

function Booking() {
  const location = useLocation();

  const selectedPlan = location.state?.plan;

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
        <div className="booking-card">
          <h2>No plan selected</h2>
          <p>Please go back and choose a plan first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">

      {/* ================= HERO ================= */}

      <section className="booking-hero">

        <div className="booking-hero-eyebrow">
          KHEMET BOOKING
        </div>

        <h1 className="booking-hero-title">
          Plan & Book Your Journey
        </h1>

        <p className="booking-hero-subtitle">
          Complete your booking in four easy steps.
          Book flights, organize your itinerary,
          reserve attractions and review everything
          before confirming.
        </p>

      </section>

      {/* ================= STEPPER ================= */}

      <BookingStepper step={step} />

      {/* ================= LINKED PLAN ================= */}

      <LinkedPlanCard plan={selectedPlan} />

      {/* ================= CONTENT ================= */}

      <div className="booking-layout">

        <div className="booking-content">

          {/* STEP 1 */}

          {step === 1 && !showFlightForm && (
            <FlightChoice
              booking={booking}
              setBooking={setBooking}
              nextStep={() => setStep(2)}
              openFlightForm={() =>
                setShowFlightForm(true)
              }
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
              back={() =>
                setShowFlightForm(false)
              }
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

        {/* ================= SIDEBAR ================= */}

        <aside>

          <LiveTotal booking={booking} />

        </aside>

      </div>

      {/* Decorative Bottom Section */}

      <section
        style={{
          marginTop: "50px",
          textAlign: "center",
          color: "#8a7a5c",
        }}
      >
        <p>
          ✨ Every booking is securely stored and can
          be managed later from your reservations.
        </p>
      </section>

    </div>
  );
}

export default Booking;