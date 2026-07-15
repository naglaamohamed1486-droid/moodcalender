import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { getUserProfilePic } from "../../shared/utils/PicCache";
// function stripImages(place) {
//   const { coverImage, gallery, ...rest } = place;
//   return rest;
// }

export function syncUserInStorage(updatedUser) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const updatedUsers = users.map((u) =>
    u.email === updatedUser.email ? updatedUser : u,
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
      if (userData?.banned) {
        await auth.signOut();
        setUser(null);
        setFavorites([]);
        setSavedTrips([]);
        setLoading(false);
        return;
      }

      const pic = await getUserProfilePic(firebaseUser.uid);
      const fullUser = { ...userData, uid: firebaseUser.uid, profilePic: pic || null };
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

const [activeTrip, setActiveTrip] = useState(() => {
    const saved = localStorage.getItem("activeTrip");
    return saved ? JSON.parse(saved) : null;
});
useEffect(() => {
    localStorage.setItem(
        "activeTrip",
        JSON.stringify(activeTrip)
    );
}, [activeTrip]);

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

    await updateDoc(doc(db, "users", user.uid), {
      ...safeData,
      contributions: safeData.contributions || [],
    });
    

    syncUserInStorage({
      ...safeData,
      uid: user.uid,
    });
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

  const tripToSave = {
    ...trip,
    id: trip.id || crypto.randomUUID(),
  };

  const updatedTrips = [...savedTrips, tripToSave];

  setSavedTrips(updatedTrips);

  const updatedUser = {
    ...user,
    savedTrips: updatedTrips,
  };

  setUser(updatedUser);

  await updateDoc(doc(db, "users", user.uid), {
    savedTrips: updatedTrips,
  });
};

      const addPlaceToActiveTrip = (place) => {
  setActiveTrip((prev) => {
    if (!prev) {
      return {
        name: "My Custom Trip",
        title: "My Custom Trip",
        itinerary: [
          {
            day: 1,
            city: place.city,
            places: [place],
          },
        ],
      };
    }

    // duplicate check
    const exists = prev.itinerary.some((day) =>
      day.places.some((p) => p.id === place.id)
    );

    if (exists) return prev;

    const itinerary = prev.itinerary.map((day) => ({
      ...day,
      places: [...day.places],
    }));

    const lastDay = itinerary[itinerary.length - 1];

    if (lastDay.city === place.city || !lastDay.city) {
      lastDay.city = place.city;
      lastDay.places.push(place);
    } else {
      itinerary.push({
        day: itinerary.length + 1,
        city: place.city,
        places: [place],
      });
    }

    return {
      ...prev,
      itinerary,
    };
  });
};

 const deleteTrip = async (tripId) => {
  const updatedTrips = savedTrips.filter(
    trip => trip.id !== tripId
  );

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
        activeTrip,
        setActiveTrip,
        addPlaceToActiveTrip,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
