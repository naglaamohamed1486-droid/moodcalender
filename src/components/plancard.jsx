import"../css/plancard.css"
function PlanCard({
  plan,
  days,
  buildItinerary,
  onPreview,
}) {
  return (
    <div className="plan-card">

      <div className="plan-image-wrapper">
        <img
          src={plan.places[0]?.coverImage}
          alt={plan.name}
        />

        <span className="plan-badge">
          {plan.name}
        </span>
      </div>

      <div className="plan-content">

        <h3 className="plan-title">
          {plan.name === "Plan A"
            ? "Balanced Egypt"
            : plan.name === "Plan B"
            ? "Adventure Trail"
            : "Relaxed Pilgrimage"}
        </h3>

        <p className="plan-subtitle">
          {days} Day Journey
        </p>

        <hr />

        {buildItinerary(plan.places).map(
          (dayPlaces, dayIndex) => (
            <div
              className="day-row"
              key={dayIndex}
            >
              <span className="day-number">
                {dayIndex + 1}
              </span>

              <span className="place-name">
                {dayPlaces
                  .map(
                    (place) => place.title
                  )
                  .join(" • ")}
              </span>
            </div>
          )
        )}

        <div className="plan-buttons">

          <button
  className="preview-btn"
  onClick={() => onPreview(plan)}
>
  Preview
</button>

          <button className="select-btn">
            Select →
          </button>

        </div>

      </div>
    </div>
  );
}

export default PlanCard;