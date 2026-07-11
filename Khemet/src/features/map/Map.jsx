import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./Map.css";
import SearchBar from "../../shared/components/SearchBar";
import CategoryFilter from "../places/CategoryFilter";
import MapView from "./MapView";
import PlacesList from "../places/PlacesList";
import PlaceCard from "../places/PlaceCard";

import placesData from "../../places.json";

export default function Map() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const tagFromUrl = searchParams.get("tag");

    if (tagFromUrl) {
      setSelectedTags([tagFromUrl]);
    } else {
      setSelectedTags([]);
    }
  }, [searchParams]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTags([]);
    setSelectedPlace(null);
  };

  const places = Array.isArray(placesData) ? placesData : [];

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const title = place?.title || "";
      const city = place?.city || "";

      const searchText = search.toLowerCase();

      const matchesSearch =
        title.toLowerCase().includes(searchText) ||
        city.toLowerCase().includes(searchText);

      const normalize = (str) => (str || "").toString().trim().toLowerCase();

      const matchesTag =
        selectedTags.length === 0 ||
        (Array.isArray(place.tags) &&
          place.tags.some((t) =>
            selectedTags.some(
              (selected) => normalize(selected) === normalize(t),
            ),
          ));

      return matchesSearch && matchesTag;
    });
  }, [search, selectedTags, places]);

  return (
    <div className="map-page">
      <div className="map-container">
        <section className="hero-section">
          <span className="hero-subtitle">Discover Egypt</span>

          <h1 className="hero-title">Explore Egypt</h1>

          <p className="hero-description">
            Discover ancient temples, hidden cafés, breathtaking landscapes and
            unforgettable places across Egypt.
          </p>
        </section>

        <section className="search-box">
          <div className="search-wrapper">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          <CategoryFilter
            places={places}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />

          <button className="clear-btn" onClick={clearFilters}>
            ✕ Clear
          </button>

          <div className="places-counter">{filteredPlaces.length} Places</div>
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
              <PlaceCard place={selectedPlace} onSelect={setSelectedPlace} />
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
