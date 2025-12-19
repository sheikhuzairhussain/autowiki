import { task } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { analyzeProjectTask } from "./analyze-project";
import { generateWikiPagesTask } from "./generate-wiki-pages";

type GenerateWikiPayload = {
  projectId: string;
  repositoryUrl: string;
};

export const generateWikiTask = task({
  id: "generate-wiki",
  maxDuration: 60 * 60 * 2,
  run: async (payload: GenerateWikiPayload) => {
    const { projectId, repositoryUrl } = payload;

    try {
      await db
        .update(projects)
        .set({
          status: "analyzing",
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      const analysis = await analyzeProjectTask.triggerAndWait({
        repositoryUrl,
      });

      if (!analysis.ok) {
        throw new Error("Failed to analyze project");
      }

      await db
        .update(projects)
        .set({
          analysis: analysis.output,
          status: "generating-wiki",
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      const wiki = await generateWikiPagesTask.triggerAndWait({
        analysis: analysis.output,
      });

      if (!wiki.ok) {
        throw new Error("Failed to generate wiki pages");
      }

      await db
        .update(projects)
        .set({
          wiki: wiki.output,
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      return { success: true, projectId };
    } catch (error) {
      await db
        .update(projects)
        .set({
          status: "failed",
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      throw error;
    }
  },
});
