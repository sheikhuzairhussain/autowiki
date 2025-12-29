import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

// Normalize all paths consistently
export function normalizePath(p: string): string {
  return path.normalize(p);
}

export function expandHome(filepath: string): string {
  if (filepath.startsWith("~/") || filepath === "~") {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

// Security utilities
export async function validatePath(
  requestedPath: string,
  allowedDirectories: string[],
): Promise<string> {
  // Resolve allowedDirectories to real paths (handles symlinks like /var -> /private/var on macOS)
  const resolvedAllowedDirs = await Promise.all(
    allowedDirectories.map(async (dir) => {
      try {
        return await fs.realpath(dir);
      } catch {
        return dir; // Keep original if can't resolve
      }
    }),
  );

  const expandedPath = expandHome(requestedPath);
  // Resolve relative paths against the first allowed directory (typically the repo root)
  const baseDir = resolvedAllowedDirs[0] ?? process.cwd();
  const absolute = path.isAbsolute(expandedPath)
    ? path.resolve(expandedPath)
    : path.resolve(baseDir, expandedPath);

  // Get the real path of the requested path
  try {
    const realPath = await fs.realpath(absolute);
    const normalizedReal = normalizePath(realPath);

    // Check if real path is within allowed directories
    const isAllowed = resolvedAllowedDirs.some((dir) =>
      normalizedReal.startsWith(dir),
    );
    if (!isAllowed) {
      throw new Error(
        `Access denied - path outside allowed directories: ${realPath} not in ${resolvedAllowedDirs.join(", ")}`,
      );
    }
    return realPath;
  } catch (error) {
    // If error is our own "Access denied", re-throw it
    if (error instanceof Error && error.message.startsWith("Access denied")) {
      throw error;
    }

    // For new files that don't exist yet, verify parent directory
    const parentDir = path.dirname(absolute);
    try {
      const realParentPath = await fs.realpath(parentDir);
      const normalizedParent = normalizePath(realParentPath);
      const isParentAllowed = resolvedAllowedDirs.some((dir) =>
        normalizedParent.startsWith(dir),
      );
      if (!isParentAllowed) {
        throw new Error(
          `Access denied - parent directory outside allowed directories: ${realParentPath} not in ${resolvedAllowedDirs.join(", ")}`,
        );
      }
      return absolute;
    } catch (parentError) {
      if (
        parentError instanceof Error &&
        parentError.message.startsWith("Access denied")
      ) {
        throw parentError;
      }
      throw new Error(`Parent directory does not exist: ${parentDir}`);
    }
  }
}
