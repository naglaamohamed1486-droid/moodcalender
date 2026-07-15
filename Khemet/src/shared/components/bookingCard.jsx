import { FiEye, FiTrash2 } from "react-icons/fi";
import { FaCalendarDays, FaCreditCard } from "react-icons/fa6";

function BookingCard({
  booking,
  onView,
  onCancel,
}) {
  const cover =
    booking.plan?.itinerary?.[0]?.places?.[0]?.coverImage;

  const tripName =
    booking.plan?.title ||
    booking.plan?.name ||
    "Untitled Trip";

  const days =
    booking.plan?.itinerary?.length || 0;

  const places =
    booking.plan?.itinerary?.reduce(
      (sum, day) => sum + day.places.length,
      0
    );

  return (
    <div className="trip-card booking-card">
      <div className="trip-cover">

        <img
          src={cover}
          alt={tripName}
        />

        <span className="booking-status">
          ✓ Confirmed
        </span>

        <div className="overlay">

          <h3>{tripName}</h3>

          <p>
            {days} Days • {places} Places
          </p>

        </div>

      </div>

      <div className="booking-info">

        <div className="booking-row">

          <span>
            Booking ID
          </span>

          <strong>
            {booking.bookingNumber}
          </strong>

        </div>

        <div className="booking-row">

          <span>
            Travel Dates
          </span>

          <strong>
            {booking.startDate}
            {" → "}
            {booking.endDate}
          </strong>

        </div>

        <div className="booking-row">

          <span>
            Payment
          </span>

          <strong className="payment-confirmed">
            {booking.paymentStatus}
          </strong>

        </div>

        <div className="booking-row">

          <span>

            <FaCreditCard />

            {" "}
            Method

          </span>

          <strong>
            {booking.paymentMethod}
          </strong>

        </div>

        <div className="booking-row">

          <span>
            Flight
          </span>

          <strong>
            {booking.flight
              ? booking.flight.airline
              : "No Flight"}
          </strong>

        </div>

        <div className="booking-row total">

          <span>
            Total Paid
          </span>

          <strong>
            ${booking.totalPrice}
          </strong>

        </div>

      </div>

      <div className="card-footer">

        <button
          className="edit-btn"
          onClick={() => onView(booking)}
        >
          <FiEye />
          View
        </button>

        <button
          className="delete"
          onClick={() => onCancel(booking.id)}
        >
          <FiTrash2 />
        </button>

      </div>
    </div>
  );
}

export default BookingCard;