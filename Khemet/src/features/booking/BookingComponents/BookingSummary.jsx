import { useMemo, useState } from "react";

function BookingSummary({
  booking,
  setBooking,
  prevStep,
}) {

  const [paymentMethod, setPaymentMethod] =
    useState("Credit Card");

  const [confirmed, setConfirmed] =
    useState(false);

  const bookingNumber = useMemo(() => {
    return (
      "KH-" +
      Math.floor(
        100000 + Math.random() * 900000
      )
    );
  }, []);

  const totalAttractions =
    booking.plan?.itinerary?.reduce(
      (sum, day) =>
        sum + (day.places?.length || 0),
      0
    ) || 0;

  const tripPrice =
    booking.tripPrice || 450;

  const flightPrice =
    booking.flight?.price || 0;

  const reservationPrice =
    booking.reservationPrice || 120;

  const total =
    tripPrice +
    flightPrice +
    reservationPrice;

  const confirmBooking = () => {

    setBooking((prev) => ({
      ...prev,
      totalPrice: total,
      paymentStatus: "Confirmed",
      paymentMethod,
      bookingNumber,
    }));

    setConfirmed(true);
  };
console.log(booking);
console.log(booking.flight);
console.log(booking.reservations);
  if (confirmed) {
    return (

      <div className="booking-card">

        <div className="booking-success">

          <div className="success-icon">
            ✓
          </div>

          <h2>
            Booking Confirmed!
          </h2>

          <p>

            Your reservation has been
            successfully confirmed.

          </p>

          <div className="summary-box">

            <p>

              <strong>
                Booking ID:
              </strong>

              {" "}
              {bookingNumber}

            </p>

            <p>

              <strong>
                Payment Status:
              </strong>

              {" "}
              Confirmed

            </p>

            <p>

              A confirmation email
              will be sent shortly.

            </p>

          </div>

        </div>

      </div>

    );
  }

  return (

    <div className="booking-card">

      <h2>
        Booking Summary
      </h2>

      <p>

        Review every part of your
        reservation before confirming.

      </p>

      {/* ================= TRIP ================= */}

        <div className="summary-section">

          <h3>Trip Information</h3>

          <div className="summary-box">

            <h4>
              {booking.plan.name}
            </h4>

            <p>

              📅 {booking.plan.itinerary.length}
              {" "}
              Days

            </p>

            <p>

              🗓️ {booking.startDate || "--"}
              {" "}
              →
              {" "}
              {booking.endDate || "--"}

            </p>

            <p>

              📍
              {" "}
              {totalAttractions}
              {" "}
              Attractions

            </p>

            <p>

              🚩
              {" "}
              {booking.plan.itinerary.length}
              {" "}
              Planned Days

            </p>

          </div>

        </div>



        {/* ================= FLIGHT ================= */}

        <div className="summary-section">

        <h3>

        Flight Information

        </h3>

        {booking.flight ? (

        <div className="summary-box">

        <p>

        <strong>

        ✈ Airline

        </strong>

        {" : "}

        {booking.flight.airline}

        </p>

        <p>

        <strong>

        Route

        </strong>

        {" : "}

        {booking.flight.departure}

        →

        {booking.flight.arrival}

        </p>

        <p>

        <strong>

        Class

        </strong>

        {" : "}

        {booking.flight.class}

        </p>

        <p>

        <strong>

        Passengers

        </strong>

        {" : "}

        {booking.flight.travelers}

        </p>

        <p>

        <strong>

        Price

        </strong>

        {" : "}

        ${booking.flight.price}

        </p>

        </div>

        ) : (

        <div className="summary-box">

        No Flight Selected

        </div>

        )}

        </div>



        {/* ================= RESERVATIONS ================= */}

        <div className="summary-section">

        <h3>

        Reservations

        </h3>

        {booking.reservations.length > 0 ? (

        booking.reservations.map((reservation,index)=>(

        <div
        key={index}
        className="summary-reservation"
        >

        <h4>

        Day {reservation.dayIndex + 1}

        </h4>

        <p>

        🚗 Transportation

        {" : "}

        {reservation.transportation|| "Not Selected"}

        </p>

        <p>

        🍽 Restaurant

        {" : "}

        {reservation.restaurant?.name || "None"}

        </p>

        <p>

        🎫 Attraction

        {" : "}

        {reservation.ticket ? "Booked" : "Not Booked"}

        </p>

        </div>

        ))

        ) : (

        <div className="summary-box">

        No reservations selected yet.

        </div>

        )}
        {/* ================= PRICE BREAKDOWN ================= */}

        <div className="summary-section">

          <h3>Price Breakdown</h3>

          <div className="summary-box">

            <div className="price-row">

              <span>Trip Package</span>

              <span>${tripPrice}</span>

            </div>

            <div className="price-row">

              <span>Flight</span>

              <span>${flightPrice}</span>

            </div>

            <div className="price-row">

              <span>Reservations</span>

              <span>${reservationPrice}</span>

            </div>

            <hr />

            <div className="price-row total-row">

              <strong>Total</strong>

              <strong>${total}</strong>

            </div>

          </div>

        </div>



        {/* ================= PAYMENT ================= */}

        <div className="summary-section">

          <h3>Payment Method</h3>

          <div className="summary-box">

            <select

              className="payment-select"

              value={paymentMethod}

              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }

            >

              <option>
                Credit Card
              </option>

              <option>
                Visa
              </option>

              <option>
                Mastercard
              </option>

              <option>
                PayPal
              </option>

              <option>
                Cash on Arrival
              </option>

            </select>

          </div>

        </div>



        {/* ================= BOOKING INFO ================= */}

        <div className="summary-section">

          <h3>Booking Details</h3>

          <div className="summary-box">

            <p>

              <strong>Booking ID:</strong>

              {" "}

              {bookingNumber}

            </p>

            <p>

              <strong>Status:</strong>

              {" "}

              <span className="status pending">

                Pending

              </span>

            </p>

          </div>

        </div>



        {/* ================= CANCELLATION ================= */}

        <div className="summary-section">

          <h3>Cancellation Policy</h3>

          <div className="policy-box">

            ✅ Free cancellation up to
            <strong> 48 hours </strong>
            before your trip.

            <br /><br />

            After that, a
            <strong> 30% cancellation fee </strong>
            will apply.

          </div>

        </div>



        {/* ================= ACTIONS ================= */}

        <div className="summary-actions">

          <button

            className="summary-back"

            onClick={prevStep}

          >

            ← Back

          </button>

          <button

            className="summary-confirm"

            onClick={confirmBooking}

          >

            Confirm Booking

          </button>

        </div>

        </div>
        </div>

);
}


export default BookingSummary;