import { z } from "zod";

export const Confidence = z
  .enum(["high", "medium", "low"])
  .describe("How confident the AI is in this inference");
export type Confidence = z.infer<typeof Confidence>;

export const Citation = z
  .object({
    file: z
      .string()
      .describe(
        "File path relative to repository root (e.g., src/components/Button.tsx)",
      ),
    description: z
      .string()
      .describe("What this code does (for inline citation context)"),
    startLine: z
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        "Starting line number — provide BOTH startLine and endLine, or neither",
      ),
    endLine: z
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        "Ending line number — provide BOTH startLine and endLine, or neither",
      ),
  })
  .refine(
    (data) => {
      const hasStart = data.startLine !== undefined;
      const hasEnd = data.endLine !== undefined;
      return hasStart === hasEnd; // both present or both absent
    },
    { message: "Must provide both startLine and endLine, or neither" },
  )
  .describe(
    "A reference to a specific file and line range. Provide BOTH startLine and endLine, or omit both.",
  );
export type Citation = z.infer<typeof Citation>;

export const UserFlow = z
  .object({
    goal: z.string().describe("What the user is trying to accomplish"),
    description: z
      .string()
      .describe(
        "How it works (prose — cover the user experience and implementation)",
      ),
    citations: z
      .array(Citation)
      .optional()
      .describe("Relevant code references"),
    confidence: Confidence.optional().describe(
      "How confident the AI is in this user flow",
    ),
  })
  .describe("A user flow — what a user is trying to do and how it works");
export type UserFlow = z.infer<typeof UserFlow>;

export const EntryPoint = z
  .object({
    name: z.string().describe("Name or identifier"),
    kind: z
      .string()
      .describe(
        'What kind of entry point (e.g., "CLI command", "API endpoint", "React hook")',
      ),
    description: z.string().describe("What it does"),
    example: z.string().optional().describe("Usage example"),
    file: z.string().describe("File path where it's defined"),
    startLine: z
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        "Starting line number — provide BOTH startLine and endLine, or neither",
      ),
    endLine: z
      .number()
      .int()
      .positive()
      .optional()
      .describe(
        "Ending line number — provide BOTH startLine and endLine, or neither",
      ),
  })
  .refine(
    (data) => {
      const hasStart = data.startLine !== undefined;
      const hasEnd = data.endLine !== undefined;
      return hasStart === hasEnd;
    },
    { message: "Must provide both startLine and endLine, or neither" },
  )
  .describe(
    "An entry point or interface. Provide BOTH startLine and endLine, or omit both.",
  );
export type EntryPoint = z.infer<typeof EntryPoint>;

export const Feature = z
  .object({
    name: z
      .string()
      .describe(
        'User-friendly name (e.g., "Team Collaboration", "Export & Sharing")',
      ),
    slug: z.string().describe("URL-safe identifier for wiki linking"),
    summary: z
      .string()
      .describe("One-line description of what this feature does for users"),
    description: z
      .string()
      .describe(
        "Detailed explanation of the feature's purpose and capabilities",
      ),
    implementation: z
      .string()
      .describe(
        "Technical explanation of how this feature is implemented. Cover the key modules, data flow, and architectural decisions.",
      ),
    userFlows: z
      .array(UserFlow)
      .optional()
      .describe("Common things users do with this feature"),
    entryPoints: z
      .array(EntryPoint)
      .optional()
      .describe("Public entry points for this feature"),
    keyFiles: z
      .array(
        z
          .object({
            path: z.string().describe("File path relative to repository root"),
            purpose: z.string().describe("What this file does for the feature"),
            startLine: z
              .number()
              .int()
              .positive()
              .optional()
              .describe(
                "Starting line number — provide BOTH startLine and endLine, or neither",
              ),
            endLine: z
              .number()
              .int()
              .positive()
              .optional()
              .describe(
                "Ending line number — provide BOTH startLine and endLine, or neither",
              ),
          })
          .refine(
            (data) => {
              const hasStart = data.startLine !== undefined;
              const hasEnd = data.endLine !== undefined;
              return hasStart === hasEnd;
            },
            { message: "Must provide both startLine and endLine, or neither" },
          ),
      )
      .describe(
        "Key files that implement this feature. Provide BOTH startLine and endLine, or omit both.",
      ),
    citations: z
      .array(Citation)
      .describe("Code references to include as inline citations in the wiki"),
    relatedFeatures: z
      .array(z.string())
      .optional()
      .describe("Related feature slugs for cross-referencing"),
    confidence: Confidence.optional().describe(
      "How confident the AI is in this feature identification",
    ),
  })
  .describe(
    "A feature represents a cohesive capability from the user's perspective",
  );
export type Feature = z.infer<typeof Feature>;

export const ProjectAnalysis = z
  .object({
    name: z.string().describe("Repository name"),
    url: z.string().url().optional().describe("Repository URL"),
    branch: z
      .string()
      .describe(
        "Branch name inferred from the URL (e.g., from /tree/master or /blob/main/) or determined via tools",
      ),
    summary: z
      .string()
      .describe(
        "What this software does (1-2 sentences for someone who's never seen it)",
      ),
    audience: z.array(z.string()).describe("Who this software is for"),
    capabilities: z
      .array(z.string())
      .describe("High-level list of what users can do with this software"),
    architecture: z
      .string()
      .describe(
        "How the codebase is structured and how features connect. Help devs build a mental model before diving into individual features.",
      ),
    features: z
      .array(Feature)
      .describe("User-facing features (each becomes a wiki page)"),
    readingOrder: z
      .array(z.string())
      .optional()
      .describe("Recommended order to read the wiki (feature slugs)"),
    glossary: z
      .array(
        z.object({
          term: z.string().describe("The domain-specific term"),
          definition: z.string().describe("What this term means"),
        }),
      )
      .optional()
      .describe("Domain-specific terms and their meanings"),
  })
  .describe("Complete repository analysis for wiki generation");
export type ProjectAnalysis = z.infer<typeof ProjectAnalysis>;
