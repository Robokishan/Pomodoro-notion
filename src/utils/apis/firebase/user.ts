import { db } from "../../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "./constants";
import { generateUUID } from "../../utils";
import { serverTimestamp } from "firebase/firestore";

export const getUserById = async (userId: string) => {
  const querySnapshot = await getDocs(
    query(collection(db, FIREBASE_COLLECTIONS.USERS), where("id", "==", userId))
  );
  const users = querySnapshot.docs.map((d) => d.data());
  return users;
};

// create notion User
export const createNotionUser = async ({
  code,
  accessToken,
  refreshToken,
}: {
  code: string;
  accessToken: string;
  refreshToken: string;
}) => {
  const uid = generateUUID();
  await addDoc(collection(db, FIREBASE_COLLECTIONS.USERS), {
    id: uid,
    code,
    accessToken,
    refreshToken,
    createdAt: serverTimestamp(),
  });
  return uid;
};
