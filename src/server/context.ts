"use server";

import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  try {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      authOptions
    );
    return {
      session,
    };
  } catch (e) {
    throw e;
  }
}
export type Context = Awaited<ReturnType<typeof createContext>>;
