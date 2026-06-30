import { useState, useRef } from "react";
import places from "../places.json";
import "../css/TripPlanner.css";
import PlanCard from "../components/PlanCard";
import TripPreviewModal from "../components/TripPreviewModal";
import TripOrganizer from "../components/TripOrganizer";
import Generator from "../components/Generator";

// ===========================
// Distance & travel time helpers
// ===========================

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Rough average road speed in Egypt (km/h) — adjust if needed
const AVG_SPEED_KMH = 80;

function travelTimeHours(cityA, cityB, cityCoords) {
  if (cityA === cityB) return 0;
  const a = cityCoords[cityA];
  const b = cityCoords[cityB];
  if (!a || !b) return Infinity;
  const dist = haversineDistance(a.lat, a.lng, b.lat, b.lng);
  return dist / AVG_SPEED_KMH;
}

// ===========================
// Group places by city, get city center coords
// ===========================

// ===========================
// Hardcoded geographic clusters
// ===========================

const CITY_CLUSTERS = [
  {
    name: "North Egypt",
    cities: ["Cairo", "Giza", "Alexandria", "Fayoum", "Ain Sokhna", "Port Said", "Ismailia"],
  },
  {
    name: "Nile Valley",
    cities: ["Luxor","Qena", "Aswan"],
  },
  {
    name: "Red Sea & Sinai",
    cities: ["Sharm El Sheikh", "Dahab", "Hurghada", "Marsa Alam"],
  },
  {
    name: "Western Desert",
    cities: ["Siwa", "Farafra"],
  },
];

// ===========================
// Helpers
// ===========================

function groupByCity(places) {
  const map = {};
  places.forEach((p) => {
    if (!map[p.city]) map[p.city] = [];
    map[p.city].push(p);
  });
  return map;
}

function scorePlace(place, selectedInterests) {
  if (!selectedInterests.length) return place.rating || 0;
  return (place.tags || []).filter((t) => selectedInterests.includes(t)).length;
}

function pickPlacesForDay(placesPool, selectedInterests, placesPerDay, offset = 0) {
  const sorted = [...placesPool].sort(
    (a, b) => scorePlace(b, selectedInterests) - scorePlace(a, selectedInterests)
  );
  // rotate by offset so different plans pick different places
  const rotated = [...sorted.slice(offset), ...sorted.slice(0, offset)];
  return rotated.slice(0, placesPerDay);
}

// ===========================
// Core plan builder
// ===========================

function buildPlan(allPlaces, selectedInterests, days, pace, clusterIndex, placeOffset) {
  const placesPerDay = pace === "Relaxed" ? 2 : pace === "Intense" ? 5 : 3;
  const cityMap = groupByCity(allPlaces);

  const cluster = CITY_CLUSTERS[clusterIndex % CITY_CLUSTERS.length];
  const citiesInCluster = cluster.cities.filter((c) => cityMap[c]);

  if (citiesInCluster.length === 0) return null;

  // Score cities by interest match, sort so best city comes first
  const rankedCities = [...citiesInCluster].sort((a, b) => {
    const scoreA = (cityMap[a] || []).reduce((s, p) => s + scorePlace(p, selectedInterests), 0);
    const scoreB = (cityMap[b] || []).reduce((s, p) => s + scorePlace(p, selectedInterests), 0);
    return scoreB - scoreA;
  });

  const cityOffset = clusterIndex % rankedCities.length;

const rotatedCities = [
  ...rankedCities.slice(cityOffset),
  ...rankedCities.slice(0, cityOffset),
];

  // Distribute days across cities evenly, keeping same city consecutive
  const daysPerCity = Math.ceil(days / rankedCities.length);
  const usedPlaceIds = new Set();
  const itinerary = [];
  let dayCount = 0;

  for (const city of rotatedCities) {
    if (dayCount >= days) break;

    const pool = [...(cityMap[city] || [])].sort(
      (a, b) => scorePlace(b, selectedInterests) - scorePlace(a, selectedInterests)
    );

    // rotate pool by offset so different plans pick different places
    const rotated = [...pool.slice(placeOffset % Math.max(pool.length, 1)), ...pool.slice(0, placeOffset % Math.max(pool.length, 1))];

    // Pick only unused places
    const available = rotated.filter((p) => !usedPlaceIds.has(p.id));
    
    const cityDays = Math.min(daysPerCity, days - dayCount);

    for (let d = 0; d < cityDays; d++) {
      const startIdx = d * placesPerDay;
      const picked = available.slice(startIdx, startIdx + placesPerDay);
      
      // If not enough unique places for this day, stop adding days for this city
      if (picked.length === 0) break;

      picked.forEach((p) => usedPlaceIds.add(p.id));

      itinerary.push({
        day: dayCount + 1,
        city,
        places: picked,
      });

      dayCount++;
    }
  }

  return itinerary;
}

function buildItinerary(planPlaces, selectedInterests, days, pace) {
  const placesPerDay = pace === "Relaxed" ? 2 : pace === "Intense" ? 5 : 3;
  const cityMap = groupByCity(planPlaces);

  // Keep cities in the order they first appear, grouped consecutively
  const cityOrder = [];
  planPlaces.forEach((p) => {
    if (!cityOrder.includes(p.city)) cityOrder.push(p.city);
  });

  const usedPlaceIds = new Set();
  const itinerary = [];
  let dayCount = 0;
  let cityIndex = 0;

  while (dayCount < days && cityIndex < cityOrder.length) {
    const city = cityOrder[cityIndex];
    const pool = (cityMap[city] || []).filter((p) => !usedPlaceIds.has(p.id));

    if (pool.length === 0) {
      cityIndex++;
      continue;
    }

    const picked = pool.slice(0, placesPerDay);
    picked.forEach((p) => usedPlaceIds.add(p.id));

    itinerary.push({ day: dayCount + 1, city, places: picked });
    dayCount++;

    // Move to next city if this city's places are exhausted
    const remaining = (cityMap[city] || []).filter((p) => !usedPlaceIds.has(p.id));
    if (remaining.length < placesPerDay) cityIndex++;
  }

  return itinerary;
}

