import { privateRouter } from "./router/private";
import { publicRouter } from "./router/public";
import { router } from "./trpc";

export const appRouter = router({
  private: privateRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
