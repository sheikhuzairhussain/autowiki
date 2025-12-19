import { task } from "@trigger.dev/sdk/v3";
import { mastra } from "@/mastra";
import type { ProjectAnalysis } from "@/schemas/analysis";
import { Wiki } from "@/schemas/wiki";

type GenerateWikiPagesPayload = {
  analysis: ProjectAnalysis;
};

export const generateWikiPagesTask = task({
  id: "generate-wiki-pages",
  maxDuration: 60 * 60,
  run: async (payload: GenerateWikiPagesPayload) => {
    const { analysis } = payload;

    const agent = mastra.getAgent("wikiGeneratorAgent");

    const response = await agent.generate(
      `Generate a complete wiki from the following repository analysis:\n\n${JSON.stringify(analysis, null, 2)}`,
      {
        structuredOutput: { schema: Wiki },
        providerOptions: {
          openai: {
            strictJsonSchema: false,
          },
        },
      },
    );

    return response.object;
  },
});
