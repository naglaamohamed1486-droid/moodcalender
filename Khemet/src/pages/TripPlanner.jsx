import { useState } from "react";
import places from "../places.json";

function TripPlanner() {
  const [city, setCity] = useState("");
  const [interest, setInterest] = useState("");
  const [days, setDays] = useState(1);
  const [trip, setTrip] = useState([]);

  const generateTrip = () => {
    let filteredPlaces = [...places];

    // Filter by city
    if (city) {
      filteredPlaces = filteredPlaces.filter(
        (place) => place.city === city
      );
    }

    // Filter by interest (tag)
    if (interest) {
      filteredPlaces = filteredPlaces.filter(
        (place) => place.tags.includes(interest)
      );
    }

    // Number of places based on days
    const generatedTrip = filteredPlaces.slice(0, days * 2);

    setTrip(generatedTrip);
  };

  const addToFavorites = (place) => {
    const saved =
      JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = saved.find(
      (item) => item.id === place.id
    );

    if (!exists) {
      saved.push(place);
      localStorage.setItem(
        "favorites",
        JSON.stringify(saved)
      );

      alert("Added to Favorites ❤️");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trip Planner</h1>

      {/* City */}

      <div>
        <label>Choose City</label>
        <br />

        <select
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
        >
          <option value="">
            Select City
          </option>

          <option value="Cairo">
            Cairo
          </option>

          <option value="Alexandria">
            Alexandria
          </option>

          <option value="Giza">
            Giza
          </option>

          <option value="Luxor">
            Luxor
          </option>

          <option value="Aswan">
            Aswan
          </option>

          <option value="Dahab">
            Dahab
          </option>

          <option value="Siwa">
            Siwa
          </option>

          <option value="Fayoum">
            Fayoum
          </option>
        </select>
      </div>

      <br />

      {/* Interest */}

      <div>
        <label>Choose Interest</label>
        <br />

        <select
          value={interest}
          onChange={(e) =>
            setInterest(e.target.value)
          }
        >
          <option value="">
            Select Interest
          </option>

          <option value="historical">
            Historical
          </option>

          <option value="nature">
            Nature
          </option>

          <option value="adventure">
            Adventure
          </option>

          <option value="cultural">
            Cultural
          </option>

          <option value="beach">
            Beach
          </option>

          <option value="viewpoint">
            View Point
          </option>

          <option value="romantic">
            Romantic
          </option>

          <option value="food">
            Food
          </option>
        </select>
      </div>

      <br />

      {/* Days */}

      <div>
        <label>Number of Days</label>
        <br />

        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) =>
            setDays(Number(e.target.value))
          }
        />
      </div>

      <br />

      <button onClick={generateTrip}>
        Generate Trip
      </button>

      <hr />

      {/* Results */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {trip.map((place) => (
          <div
            key={place.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <img
              src={place.coverImage}
              alt={place.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />

            <h3>{place.title}</h3>

            <p>{place.description}</p>

            <p>
              <strong>City:</strong>{" "}
              {place.city}
            </p>

            <p>
              <strong>Rating:</strong>{" "}
              {place.rating}
            </p>

            <button
              onClick={() =>
                addToFavorites(place)
              }
            >
              ❤️ Add To Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripPlanner;