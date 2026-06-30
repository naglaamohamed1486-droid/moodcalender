import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

function stripImages(place) {
  const { coverImage, gallery, ...rest } = place;
  return rest;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [favorites, setFavorites] = useState([]);

  // Sync user + favorites on load
  useEffect(() => {
    if (user) {
      setFavorites(user.favorites || []);
    }
  }, [user]);

  // LOGIN
  const login = (userData) => {
    setUser(userData);
    setFavorites(userData.favorites || []);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("user");
  };

  // UPDATE USER (with safe storage)
  const updateUser = (newData) => {
    if (!user) return;

    const updated = { ...user, ...newData };

    const safeForStorage = {
      ...updated,
      contributions: (updated.contributions || []).map(stripImages),
    };

    setUser(updated);
    localStorage.setItem("user", JSON.stringify(safeForStorage));
  };

  // FAVORITES
  const toggleFavorite = (place) => {
    if (!user) return;

    const exists = favorites.some((f) => f.id === place.id);

    const updatedFavorites = exists
      ? favorites.filter((f) => f.id !== place.id)
      : [...favorites, place];

    setFavorites(updatedFavorites);

    const updatedUser = { ...user, favorites: updatedFavorites };
    setUser(updatedUser);

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isFavorite = (id) => {
    return favorites.some((f) => f.id === id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}