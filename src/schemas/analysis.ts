import { z } from "zod";

export const Confidence = z
  .enum(["high", "medium", "low"])
  .describe("How confident the AI is in this inference");
export type Confidence = z.infer<typeof Confidence>;

export const FileCitation = z
  .object({
    type: z.literal("file").describe("Citation type: file-level reference"),
    file: z
      .string()
      .describe(
        "File path relative to repository root (e.g., src/components/Button.tsx)",
      ),
    description: z
      .string()
      .describe("What this code does (for inline citation context)"),
  })
  .describe("A reference to an entire file without specific line numbers");
export type FileCitation = z.infer<typeof FileCitation>;

export const RangeCitation = z
  .object({
    type: z.literal("range").describe("Citation type: line range reference"),
    file: z
      .string()
      .describe(
        "File path relative to repository root (e.g., src/components/Button.tsx)",
      ),
    description: z
      .string()
      .describe("What this code does (for inline citation context)"),
    startLine: z.number().int().positive().describe("Starting line number"),
    endLine: z.number().int().positive().describe("Ending line number"),
  })
  .describe("A reference to a specific line range within a file");
export type RangeCitation = z.infer<typeof RangeCitation>;

export const Citation = z
  .discriminatedUnion("type", [FileCitation, RangeCitation])
  .describe(
    "A code reference. Use 'file' for entire file references, 'range' for specific line ranges (preferred).",
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

export const LineRange = z
  .object({
    startLine: z.number().int().positive().describe("Starting line number"),
    endLine: z.number().int().positive().describe("Ending line number"),
  })
  .describe("A line range within a file");
export type LineRange = z.infer<typeof LineRange>;

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
    lineRange: LineRange.optional().describe(
      "Line range where the entry point is defined (recommended)",
    ),
  })
  .describe("An entry point or interface that users/developers interact with");
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
        z.object({
          path: z.string().describe("File path relative to repository root"),
          purpose: z.string().describe("What this file does for the feature"),
          lineRange: LineRange.optional().describe(
            "Line range of the relevant code section (recommended)",
          ),
        }),
      )
      .describe("Key files that implement this feature"),
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
