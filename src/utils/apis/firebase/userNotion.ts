import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
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
  await addDoc(collection(db, FIREBASE_COLLECTIONS.USERS), {
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
