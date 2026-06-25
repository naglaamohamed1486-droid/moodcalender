import { useState } from "react";
import places from "../places.json";
import "../css/TripPlanner.css";

function TripPlanner() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState("Balanced");
  const [plans, setPlans] = useState([]);

  const interests = [
    {
      id: "historical",
      title: "History",
      desc: "Pyramids, temples and tombs",
    },
    {
      id: "adventure",
      title: "Adventure",
      desc: "Diving, desert and trekking",
    },
    {
      id: "cultural",
      title: "Culture",
      desc: "Bazaars, food and craft",
    },
    {
      id: "nature",
      title: "Nature",
      desc: "Oases, coasts and stars",
    },
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const generatePlans = () => {
    let filtered = places;

    if (selectedInterests.length > 0) {
      filtered = places.filter((place) =>
        place.tags.some((tag) =>
          selectedInterests.includes(tag)
        )
      );
    }

    const shuffled = [...filtered].sort(
      () => Math.random() - 0.5
    );

    const placesPerDay = 2;
    const totalPlaces = days * placesPerDay;

    setPlans([
      {
        name: "Plan A",
        places: shuffled.slice(0, totalPlaces),
      },
      {
        name: "Plan B",
        places: shuffled.slice(
          totalPlaces,
          totalPlaces * 2
        ),
      },
      {
        name: "Plan C",
        places: shuffled.slice(
          totalPlaces * 2,
          totalPlaces * 3
        ),
      },
    ]);
  };

  const buildItinerary = (placesList) => {
    const placesPerDay = 2;
    const itinerary = [];

    for (
      let i = 0;
      i < placesList.length;
      i += placesPerDay
    ) {
      itinerary.push(
        placesList.slice(i, i + placesPerDay)
      );
    }

    return itinerary;
  };

  return (
    <div className="trip-page">
      <div className="trip-header">
        <small>TRIP PLANNER</small>

        <h1>Plan your Egyptian journey</h1>

        <p>
          Tell us how you like to travel and we'll
          generate three day-by-day plans.
        </p>
      </div>

      <div className="generator-card">
        <div className="generator-top">
          <small>STEP 1 — GENERATE</small>
          <h2>Trip generator</h2>
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
                      pace === item
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setPace(item)
                    }
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
                    toggleInterest(
                      interest.id
                    )
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
              onClick={generatePlans}
            >
              Generate 3 plans
            </button>
          </div>
        </div>
      </div>

      {plans.length > 0 && (
        <div className="plans-container">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="plan-card"
            >
              <div className="plan-image-wrapper">
                <img
                  src={
                    plan.places[0]
                      ?.coverImage
                  }
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

                {buildItinerary(
                  plan.places
                ).map(
                  (
                    dayPlaces,
                    dayIndex
                  ) => (
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
                            (place) =>
                              place.title
                          )
                          .join(
                            " • "
                          )}
                      </span>
                    </div>
                  )
                )}

                <div className="plan-buttons">
                  <button className="preview-btn">
                    Preview
                  </button>

                  <button className="select-btn">
                    Select →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripPlanner;