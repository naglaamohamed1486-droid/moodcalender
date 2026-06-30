import { useState } from "react";
import places from "../places.json";
import "../css/TripPlanner.css";
import PlanCard from "../components/PlanCard";
import TripPreviewModal from "../components/TripPreviewModal";

function TripPlanner() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState("Balanced");
  const [plans, setPlans] = useState([]);
  const [showPreview, setShowPreview] =
  useState(false);

const [selectedPlan, setSelectedPlan] =
  useState(null);

  const handlePreview = (plan) => {
  setSelectedPlan(plan);
  setShowPreview(true);
};

  const interests = [
  {
    id: "historical",
    title: "History",
    desc: "Pyramids, temples and ancient sites",
  },
  {
    id: "adventure",
    title: "Adventure",
    desc: "Deserts, diving and exploration",
  },
  {
    id: "cultural",
    title: "Culture",
    desc: "Markets, traditions and heritage",
  },
  {
    id: "nature",
    title: "Nature",
    desc: "Oases, lakes and scenic views",
  },
  {
    id: "beach",
    title: "Beach",
    desc: "Sea, resorts and relaxation",
  },
  {
    id: "food",
    title: "Food",
    desc: "Local dishes and cafés",
  },
  {
    id: "photography",
    title: "Photography",
    desc: "Instagram-worthy locations",
  },
  {
    id: "romantic",
    title: "Romantic",
    desc: "Sunsets and peaceful spots",
  },
  {
    id: "modern",
    title: "Modern",
    desc: "Contemporary attractions",
  },
  {
  id: "diving",
  title: "Diving",
  desc: "Coral reefs and underwater adventures",
},
{
  id: "mysterious",
  title: "Mystery",
  desc: "Ancient secrets, tombs and legends",
},
  {
    id: "hidden",
    title: "Hidden Gems",
    desc: "Less crowded unique places",
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
  <>
    <div className="plans-header">
      <div className="plans-step">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
            fill="#C9A84C"
          />
        </svg>

        <span>STEP 2 — CHOOSE A PLAN</span>
      </div>

      <h2>Three itineraries for you</h2>

      <p>
        Three distinct ways to spend your {days} days.
        Preview each, then select one to edit.
      </p>
    </div>

<div className="plans-container">
  {plans.map((plan, index) => (
    <PlanCard
      key={index}
      plan={plan}
      days={days}
      buildItinerary={buildItinerary}
      onPreview={handlePreview}
    />
  ))}
</div>
      </>
    )}

    {showPreview && (
  <TripPreviewModal
    plan={selectedPlan}
    buildItinerary={buildItinerary}
    onClose={() =>
      setShowPreview(false)
    }
  />
)}
    </div>
  );
}

export default TripPlanner;