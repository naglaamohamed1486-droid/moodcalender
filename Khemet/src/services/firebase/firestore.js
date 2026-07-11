import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";

export async function getUserDoc(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.data();
}

export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}
