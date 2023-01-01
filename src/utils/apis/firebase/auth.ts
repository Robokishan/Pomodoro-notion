import argon2 from "argon2";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { generateUUID } from "../../utils";
import { FIREBASE_COLLECTIONS } from "./constants";

// for signin controller
export const validateUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.USERS),
      where("email", "==", email)
    )
  );
  if (querySnapshot.docs.length > 0) {
    const userData = querySnapshot.docs[0]?.data();
    const hashedPassword = userData?.password;
    if (hashedPassword && (await argon2.verify(hashedPassword, password))) {
      // password match
      return true;
    } else {
      // password did not match
      throw new Error("Email or Password wrong");
    }
  } else {
    throw new Error("No user found");
  }
};

export const getUserByEmail = async (email: string): Promise<boolean> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.USERS),
      where("email", "==", email)
    )
  );
  return querySnapshot.docs.length > 0;
};

// sign up controller
export const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (await getUserByEmail(email)) throw new Error("User already exists");
  const uid = generateUUID(); // generate random uuid
  const hashedPassword = await argon2.hash(password); //hash password using argon2
  await addDoc(collection(db, FIREBASE_COLLECTIONS.USERS), {
    id: uid,
    email,
    hashedPassword,
    createdAt: serverTimestamp(),
  });
  return uid;
};
