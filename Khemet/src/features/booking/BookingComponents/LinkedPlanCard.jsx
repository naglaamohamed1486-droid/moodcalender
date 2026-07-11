import { PiTicketBold } from "react-icons/pi";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

function LinkedPlanCard({ plan }) {
  if (!plan) return null;

  const placesCount =
    plan.itinerary?.reduce(
      (total, day) =>
        total +
        (Array.isArray(day)
          ? day.length
          : day.places?.length || 0),
      0
    ) || 0;

  return (
    <div className="linked-trip-card">

      <div className="linked-trip-left">

        <div className="linked-trip-icon">
          <PiTicketBold size={28} />
        </div>

        <div>

          <div className="linked-trip-eyebrow">
            LINKED PLAN
          </div>

          <div className="linked-trip-title">
            {plan.name}
          </div>

          <div
            style={{
              display: "flex",
              gap: "18px",
              marginTop: "10px",
              flexWrap: "wrap",
              color: "#7a7a7a",
              fontSize: "15px",
            }}
          >

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaCalendarAlt />
              {plan.days} Days
            </span>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaMapMarkerAlt />
              {placesCount} Places
            </span>

          </div>

        </div>

      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "10px",
        }}
      >

        <div className="linked-trip-badge">
          Selected
        </div>

        {plan.totalPrice && (
          <strong
            style={{
              color: "#16424a",
              fontSize: "22px",
            }}
          >
            ${plan.totalPrice}
          </strong>
        )}

      </div>

    </div>
  );
}

export default LinkedPlanCard;