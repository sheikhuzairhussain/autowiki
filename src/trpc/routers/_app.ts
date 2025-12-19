import { createTRPCRouter } from "../init";
import { projectsRouter } from "./projects";

export const appRouter = createTRPCRouter({
  projects: projectsRouter,
});

export type AppRouter = typeof appRouter;
