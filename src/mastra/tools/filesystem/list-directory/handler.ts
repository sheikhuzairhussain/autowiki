import fs from "node:fs/promises";
import { validatePath } from "../helpers/path";

export async function handleListDirectory(
  directoryPath: string,
  allowedDirectories: string[],
): Promise<string> {
  const validPath = await validatePath(directoryPath, allowedDirectories);
  const entries = await fs.readdir(validPath, { withFileTypes: true });
  const formatted = entries
    .map((entry) => `${entry.isDirectory() ? "[DIR]" : "[FILE]"} ${entry.name}`)
    .join("\n");
  return formatted;
}
