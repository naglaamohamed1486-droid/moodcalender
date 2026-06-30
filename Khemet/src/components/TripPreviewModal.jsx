import "./../css/TripPreviewModal.css";

function TripPreviewModal({
  plan,
  buildItinerary,
  onClose,
  onSelect
}) {
  if (!plan) return null;

  return (
    <div className="preview-overlay">
      <div className="preview-modal">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="preview-title">
          {plan.title}
        </h2>

        <p className="preview-subtitle">
          Explore Egypt your way
        </p>

        <div className="preview-days">

          {buildItinerary(plan.places).map((dayObj) => (
            <div
              className="preview-day-card"
              key={dayObj.day}
            >
              <div className="preview-day-header">
                <span className="preview-day-number">
                  {dayObj.day}
                </span>

                <h3>Day {dayObj.day}</h3>
              </div>

              <div className="day-places">

                {dayObj.places.map((place) => (
                  <div
                    key={place.id}
                    className="preview-place"
                  >
                    <svg
                      className="location-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 22S6 16.5 6 10.5C6 7.19 8.69 4.5 12 4.5C15.31 4.5 18 7.19 18 10.5C18 16.5 12 22 12 22Z"
                        stroke="#C9A84C"
                        strokeWidth="1.5"
                      />

                      <circle
                        cx="12"
                        cy="10.5"
                        r="2"
                        fill="#C9A84C"
                      />
                    </svg>

                    <div className="place-info">
                      <div className="place-title">
                        {place.title}
                      </div>

                      <div className="place-city">
                        {place.city}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          ))}

        </div>

        <div className="preview-actions">

          <button
            className="preview-close"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="preview-select"
            onClick={() => {
              onSelect(plan);
              onClose();
            }}
          >
            Select this plan →
          </button>

        </div>

      </div>
    </div>
  );
}

export default TripPreviewModal;