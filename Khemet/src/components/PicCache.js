import { uploadImage } from "../cloudinaryService";

const DB_NAME = "imageCacheDB";
const STORE = "images";
const USER_STORE = "userImages";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 2);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}
export async function setPlaceImages(id, { coverImage, gallery }) {
  const coverUrl = await uploadImage(coverImage);
  const galleryUrls = await Promise.all(
    gallery.map((img) => uploadImage(img))
  );
  return {
    coverImage: coverUrl,
    gallery: galleryUrls,
  };
}

export async function getPlaceImages(id) {
  if (typeof id === "number" || !isNaN(Number(id))) {
    const db = await openDB();
    return new Promise((resolve) => {
      const req = db.transaction(STORE).objectStore(STORE).get(Number(id));
      req.onsuccess = () => resolve(req.result || { coverImage: "", gallery: [] });
      req.onerror = () => resolve({ coverImage: "", gallery: [] });
    });
  }
  return { coverImage: "", gallery: [] };
}
export async function deletePlaceImages(id) {
}
export async function setUserProfilePic(userId, base64) {
  return await uploadImage(base64);
}

export async function getUserProfilePic(url) {
  return url || null;
}