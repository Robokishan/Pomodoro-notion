import crypto from "crypto";
import {
  addDoc,
  collection,
  limit,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { AdapterCollections } from "../../../../Adapters/Firestore";
import { findOne } from "../../../../Adapters/Firestore/utils";
import { db } from "../../../../utils/firebaseutils";

const DESKTOP_SESSION_TTL_DAYS = 30;

interface GoogleTokenInfo {
  aud?: string;
  email?: string;
  email_verified?: "true" | "false" | boolean;
  name?: string;
  picture?: string;
  sub?: string;
}

function serializeSessionCookie(
  req: NextApiRequest,
  sessionToken: string,
  expires: Date,
): string {
  const host = req.headers.host ?? "";
  const secure = !host.startsWith("localhost") && !host.startsWith("127.0.0.1");
  const name = secure
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
  const parts = [
    `${name}=${encodeURIComponent(sessionToken)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${expires.toUTCString()}`,
  ];

  if (secure) parts.push("Secure");

  return parts.join("; ");
}

async function verifyGoogleIdToken(idToken: string): Promise<GoogleTokenInfo> {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
      idToken,
    )}`,
  );

  if (!response.ok) {
    throw new Error("Google ID token verification failed");
  }

  const tokenInfo = (await response.json()) as GoogleTokenInfo;
  if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google ID token audience did not match this app");
  }

  if (!tokenInfo.email || !tokenInfo.sub) {
    throw new Error("Google ID token is missing user identity");
  }

  return tokenInfo;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const idToken = typeof req.body?.idToken === "string" ? req.body.idToken : "";
    if (!idToken) {
      res.status(400).json({ message: "Missing Google ID token" });
      return;
    }

    const tokenInfo = await verifyGoogleIdToken(idToken);
    const emailVerified =
      tokenInfo.email_verified === true || tokenInfo.email_verified === "true";

    const userRef = await findOne(
      query(
        collection(db, AdapterCollections.USER),
        where("email", "==", tokenInfo.email),
        limit(1),
      ),
    );

    let userId = userRef?.id;
    if (!userRef) {
      const createdUser = await addDoc(collection(db, AdapterCollections.USER), {
        email: tokenInfo.email,
        emailVerified: emailVerified ? Timestamp.now() : null,
        image: tokenInfo.picture ?? null,
        name: tokenInfo.name ?? null,
      });
      userId = createdUser.id;
    }

    if (!userId) {
      res.status(500).json({ message: "Could not create desktop user" });
      return;
    }

    const accountRef = await findOne(
      query(
        collection(db, AdapterCollections.ACCOUNT),
        where("provider", "==", "google"),
        where("providerAccountId", "==", tokenInfo.sub),
        limit(1),
      ),
    );

    if (!accountRef) {
      await addDoc(collection(db, AdapterCollections.ACCOUNT), {
        provider: "google",
        providerAccountId: tokenInfo.sub,
        type: "oauth",
        userId,
      });
    }

    const sessionToken = crypto.randomBytes(32).toString("base64url");
    const expires = new Date(
      Date.now() + DESKTOP_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    await addDoc(collection(db, AdapterCollections.SESSION), {
      expires: Timestamp.fromDate(expires),
      sessionToken,
      userId,
    });

    res.setHeader("Set-Cookie", serializeSessionCookie(req, sessionToken, expires));
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Could not create desktop session",
    });
  }
}
