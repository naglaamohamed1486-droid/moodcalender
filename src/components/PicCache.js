const DB_NAME = "imageCacheDB";
const STORE = "images";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE, { keyPath: "id" });
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