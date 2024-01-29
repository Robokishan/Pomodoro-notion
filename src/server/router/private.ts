import { fetchNotionUser } from "@/utils/apis/firebase/userNotion";
import { listDatabases } from "@/utils/apis/notion/database";
import { protectedProcedure, router } from "../trpc";

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
});
