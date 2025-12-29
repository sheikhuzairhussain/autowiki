import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { logger, task } from "@trigger.dev/sdk/v3";
import simpleGit from "simple-git";
import { mastra } from "@/mastra";
import { getAnalyzeProjectPrompt } from "@/mastra/prompts/analyze-project";
import { createFilesystemTools } from "@/mastra/tools/filesystem";
import { ProjectAnalysis } from "@/schemas/analysis";

type AnalyzeProjectPayload = {
  repositoryUrl: string;
};

export const analyzeProjectTask = task({
  id: "analyze-project",
  maxDuration: 60 * 60,
  run: async (payload: AnalyzeProjectPayload) => {
    const { repositoryUrl } = payload;

    // Create a temp directory for the clone
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "autowiki-"));

    // Clone the repository with shallow depth (simple-git will create repo subdirectory)
    logger.info("Cloning repository", { repositoryUrl, tempDir });
    const git = simpleGit(tempDir);
    await git.clone(repositoryUrl, { "--depth": 1 });

    // Find the cloned directory (simple-git creates it based on repo name)
    const entries = fs.readdirSync(tempDir);
    const clonePath = path.join(tempDir, entries[0]);
    logger.info("Clone complete", { clonePath });

    try {
      // Create filesystem tools with the cloned directory as the allowed directory
      const filesystemTools = createFilesystemTools([clonePath]);

      const agent = mastra.getAgent("projectAnalyzerAgent");

      const response = await agent.generate(
        getAnalyzeProjectPrompt({ repositoryUrl, clonePath }),
        {
          structuredOutput: { schema: ProjectAnalysis },
          maxSteps: 128,
          toolCallConcurrency: 10,
          toolsets: {
            filesystem: filesystemTools,
          },
          providerOptions: {
            openai: {
              strictJsonSchema: false,
              reasoningEffort: "medium",
              maxToolCalls: 64,
            },
          },
        },
      );

      return response.object;
    } finally {
      // Cleanup: Remove the cloned repository
      logger.info("Cleaning up temp directory", { tempDir });
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  },
});
