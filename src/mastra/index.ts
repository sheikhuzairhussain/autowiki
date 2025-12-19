import { Mastra } from "@mastra/core/mastra";
import { projectAnalyzerAgent } from "./agents/project-analyzer";
import { wikiGeneratorAgent } from "./agents/wiki-generator";

export const mastra = new Mastra({
  agents: { projectAnalyzerAgent, wikiGeneratorAgent },
});
