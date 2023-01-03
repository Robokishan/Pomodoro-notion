import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebaseutils";
import { generateUUID } from "../../utils";
import { getUserByEmail } from "./auth";
import { FIREBASE_COLLECTIONS } from "./constants";

// create notion User
export const createNotionUser = async ({
  email,
  accessToken,
  workspace,
}: {
  accessToken: string;
  email: string;
  workspace: any;
}) => {
  const uid = generateUUID();
  await setDoc(doc(db, FIREBASE_COLLECTIONS.USERS, email), {
    id: uid,
    email,
    accessToken,
    workspace,
    createdAt: serverTimestamp(),
  });
  return uid;
};

export const fetchNotionUser = async (email: string) => {
  const user = await getUserByEmail(email);
  return user;
};
