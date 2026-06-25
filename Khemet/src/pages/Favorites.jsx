import { useEffect, useState } from "react";

function Favorites() {
  const [favorites, setFavorites] =
    useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem("favorites")
      ) || [];

    setFavorites(saved);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter(
      (place) => place.id !== id
    );

    setFavorites(updated);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Favorite Places ❤️</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {favorites.map((place) => (
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

            <button
              onClick={() =>
                removeFavorite(place.id)
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;