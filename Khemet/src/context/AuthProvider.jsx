import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFavorites(parsed.favorites || []);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("user");
  };

  const toggleFavorite = (place) => {
    if (!user) return;
    const exists = favorites.some((f) => f.id === place.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== place.id)
      : [...favorites, place];
    setFavorites(updated);
    const updatedUser = { ...user, favorites: updated };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  return (
    <AuthContext.Provider value={{ user, login, logout, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}