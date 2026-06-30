import"../css/plancard.css"
function PlanCard({
  plan,
  days,
  buildItinerary,
  onPreview,
  onSelect
}) {
  return (
    <div className="plan-card">

      <div className="plan-image-wrapper">
        <img
          src={plan.places[0]?.coverImage}
          alt={plan.title}
        />
        <span className="plan-badge">
          {plan.title}
        </span>
      </div>
      <div className="plan-content">
        <h3 className="plan-title">
  {plan.title}
</h3>
        <p className="plan-subtitle">
          {days} Day Journey
        </p>

        <hr />

        {buildItinerary(plan.places).map((dayObj) => (
  <div className="day-row" key={dayObj.day}>
    <span className="day-number">{dayObj.day}</span>
    <span className="place-name">
      {dayObj.places.map((place) => place.title).join(" • ")}
    </span>
  </div>
))}

        <div className="plan-buttons">

          <button
  className="preview-btn"
  onClick={() => onPreview(plan)}
>
  Preview
</button>

          <button className="select-btn" onClick={() => { onSelect(plan)}}>
            Select →
          </button>

        </div>

      </div>
    </div>
  );
}

export default PlanCard;