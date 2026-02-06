import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Account } from "next-auth";
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { findOne, from } from "./utils";

export default function FirestoreAdapter(db: Firestore): Adapter {
  const userCollection = collection(db, AdapterCollections.USER);
  const accountCollection = collection(db, AdapterCollections.ACCOUNT);
  const sessionCollection = collection(db, AdapterCollections.SESSION);
  const verificationTokenCollection = collection(
    db,
    AdapterCollections.VERIFICATION
  );

  // didn't required this
  // const customTokenCollection = collection(db, AdapterCollections.CUSTOM_TOKEN);

  return {
    async createUser(data: Omit<AdapterUser, "id">) {
      const userData = {
        name: data.name ?? null,
        email: data.email ?? null,
        image: data.image ?? null,
        emailVerified: data.emailVerified ?? null,
      };

      const userRef = await addDoc(userCollection, userData);

      const user = {
        id: userRef.id,
        ...userData,
      } as AdapterUser;
      return user;
    },
    async getUser(id: string) {
      const userDoc = await getDoc(doc(db, AdapterCollections.USER, id));
      if (!userDoc.exists()) return null;
      const user = userDoc.data() as AdapterUser;
      return user;
    },
    async getUserByEmail(email: string) {
      const q = query(userCollection, where("email", "==", email));
      const userRef = await findOne(q);
      if (!userRef) return null;
      const user = {
        id: userRef.id,
        ...userRef.data(),
      } as AdapterUser;
      return user;
    },
    async getUserByAccount({ providerAccountId, provider }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const q = query(
        accountCollection,
        where("provider", "==", provider),
        where("providerAccountId", "==", providerAccountId),
        limit(1)
      );

      const accountRef = await findOne(q);
      if (!accountRef) return null;
      const account = {
        id: accountRef.id,
        ...accountRef.data(),
      } as unknown as Account;

      const userRef = await getDoc(
        doc(db, AdapterCollections.USER, account.userId as string)
      );
      if (!userRef.exists()) return null;
      const userData = userRef.data();

      const user = {
        id: userRef.id,
        ...userData,
      } as AdapterUser;
      return user;
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const { id, ...userData } = data;
      await setDoc(doc(db, AdapterCollections.USER, id as string), userData, {
        merge: true,
      });
      const user = data as AdapterUser;
      return user;
    },
    async deleteUser(userId: string) {
      await deleteDoc(doc(db, AdapterCollections.USER, userId as string));
    },
    async linkAccount(data: AdapterAccount) {
      const accountData = data;
      await addDoc(accountCollection, accountData);
    },

    async unlinkAccount({ providerAccountId, provider }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const q = query(
        accountCollection,
        where("provider", "==", provider),
        where("providerAccountId", "==", providerAccountId),
        limit(1)
      );

      const accountRef = await findOne(q);
      if (!accountRef) return;
      deleteDoc(doc(db, AdapterCollections.ACCOUNT, accountRef.id as string));
    },
    async createSession(data: { sessionToken: string; userId: string; expires: Date }) {
      const sessionData = {
        sessionToken: data.sessionToken ?? null,
        userId: data.userId ?? null,
        expires: data.expires ?? null,
      };
      const sessionRef = await addDoc(sessionCollection, sessionData);
      const session = {
        id: sessionRef.id,
        ...sessionData,
      } as AdapterSession;
      return session;
    },
    async getSessionAndUser(sessionToken: string) {
      const q = query(
        sessionCollection,
        where("sessionToken", "==", sessionToken),
        limit(1)
      );

      const sessionRef = await findOne(q);
      if (!sessionRef) return null;
      const sessionData: Partial<AdapterSession> = sessionRef.data();
      const userRef = await getDoc(
        doc(db, AdapterCollections.USER, sessionData.userId as string)
      );
      if (!userRef.exists()) return null;
      const userData = userRef.data();

      const user = {
        id: userRef.id,
        ...userData,
      } as AdapterUser;
      const session = {
        id: sessionRef.id,
        ...sessionData,
      } as AdapterSession;

      return {
        user: user,
        session: from(session),
      };
    },
    async updateSession(data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      const { sessionToken, ...sessionData } = data;
      const q = query(
        sessionCollection,
        where("sessionToken", "==", sessionToken),
        limit(1)
      );
      const sessionRef = await findOne(q);
      if (!sessionRef) return;
      await setDoc(
        doc(db, AdapterCollections.SESSION, sessionRef.id),
        sessionData,
        { merge: true }
      );
      return data as AdapterSession;
    },
    async deleteSession(sessionToken: string) {
      const q = query(
        sessionCollection,
        where("sessionToken", "==", sessionToken),
        limit(1)
      );

      const sessionRef = await findOne(q);
      if (!sessionRef) return;

      await Promise.allSettled([
        await deleteDoc(doc(db, AdapterCollections.SESSION, sessionRef.id)),
        await deleteDoc(doc(db, AdapterCollections.CUSTOM_TOKEN, sessionToken)),
      ]);
      return;
    },
    async createVerificationToken(data: VerificationToken) {
      const verificationTokenRef = await addDoc(
        verificationTokenCollection,
        data
      );
      const verificationToken = {
        id: verificationTokenRef.id,
        ...data,
      };
      return verificationToken;
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      const q = query(
        verificationTokenCollection,
        where("identifier", "==", identifier),
        where("token", "==", token),
        limit(1)
      );

      const verificationTokenRef = await findOne(q);
      if (!verificationTokenRef) return null;
      const verificationToken = verificationTokenRef.data();
      deleteDoc(
        doc(db, AdapterCollections.VERIFICATION, verificationTokenRef.id)
      );
      return from(verificationToken) as VerificationToken;
    },
  };
}

export enum AdapterCollections {
  USER = "NEXT_AUTH_USERS",
  SESSION = "NEXT_AUTH_SESSION",
  VERIFICATION = "NEXT_AUTH_VERIFICATION",
  ACCOUNT = "NEXT_AUTH_ACCOUNT",
  CUSTOM_TOKEN = "NEXT_AUTH_CUSTOM_TOKEN",
}
