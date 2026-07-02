import "../css/plancard.css";

// Fallback labels in case a plan is ever missing one (keeps "Plan A/B/C" reliable)
const FALLBACK_LABELS = ["Plan A", "Plan B", "Plan C"];

// Each plan gets its own badge color — A gold, B terracotta, C navy
const BADGE_VARIANTS = ["badge-a", "badge-b", "badge-c"];

function PlanCard({ plan, index, days, buildItinerary, onPreview, onSelect }) {
  const label = plan.label || FALLBACK_LABELS[index] || `Plan ${index + 1}`;
  const badgeVariant = BADGE_VARIANTS[index % BADGE_VARIANTS.length];
  const itinerary = buildItinerary(plan.places);
  const totalPlaces = plan.places?.length || 0;
  const coverImage = plan.places[0]?.coverImage;

  return (
    <div className="plan-card">
      {/* ---------- Cover image + badge ---------- */}
      <div className="plan-image-wrapper">
        {coverImage ? (
          <img src={coverImage} alt={plan.title} loading="lazy" />
        ) : (
          <div className="plan-image-fallback" aria-hidden="true" />
        )}
        <span className={`plan-badge ${badgeVariant}`}>{label}</span>
      </div>

      {/* ---------- Content ---------- */}
      <div className="plan-content">
        <div className="plan-heading">
          <h3 className="plan-title">{plan.title}</h3>
          <p className="plan-subtitle">
            {days} Day Journey · {totalPlaces} {totalPlaces === 1 ? "Place" : "Places"}
          </p>
        </div>

        <hr className="plan-divider" />

        {/* ---------- Day-by-day breakdown ---------- */}
        <div className="plan-itinerary">
          {itinerary.map((dayObj) => (
            <div className="day-row" key={dayObj.day}>
              <span className="day-number">{dayObj.day}</span>
              <span className="place-name">
                {dayObj.places.map((place) => place.title).join(" • ")}
              </span>
            </div>
          ))}
        </div>

        {/* ---------- Actions ---------- */}
        <div className="plan-buttons">
          <button
            type="button"
            className="preview-btn"
            onClick={() => onPreview(plan)}
          >
            Preview
          </button>

          <button
            type="button"
            className="select-btn"
            onClick={() => onSelect(plan)}
          >
            Select →
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlanCard;