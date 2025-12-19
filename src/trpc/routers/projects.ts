import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { createProjectSchema } from "@/schemas/project";
import { generateWikiTask } from "@/trigger/generate-wiki";
import { baseProcedure, createTRPCRouter } from "../init";

export const projectsRouter = createTRPCRouter({
  create: baseProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      const [project] = await db
        .insert(projects)
        .values({ url: input.url, name: input.name })
        .returning();

      if (project.id) {
        await generateWikiTask.trigger({
          projectId: project.id,
          repositoryUrl: input.url,
        });
      }

      return project;
    }),

  list: baseProcedure.query(async () => {
    const result = await db
      .select({
        id: projects.id,
        name: projects.name,
        url: projects.url,
        status: projects.status,
      })
      .from(projects);

    return result;
  }),

  get: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id));

      return project ?? null;
    }),

  delete: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(projects)
        .where(eq(projects.id, input.id))
        .returning({ id: projects.id });

      return deleted ?? null;
    }),

  retry: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const [project] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id));

      if (!project) {
        throw new Error("Project not found");
      }

      // Reset status to pending
      await db
        .update(projects)
        .set({
          status: "pending",
          analysis: null,
          wiki: null,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, input.id));

      // Trigger the wiki generation task
      await generateWikiTask.trigger({
        projectId: input.id,
        repositoryUrl: project.url,
      });

      return { success: true };
    }),
});
