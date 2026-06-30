import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { setUserProfilePic , getUserProfilePic } from "../components/PicCache";

function stripImages(place) {
  const { coverImage, gallery, ...rest } = place;
  return rest;
}

export function syncUserInStorage(updatedUser) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const updatedUsers = users.map((u) =>
    u.email === updatedUser.email ? updatedUser : u
  );
  localStorage.setItem("users", JSON.stringify(updatedUsers));
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null; 
  });

 
  useEffect(() => {
    if (user?.email && !user.profilePic) {
      getUserProfilePic(user.email).then((pic) => {
        if (pic) setUser((prev) => ({ ...prev, profilePic: pic }));
      });
    }
  }, []);

  const [favorites, setFavorites] = useState([]);


  useEffect(() => {
    if (user) {
      setFavorites(user.favorites || []);
    }
  }, [user]);


 const login = async (userData) => {
  const pic = await getUserProfilePic(userData.email);
  const fullUser = { ...userData, profilePic: pic || null };

  const { profilePic, ...safeForStorage } = fullUser;
  localStorage.setItem("user", JSON.stringify(safeForStorage)); 

  setUser(fullUser);       
  setFavorites(userData.favorites || []);
};

  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("user");
  };


  const updateUser = (newData) => {
    if (!user) return;
    const updated = { ...user, ...newData };
    const { profilePic, ...safeUser } = updated;
    const safeForStorage = {
    ...safeUser,
    contributions: (safeUser.contributions || []).map(stripImages),
  };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(safeForStorage));
    syncUserInStorage(safeForStorage);
  };

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
    const safeForStorage = {
    ...updatedUser,
    contributions: (updatedUser.contributions || []).map(stripImages),
  };
    syncUserInStorage(safeForStorage);
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