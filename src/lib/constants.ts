/**
 * Polling interval (in ms) when a project is actively processing
 * (pending, analyzing, or generating wiki)
 */
export const POLLING_INTERVAL_ACTIVE = 1000;

/**
 * Polling interval (in ms) when all projects are idle/completed
 */
export const POLLING_INTERVAL_IDLE = 10000;

/**
 * Status messages displayed during project processing
 */
export const STATUS_MESSAGES = {
  pending: "Waiting to start...",
  analyzing: "Analyzing repository...",
  "generating-wiki": "Generating wiki pages...",
  failed: "Wiki generation failed",
  completed: "",
} as const;
