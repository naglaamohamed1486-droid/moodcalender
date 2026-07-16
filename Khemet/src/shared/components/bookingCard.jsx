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
<div className="booking-cardd">

  <div className="booking-image">
    <img src={cover} alt={tripName} />
  </div>

  <div className="booking-info">

    <div className="booking-top">

      <div className="booking-title">

        <h3>{tripName}</h3>

        <p>
          <FaCalendarDays />
          {booking.startDate} — {booking.endDate}
        </p>

      </div>

      

    </div>

    <div className="booking-middle">

      <span>{days} Days</span>

      <span>•</span>

      <span>{places} Places</span>

      <span>•</span>

      <span>
        {booking.flight
          ? booking.flight.airline
          : "No Flight"}
      </span>

      <span>•</span>

      <span>{booking.paymentMethod}</span>

    </div>

    <div className="booking-bottom">

      <small>
        Booking #{booking.bookingNumber}
      </small>


    </div>

  </div>

  <div className="booking-side">

    <span className="booking-status">
        ✓ Confirmed
      </span>

    <div className="booking-price">

      {/* <span>Total</span> */}

      <h2>
        ${booking.totalPrice}
      </h2>

    </div>

    <button
    className="delete-btn"
    onClick={() => onCancel(booking.id)}
    title="Cancel Booking"
>
    <FiTrash2 />
    
</button>

  </div>

</div>
  );
}

export default BookingCard;