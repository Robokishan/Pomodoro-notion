import { fetchNotionUser } from "@/utils/apis/firebase/userNotion";
import {
  listDatabases,
  queryDatabase,
  retrieveDatabase,
} from "@/utils/apis/notion/database";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const privateRouter = router({
  getDatabases: protectedProcedure.query(async ({ ctx: { session } }) => {
    if (!session?.user?.email) throw new Error("Session not found");
    const user = await fetchNotionUser(session?.user?.email);
    if (!user) throw new Error("User not found");
    const databases = await listDatabases(true, user.accessToken);

    return {
      databases,
      workspace: user.workspace,
    };
  }),
  getDatabaseDetail: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
      })
    )
    .query(async ({ ctx: { session }, input: { databaseId } }) => {
      if (!session?.user?.email) throw new Error("Session not found");
      const user = await fetchNotionUser(session?.user?.email);
      if (!user) throw new Error("User not found");
      const [database, db] = await Promise.all([
        queryDatabase(databaseId, true, user.accessToken),
        retrieveDatabase(databaseId, true, user.accessToken),
      ]);

      return {
        userId: user.id,
        database,
        db,
      };
    }),
  queryDatabase: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
      })
    )
    .query(async ({ ctx: { session }, input: { databaseId } }) => {
      if (!session?.user?.email) throw new Error("Session not found");
      const user = await fetchNotionUser(session?.user?.email);
      if (!user) throw new Error("User not found");
      const database = await queryDatabase(
        databaseId as string,
        true,
        user.accessToken
      );

      return {
        database,
      };
    }),
});
