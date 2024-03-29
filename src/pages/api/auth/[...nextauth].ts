import { db } from "@/utils/firebaseutils";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FirestoreAdapter from "../../../Adapters/Firestore";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: FirestoreAdapter(db),
};

export default NextAuth(authOptions);
