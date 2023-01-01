import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { FIREBASE_COLLECTIONS } from "./constants";

export const getUserById = async (userId: string) => {
  const querySnapshot = await getDocs(
    query(collection(db, FIREBASE_COLLECTIONS.USERS), where("id", "==", userId))
  );
  const users = querySnapshot.docs.map((d) => d.data());
  return users;
};

export const getUserByEmail = async (email: string): Promise<boolean> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, FIREBASE_COLLECTIONS.USERS),
      where("email", "==", email)
    )
  );
  if (querySnapshot.docs.length > 0) return querySnapshot.docs[0]?.data();
  else return {};
};

// sign up controller
// export const createUser = async ({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }) => {
//   if (await getUserByEmail(email)) throw new Error("User already exists");
//   const uid = generateUUID(); // generate random uuid
//   const hashedPassword = await argon2.hash(password); //hash password using argon2
//   await addDoc(collection(db, FIREBASE_COLLECTIONS.USERS), {
//     id: uid,
//     email,
//     hashedPassword,
//     createdAt: serverTimestamp(),
//   });
//   return uid;
// };
