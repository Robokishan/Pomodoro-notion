import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseutils";
import { FIREBASE_COLLECTIONS } from "./constants";

export const getUserById = async (userId: string) => {
  const querySnapshot = await getDocs(
    query(collection(db, FIREBASE_COLLECTIONS.USERS), where("id", "==", userId))
  );
  const users = querySnapshot.docs.map((d) => d.data());
  return users;
};

export const getUserByEmail = async (email: string) => {
  const userDoc = await getDoc(doc(db, FIREBASE_COLLECTIONS.USERS, email));
  return userDoc.data();
};
