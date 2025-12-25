import { z } from "zod";

const githubUrlRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;

export const createProjectSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .regex(githubUrlRegex, "Please enter a valid GitHub repository URL"),
  name: z.string().min(1, "Please enter a project name"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/**
 * Project status enum matching the database schema
 */
export type ProjectStatus =
  | "pending"
  | "analyzing"
  | "generating-wiki"
  | "completed"
  | "failed";

/**
 * Project list item returned from the projects.list query
 */
export interface ProjectListItem {
  id: string | null;
  name: string | null;
  url: string;
  status: ProjectStatus;
}
