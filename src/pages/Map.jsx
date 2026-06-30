import { useMemo, useState } from "react";
import "../css/Map.css";

import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import MapView from "../components/MapView";
import PlacesList from "../components/PlacesList";
import PlaceCard from "../components/PlaceCard";

import placesData from "../places.json";

export default function Map() {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const places = Array.isArray(placesData) ? placesData : [];

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const title = place?.title || "";
      const city = place?.city || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        title.toLowerCase().includes(searchText) ||
        city.toLowerCase().includes(searchText);

      const normalize = (str) =>
        (str || "").toString().trim().toLowerCase();

      const matchesTag =
        tag === "All" ||
        (Array.isArray(place.tags) &&
          place.tags.some((t) => normalize(t) === normalize(tag)));

      return matchesSearch && matchesTag;
    });
  }, [search, tag, places]);

  return (
    <div className="map-page">
      <div className="map-container">

        <section className="hero-section">
          <span className="hero-subtitle">
            Discover Egypt
          </span>

          <h1 className="hero-title">
            Explore Egypt
          </h1>

          <p className="hero-description">
            Discover ancient temples, hidden cafés, breathtaking landscapes
            and unforgettable places across Egypt.
          </p>
        </section>

        <section className="search-box">
          <div className="search-input">
            <SearchBar
              search={search}
              setSearch={setSearch}
            />
          </div>

          <CategoryFilter
            places={places}
            tag={tag}
            setTag={setTag}
          />

          <div className="places-counter">
            {filteredPlaces.length} Places
          </div>
        </section>

        <section className="content-layout">

          <div className="map-column">
            <MapView
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
            />
          </div>

          <div className="cards-column">
            {selectedPlace ? (
              <PlaceCard
                place={selectedPlace}
                onSelect={setSelectedPlace}
              />
            ) : (
              <PlacesList
                places={filteredPlaces}
                setSelectedPlace={setSelectedPlace}
              />
            )}
          </div>

        </section>

      </div>
    </div>
  );
}