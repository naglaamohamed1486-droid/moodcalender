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
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ id, coverImage, gallery });
    tx.oncomplete = resolve;
    tx.onerror = (e) => reject(e.target.error);
  });
}

export async function getPlaceImages(id) {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction(STORE).objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result || { coverImage: "", gallery: [] });
    req.onerror = () => resolve({ coverImage: "", gallery: [] });
  });
}

export async function deletePlaceImages(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = (e) => reject(e.target.error);
  });
}



export async function setUserProfilePic(userId, base64) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USER_STORE, "readwrite");
    tx.objectStore(USER_STORE).put({ id: userId, profilePic: base64 });
    tx.oncomplete = resolve;
    tx.onerror = (e) => reject(e.target.error);
  });
}

export async function getUserProfilePic(userId) {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction(USER_STORE).objectStore(USER_STORE).get(userId);
    req.onsuccess = () => resolve(req.result?.profilePic || null);
    req.onerror = () => resolve(null);
  });
}