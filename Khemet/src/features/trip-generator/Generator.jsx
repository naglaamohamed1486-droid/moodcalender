import "../css/Generator.css";

function Generator({
  days,
  setDays,
  pace,
  setPace,
  interests,
  selectedInterests,
  toggleInterest,
  onGenerate,
}) {
  return (
    <div className="generator-card">
      <div className="generator-top">
        <div className="title-row">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="#C9A84C"
              strokeWidth="2"
            />

            <path
              d="M15.5 8.5L13.5 13.5L8.5 15.5L10.5 10.5L15.5 8.5Z"
              fill="#C9A84C"
            />
          </svg>

          <small>STEP 1 — GENERATE</small>
        </div>

        <h2>Trip Generator</h2>
      </div>

      <div className="generator-body">
        <div className="row">
          <div className="column">
            <label>Number of days</label>

            <input
              className="days-input"
              type="number"
              min="1"
              value={days}
              onChange={(e) =>
                setDays(Number(e.target.value))
              }
            />
          </div>

          <div className="column">
            <label>Pace</label>

            <div className="pace-buttons">
              {[
                "Relaxed",
                "Balanced",
                "Intense",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`pace-btn ${
                    pace === item ? "active" : ""
                  }`}
                  onClick={() => setPace(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="interests-section">
          <label>Interests</label>

          <div className="interests-grid">
            {interests.map((interest) => (
              <div
                key={interest.id}
                className={`interest-card ${
                  selectedInterests.includes(
                    interest.id
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  toggleInterest(interest.id)
                }
              >
                <div className="interest-title">
                  {interest.title}
                </div>

                <div className="interest-desc">
                  {interest.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="generate-wrapper">
          <button
  className="generate-btn"
  onClick={onGenerate}   
>
  Generate 3 Plans
</button>
        </div>
      </div>
    </div>
  );
}

export default Generator;