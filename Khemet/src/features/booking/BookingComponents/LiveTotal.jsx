import {
  FaPlane,
  FaHotel,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

function LiveTotal({ booking }) {

  const flightPrice =
    booking.flight?.price || 0;

  const reservationPrice =
    booking.totalPrice - flightPrice > 0
      ? booking.totalPrice - flightPrice
      : 0;

  const total =
    flightPrice + reservationPrice;

  return (

    <div className="live-total-card">

      <div className="live-total-label">
        LIVE TOTAL
      </div>

      <div className="live-total-amount">
        ${total}
      </div>

      <div className="live-total-meta">
        Updated automatically as you complete
        your booking.
      </div>

      <div className="live-total-line">

        <span>

          <FaPlane />

          Flight

        </span>

        <strong>

          ${flightPrice}

        </strong>

      </div>

      <div className="live-total-line">

        <span>

          <FaHotel />

          Reservations

        </span>

        <strong>

          ${reservationPrice}

        </strong>

      </div>

      <div className="live-total-line">

        <span>

          <FaMapMarkerAlt />

          Selected Plan

        </span>

        <strong>

          {booking.plan?.title}

        </strong>

      </div>
            <div className="live-total-line">

        <span>

          <FaMoneyBillWave />

          Payment Status

        </span>

        <strong>

          {booking.paymentStatus}

        </strong>

      </div>

      <div className="live-total-note">

        <strong>Trip Dates</strong>

        <div style={{ marginTop: "8px" }}>

          {booking.startDate
            ? `${booking.startDate} → ${booking.endDate}`
            : "Not selected yet"}

        </div>

      </div>

      <div className="live-total-note">

        <strong>Reservations</strong>

        <div style={{ marginTop: "8px" }}>

          {booking.reservations?.length || 0} planned stop(s)

        </div>

      </div>

    </div>

  );

}

export default LiveTotal;