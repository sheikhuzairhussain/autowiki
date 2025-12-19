import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ANALYZER_MODEL: z.string(),
  GENERATOR_MODEL: z.string(),
  OPENAI_API_KEY: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
  TRIGGER_SECRET_KEY: z.string(),
  GITHUB_MCP_PAT: z.string(),
});

export const env = envSchema.parse(process.env);