// ===========================
// buildItinerary (used by PlanCard + TripPreviewModal)
// ===========================


// ===========================
// generatePlans — 3 geographic plans
// ===========================

function generatePlans(allPlaces, selectedInterests, days, pace) {
  const titles = [
    "Plan A",
    "Plan B", 
    "Plan C",
  ];

  // Score each cluster by how well its places match selected interests
  const cityMap = groupByCity(allPlaces);

  const scoredClusters = CITY_CLUSTERS.map((cluster, index) => {
    const clusterPlaces = cluster.cities.flatMap((c) => cityMap[c] || []);
    const score = clusterPlaces.reduce(
      (sum, p) => sum + scorePlace(p, selectedInterests),
      0
    );
    return { index, score, placeCount: clusterPlaces.length };
  })
    .filter((c) => c.placeCount > 0)
    .sort((a, b) => b.score - a.score);

  // Assign top 3 clusters (or rotate if fewer than 3)
  const plans = [0, 1, 2].map((i) => {
    const clusterEntry = scoredClusters[i % scoredClusters.length];
    const itinerary = buildPlan(
      allPlaces,
      selectedInterests,
      days,
      pace,
      clusterEntry.index,
      i * 2 // different place offset per plan
    );

    if (!itinerary) return null;

    return {
      title: titles[i],
      clusterName: CITY_CLUSTERS[clusterEntry.index].name,
      places: itinerary.flatMap((d) => d.places),
      itinerary,
    };
  }).filter(Boolean);

  return plans;
}
function TripPlanner() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState("Balanced");
  const [plans, setPlans] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const organizerRef = useRef(null);
  const [savedTrips, setSavedTrips] = useState([]);

  const saveTrip = () => {
    setSavedTrips((prev) => [...prev, editingTrip]);
    setEditingTrip(null);
  };

  const handleSelect = (plan) => {
  const built = buildItinerary(plan.places, selectedInterests, days, pace);
  setEditingTrip({
    ...plan,
    itinerary: built.map((d) => d.places),
  });

  setTimeout(() => {
    organizerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};

  const handlePreview = (plan) => {
    setSelectedPlan(plan);
    setShowPreview(true);
  };

  const interests = [
    { id: "historical", title: "History", desc: "Pyramids, temples and ancient sites" },
    { id: "adventure", title: "Adventure", desc: "Deserts, diving and exploration" },
    { id: "cultural", title: "Culture", desc: "Markets, traditions and heritage" },
    { id: "nature", title: "Nature", desc: "Oases, lakes and scenic views" },
    { id: "beach", title: "Beach", desc: "Sea, resorts and relaxation" },
    { id: "food", title: "Food", desc: "Local dishes and cafés" },
    { id: "photography", title: "Photography", desc: "Instagram-worthy locations" },
    { id: "romantic", title: "Romantic", desc: "Sunsets and peaceful spots" },
    { id: "modern", title: "Modern", desc: "Contemporary attractions" },
    { id: "diving", title: "Diving", desc: "Coral reefs and underwater adventures" },
    { id: "mysterious", title: "Mystery", desc: "Ancient secrets, tombs and legends" },
    { id: "hidden", title: "Hidden Gems", desc: "Less crowded unique places" },
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const generate = () => {
  const generated = generatePlans(places, selectedInterests, days, pace);
  setPlans(generated);
};



  return (
    <div className="trip-page">
      <div className="trip-header">
        <small>TRIP PLANNER</small>
        <h1>Plan your Egyptian journey</h1>
        <p>
          Tell us how you like to travel and we'll generate three day-by-day
          plans.
        </p>
      </div>

      <Generator
        days={days}
        setDays={setDays}
        pace={pace}
        setPace={setPace}
        interests={interests}
        selectedInterests={selectedInterests}
        toggleInterest={toggleInterest}
        onGenerate={generate}
      />

      {plans.length > 0 && !editingTrip && (
        <>
          <div className="plans-header">
            <div className="plans-step">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
                  fill="#C9A84C"
                />
              </svg>
              <span>STEP 2 — CHOOSE A PLAN</span>
            </div>
            <h2>Three itineraries for you</h2>
            <p>
              Three distinct ways to spend your {days} days. Preview each, then
              select one to edit.
            </p>
          </div>

          <div className="plans-container">
            {plans.map((plan, index) => (
              <PlanCard
  key={index}
  plan={plan}
  days={days}
  selectedInterests={selectedInterests}
  buildItinerary={(p) => buildItinerary(p, selectedInterests, days, pace)}
  onPreview={handlePreview}
  onSelect={handleSelect}
/>
            ))}
          </div>
        </>
      )}

      {showPreview && (
        <TripPreviewModal
  plan={selectedPlan}
  buildItinerary={(p) => buildItinerary(p, selectedInterests, days, pace)}
  onClose={() => setShowPreview(false)}
  onSelect={handleSelect}
/>
      )}

      <div ref={organizerRef}>
        {editingTrip && (
          <TripOrganizer
            trip={editingTrip}
            setTrip={setEditingTrip}
            saveTrip={saveTrip}
          />
        )}
      </div>
    </div>
  );
}

export default TripPlanner;