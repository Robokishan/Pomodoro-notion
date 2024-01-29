import { router, publicProcedure } from "../trpc";

export const publicRouter = router({
  list: publicProcedure.query(() => {
    return [];
  }),
});
