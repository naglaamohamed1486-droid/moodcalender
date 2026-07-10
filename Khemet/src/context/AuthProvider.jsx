import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        const fullUser = {
          ...userData,
          uid: firebaseUser.uid,
        };

        setUser(fullUser);
        setFavorites(userData?.favorites || []);
        setSavedTrips(userData?.savedTrips || []);
      } else {
        setUser(null);
        setFavorites([]);
        setSavedTrips([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setFavorites(userData.favorites || []);
    setSavedTrips(userData.savedTrips || []);
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setFavorites([]);
    setSavedTrips([]);
    localStorage.removeItem("user");
  };

  const updateUser = async (newData) => {
    if (!user) return;

    const updated = { ...user, ...newData };
    setUser(updated);
    const { uid, ...safeData } = updated;

    const safeForStorage = {
      ...safeData,
      contributions: (safeData.contributions || []).map(stripImages),
    };

    await updateDoc(doc(db, "users", user.uid), safeForStorage);
    syncUserInStorage(safeForStorage);
  };

  const toggleFavorite = async (place) => {
    if (!user) return;

    const exists = favorites.some((f) => f.id === place.id);

    const updatedFavorites = exists
      ? favorites.filter((f) => f.id !== place.id)
      : [...favorites, place];

    setFavorites(updatedFavorites);

    const updatedUser = { ...user, favorites: updatedFavorites };
    setUser(updatedUser);

    await updateDoc(doc(db, "users", user.uid), {
      favorites: updatedFavorites,
    });
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const saveTrip = async (trip) => {
    if (!user) return;

    const updatedTrips = [...savedTrips, trip];
    setSavedTrips(updatedTrips);

    const updatedUser = { ...user, savedTrips: updatedTrips };
    setUser(updatedUser);

    await updateDoc(doc(db, "users", user.uid), {
      savedTrips: updatedTrips,
    });
  };

  const deleteTrip = async (index) => {
    const updatedTrips = savedTrips.filter((_, i) => i !== index);
    setSavedTrips(updatedTrips);

    const updatedUser = { ...user, savedTrips: updatedTrips };
    setUser(updatedUser);

    await updateDoc(doc(db, "users", user.uid), {
      savedTrips: updatedTrips,
    });
  };

  const duplicateTrip = async (index) => {
    const copy = {
      ...savedTrips[index],
      name: savedTrips[index].name + " Copy",
    };

    const updatedTrips = [...savedTrips, copy];
    setSavedTrips(updatedTrips);

    const updatedUser = { ...user, savedTrips: updatedTrips };
    setUser(updatedUser);

    await updateDoc(doc(db, "users", user.uid), {
      savedTrips: updatedTrips,
    });
  };

  if (loading) return null;

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
        savedTrips,
        saveTrip,
        deleteTrip,
        duplicateTrip,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}