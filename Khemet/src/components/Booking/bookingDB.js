const DB_NAME = "KhemetDB";
const DB_VERSION = 1;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("bookings")) {
        db.createObjectStore("bookings", {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains("flights")) {
        db.createObjectStore("flights", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
}

export async function savePlan(plan) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("bookings", "readwrite");
    const store = tx.objectStore("bookings");

    const request = store.add({
      plan,
      createdAt: new Date().toISOString(),
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
  });
}

export async function getBookings() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("bookings");
    const request = tx.objectStore("bookings").getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    tx.oncomplete = () => db.close();
    tx.onerror = () => db.close();
  });
}

