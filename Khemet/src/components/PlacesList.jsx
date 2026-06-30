import PlaceCard from "./PlaceCard";
import { useNavigate } from "react-router-dom";

export default function PlacesList({
  places = [],
  setSelectedPlace,
}) {
  const navigate = useNavigate();

  if (!places.length) {
    return (
      <p style={{ padding: 20 }}>
        No places found
      </p>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1px",
      }}
    >
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={place}
          onSelect={(selectedPlace) => {
            setSelectedPlace(selectedPlace);
          }}
          onOpenDetails={() => {
            navigate(`/place/${place.id}`);
          }}
        />
      ))}
    </div>
  );
}