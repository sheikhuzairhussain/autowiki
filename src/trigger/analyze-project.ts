import { logger, task } from "@trigger.dev/sdk/v3";
import { mastra } from "@/mastra";
import { ProjectAnalysis } from "@/schemas/analysis";

type AnalyzeProjectPayload = {
  repositoryUrl: string;
};

export const analyzeProjectTask = task({
  id: "analyze-project",
  maxDuration: 60 * 60,
  run: async (payload: AnalyzeProjectPayload) => {
    const { repositoryUrl } = payload;

    const agent = mastra.getAgent("projectAnalyzerAgent");

    logger.error("Analyzing project");
    logger.error(repositoryUrl);

    const response = await agent.generate(
      `Analyze the GitHub repository at ${repositoryUrl} and return a complete ProjectAnalysis.`,
      {
        structuredOutput: { schema: ProjectAnalysis },
        maxSteps: 128,
        toolCallConcurrency: 10,
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
  },
});
