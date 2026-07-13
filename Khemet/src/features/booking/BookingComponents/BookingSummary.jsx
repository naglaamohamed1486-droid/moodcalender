import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../../../shared/components/Toast";

import {
  FaPlaneDeparture,
  FaLocationDot,
  FaCalendarDays,
  FaUsers,
  FaRoute,
  FaHotel,
  FaUtensils,
  FaTicket,
  FaCreditCard,
  FaMoneyBillWave,
  FaShieldHalved,
  FaCircleCheck,
  FaCircleXmark,
  FaFileInvoice,
  FaRegCircleCheck,
  FaPhoneVolume,
  FaEnvelope,
} from "react-icons/fa6";

function BookingSummary({
  booking,
  setBooking,
  prevStep,
}) {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState("Credit Card");

  const [cardName, setCardName] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCVV] =
    useState("");

  const [country, setCountry] =
    useState("Egypt");

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [confirmed, setConfirmed] =
    useState(false);

  const [toast, setToast] = useState({
  visible: false,
  message: "",
  type: "success",
});

const showToast = (message, type = "success") => {
  setToast({
    visible: true,
    message,
    type,
  });

  setTimeout(() => {
    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  }, 3000);
};  

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
        sum +
        (day.places?.length || 0),

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

    if (
      paymentMethod !== "Cash on Arrival" &&
      (
        !cardName ||
        !cardNumber ||
        !expiry ||
        !cvv
      )
    ) {

      showToast(
  "Please complete your payment information.",
  "error"
);

return;
      

    }

    if (!acceptedTerms) {

      showToast(
  "Please accept the booking terms.",
  "error"
);

return;

    }

    setBooking(prev => ({

      ...prev,

      paymentStatus: "Confirmed",

      paymentMethod,

      bookingNumber,

      totalPrice: total,

    }));

    setConfirmed(true);

    showToast(
  "Booking confirmed successfully!",
  "success"
);

  };

  if (confirmed) {

    return (

      <div className="booking-card">

        <div className="booking-success">

          <div>

    <span className="papyrus-title">
        KHEMET
    </span>

    <span className="papyrus-subtitle">
        Official Travel Seal
    </span>

    <div className="papyrus-divider"></div>

    <div className="papyrus-approved">
        <FaCircleCheck />
        Journey Approved
    </div>

</div>

          <p>

            Your journey has been successfully booked.

          </p>

          <div className="summary-box">

            <div className="info-row">

              <span>

                Booking Number

              </span>

              <strong>

                {bookingNumber}

              </strong>

            </div>

            <div className="info-row">

              <span>

                Payment

              </span>

              <strong className="success">

                Confirmed

              </strong>

            </div>

            <div className="info-row">

              <span>

                Total Paid 

              </span>

              <strong>

                ${total}

              </strong>

            </div>

          </div>

          <div className="confirmation-extra">

            <FaEnvelope />

            Confirmation has been sent to your email.

          </div>

          <div className="confirmation-actions">

            

            <button
              className="summary-secondary"
              onClick={() => navigate("/Bookings")}
            >
              My Bookings
            </button>

            <button
              className="summary-back"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>

          </div>

        </div>


      </div>


    );

  }

  return (

    <div className="booking-summary">

      <h2>

        Booking Summary

      </h2>

      <p>

        Review every detail before completing your reservation.

      </p>

      <div className="summary-progress">

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: "100%",
            }}
          />

        </div>

        {/* <span>

          Booking Completion

        </span> */}

      </div>

      {/* ===================== */}

      {/* TRIP INFORMATION */}

      {/* ===================== */}

      <div className="summary-section">

        <h3>

          Trip Overview

        </h3>

        <div className="summary-box">

          <div className="info-row">

            <span>

              <FaLocationDot />

              Destination

            </span>

            <strong>

              {booking.flight?.arrival?.city}

            </strong>

          </div>

          <div className="info-row">

            <span>

              <FaCalendarDays />

              Duration

            </span>

            <strong>

              {booking.plan.itinerary.length}
              {" "}
              Days

            </strong>

          </div>

          <div className="info-row">

            <span>

              <FaCalendarDays />

              Travel Dates

            </span>

            <strong>

              {booking.startDate || "--"}

              {" → "}

              {booking.endDate || "--"}

            </strong>

          </div>

          <div className="info-row">

            <span>

              <FaLocationDot />

              Attractions

            </span>

            <strong>

              {totalAttractions}

            </strong>

          </div>

        </div>

      </div>

      {/* ===================== */}

      {/* FLIGHT */}

      {/* ===================== */}

      <div className="summary-section">

        <h3>

          Flight Details

        </h3>

        {booking.flight ? (

          <div className="summary-box">

            <div className="info-row">

              <span>

                <FaPlaneDeparture />

                Airline

              </span>

              <strong>

                {booking.flight.airline}

              </strong>

            </div>

            <div className="info-row">

              <span>
                <FaRoute />

                Route

              </span>

              <strong>

                {booking.flight.departure}

                {" → "}

                {booking.flight.arrival?.code}

              </strong>

            </div>

            <div className="info-row">

              <span>
                <FaTicket />

                Class

              </span>

              <strong>

                {booking.flight.class}

              </strong>

            </div>

            <div className="info-row">

              <span>

                <FaUsers />

                Travelers

              </span>

              <strong>

                {booking.flight.travelers}

              </strong>

            </div>

            <div className="info-row">

              <span>
                <FaMoneyBillWave />

                Price

              </span>

              <strong>

                ${booking.flight.price}

              </strong>

            </div>

          </div>

        ) : (

          <div className="summary-box">

            No Flight Selected

          </div>

        )}

      </div>

            {/* ===================== */}
      {/* RESERVATIONS */}
      {/* ===================== */}

      <div className="summary-section">

        <h3>

          Reservations

        </h3>

        {

          booking.plan.itinerary.map(

            (day, dayIndex) => {

              const dayReservations =

                booking.reservations.filter(

                  (reservation) =>

                    reservation.dayIndex === dayIndex

                );

              return (

                <div
                  key={dayIndex}
                  className="summary-day-card"
                >

                  <div className="summary-day-header">

                    <div className="summary-day-circle">

                      {dayIndex + 1}

                    </div>

                    <div>

                      <h4>

                        Day {dayIndex + 1}

                      </h4>

                      <small>

                        {day.places.length} Planned Stops

                      </small>

                    </div>

                  </div>

                  {

                    day.places.map(

                      (place, placeIndex) => {

                        const reservation =

                          dayReservations.find(

                            r =>

                              r.placeIndex === placeIndex

                          );

                        return (

                          <div

                            key={place.id}

                            className="summary-place-card"

                          >

                            <div className="summary-place-left">

                              <div>

                                <h5>

                                  {place.title}

                                </h5>

                                <small>

                                  {place.city}

                                </small>

                              </div>

                            </div>

                            <div className="summary-place-right">

                              <div className="reservation-item">

                                <FaPlaneDeparture />

                                <span>

                                  {

                                    reservation?.transportation ||

                                    "No Transportation"

                                  }

                                </span>

                              </div>

                              <div className="reservation-item">

                                <FaUtensils />

                                <span>

                                  {

                                    reservation?.restaurant?.name ||

                                    "No Restaurant"

                                  }

                                </span>

                              </div>

                              <div className="reservation-item">

                                <FaTicket />

                                <span>

                                  {

                                    reservation?.ticket

                                      ? "Ticket Reserved"

                                      : "No Ticket"

                                  }

                                </span>

                              </div>

                            </div>

                          </div>

                        );

                      }

                    )

                  }

                </div>

              );

            }

          )

        }

      </div>

      {/* ===================== */}
      {/* PRICE */}
      {/* ===================== */}

      <div className="summary-section">

        <h3>

          Price Breakdown

        </h3>

        <div className="summary-box">

          <div className="price-row">

            <span>

              Trip Package

            </span>

            <strong>

              ${tripPrice}

            </strong>

          </div>

          <div className="price-row">

            <span>

              Flight

            </span>

            <strong>

              ${flightPrice}

            </strong>

          </div>

          <div className="price-row">

            <span>

              Reservations

            </span>

            <strong>

              ${reservationPrice}

            </strong>

          </div>

          <hr />

          <div className="price-row total-row">

            <span>

              Total

            </span>

            <strong>

              ${total}

            </strong>

          </div>

        </div>

      </div>

      {/* ===================== */}
      {/* PAYMENT */}
      {/* ===================== */}

      <div className="summary-section">

        <h3>

          Payment

        </h3>

        <div className="payment-card">

          <div className="payment-top">

            <div>

              <FaShieldHalved />

              Secure Payment

            </div>

            <span>

              SSL Protected

            </span>

          </div>

          <div className="payment-methods">

            {

              [

                "Credit Card",

                "Visa",

                "Mastercard",

                "PayPal",

                "Cash on Arrival",

              ].map(

                method => (

                  <button

                    key={method}

                    type="button"

                    onClick={()=>

                      setPaymentMethod(method)

                    }

                    className={

                      paymentMethod===method

                      ?

                      "payment-option active"

                      :

                      "payment-option"

                    }

                  >

                    <FaCreditCard />

                    {method}

                  </button>

                )

              )

            }

          </div>

                    {

            paymentMethod !== "Cash on Arrival" && (
              <>

              <div className="credit-card-preview">

              <div className="card-top">
                <div>
                  <span className="brand-small">EXPLORE EGYPT</span>
                  <small>Debit / Credit</small>
                </div>

                <div className="card-brand">
                  {paymentMethod}
                </div>
              </div>

              <div className="card-number-preview">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>

              <div className="card-bottom">

                <div>
                  <small>Card holder</small>
                  <strong>
                    {cardName || "YOUR NAME"}
                  </strong>
                </div>

                <div>
                  <small>Expires</small>
                  <strong>
                    {expiry || "MM/YY"}
                  </strong>
                </div>

              </div>

            </div>

              <div className="payment-form">

                <div className="form-group">

                  <label>

                    Card Holder

                  </label>

                  <input

                    type="text"

                    value={cardName}

                    onChange={(e)=>

                      setCardName(

                        e.target.value

                      )

                    }

                    placeholder="John Smith"

                  />

                </div>

                <div className="form-group">

                  <label>

                    Card Number

                  </label>

                  <input

                    type="text"

                    maxLength={19}

                    value={cardNumber}

                    onChange={(e)=>

                      setCardNumber(

                        e.target.value

                      )

                    }

                    placeholder="1234 5678 9012 3456"

                  />

                </div>

                <div className="payment-grid">

                  <div className="form-group">

                    <label>

                      Expiry

                    </label>

                    <input

                      type="text"

                      value={expiry}

                      onChange={(e)=>

                        setExpiry(

                          e.target.value

                        )

                      }

                      placeholder="MM/YY"

                    />

                  </div>

                  <div className="form-group">

                    <label>

                      CVV

                    </label>

                    <input

                      type="password"

                      maxLength={4}

                      value={cvv}

                      onChange={(e)=>

                        setCVV(

                          e.target.value

                        )

                      }

                      placeholder="***"

                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>

                    Billing Country

                  </label>

                  <select

                    value={country}

                    onChange={(e)=>

                      setCountry(

                        e.target.value

                      )

                    }

                  >

                    <option>

                      Egypt

                    </option>

                    <option>

                      Saudi Arabia

                    </option>

                    <option>

                      UAE

                    </option>

                    <option>

                      Qatar

                    </option>

                    <option>

                      Kuwait

                    </option>

                  </select>

                </div>

              </div>
              </>

            )

          }

          <div className="payment-security">

            <FaShieldHalved />

            <span>

              Your payment is encrypted using
              256-bit SSL security.

            </span>

          </div>

        </div>

      </div>

      {/* ===================== */}
      {/* BOOKING DETAILS */}
      {/* ===================== */}

      <div className="summary-section">

        <h3>

          Booking Details

        </h3>

        <div className="summary-box">

          <div className="info-row">

            <span>

              Booking ID

            </span>

            <strong>

              {bookingNumber}

            </strong>

          </div>

          <div className="info-row">

            <span>

              Payment Status

            </span>

            <strong>

              Pending

            </strong>

          </div>

          <div className="info-row">

            <span>

              Payment Method

            </span>

            <strong>

              {paymentMethod}

            </strong>

          </div>

        </div>

      </div>

      {/* ===================== */}
      {/* POLICY */}
      {/* ===================== */}

      <div className="summary-section">

        <h3>

          Cancellation Policy

        </h3>

        <div className="policy-box">

          <p>

            Free cancellation up to
            <strong> 48 hours </strong>
            before departure.

          </p>

          <p>


            After that,
            <strong> 30% </strong>
            cancellation fees apply.

          </p>

        </div>

      </div>

      {/* ===================== */}
      {/* TERMS */}
      {/* ===================== */}

      <div className="terms-box">

        <label>

          <input

            type="checkbox"

            checked={acceptedTerms}

            onChange={(e)=>

              setAcceptedTerms(

                e.target.checked

              )

            }

          />

          I agree to the booking terms,
          cancellation policy and privacy policy.

        </label>

      </div>

      {/* ===================== */}
      {/* SUPPORT */}
      {/* ===================== */}

      <div className="summary-section">

        <h3>

          Need Help?

        </h3>

        <div className="summary-box">

          <div className="info-row">

            <span>

              <FaPhoneVolume />

              Hotline

            </span>

            <strong>

              +20 100 123 4567

            </strong>

          </div>

          <div className="info-row">

            <span>

              <FaEnvelope />

              Email

            </span>

            <strong>

              khemet2026@gmail.com

            </strong>

          </div>

        </div>

      </div>

      {/* ===================== */}
      {/* ACTIONS */}
      {/* ===================== */}

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

          <FaRegCircleCheck />

          Confirm Booking

        </button>

      </div>
      <Toast
  message={toast.message}
  visible={toast.visible}
  type={toast.type}
/>

    </div>

  );

}

export default BookingSummary;