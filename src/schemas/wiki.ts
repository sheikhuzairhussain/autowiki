import { z } from "zod";

export const WikiPage = z
  .object({
    slug: z
      .string()
      .describe(
        "URL-safe identifier for this page e.g. 'authentication', 'exporting', etc.",
      ),
    title: z.string().describe("Display title for this page"),
    content: z.string().describe("Markdown content of the page"),
  })
  .describe("A single wiki page with markdown content");
export type WikiPage = z.infer<typeof WikiPage>;

export const WikiSection = z
  .object({
    name: z
      .string()
      .describe("Section name (e.g., 'Features', 'Architecture')"),
    slug: z
      .string()
      .describe(
        "URL-safe identifier for this section e.g. 'features', 'architecture', etc.",
      ),
    pages: z.array(WikiPage).describe("Pages within this section"),
  })
  .describe("A section containing multiple related wiki pages");
export type WikiSection = z.infer<typeof WikiSection>;

export const Wiki = z
  .object({
    name: z.string().describe("Repository/project name"),
    home: WikiPage.describe("The main landing page (index/README)"),
    sections: z.array(WikiSection).describe("Organized sections of wiki pages"),
  })
  .describe("Complete wiki structure with nested markdown pages");
export type Wiki = z.infer<typeof Wiki>;
