import { createTool } from "@mastra/core/tools";
import { handleContentDiff } from "./content-diff/handler";
import { ContentDiffArgsSchema } from "./content-diff/schema";
import { handleCountLines } from "./count-lines/handler";
import { CountLinesArgsSchema } from "./count-lines/schema";
import { handleDirectoryTree } from "./directory-tree/handler";
import { DirectoryTreeArgsSchema } from "./directory-tree/schema";
import { handleFileDiff } from "./file-diff/handler";
import { FileDiffArgsSchema } from "./file-diff/schema";
import { handleGetFileInfo } from "./file-info/handler";
import { GetFileInfoArgsSchema } from "./file-info/schema";
import { handleListDirectory } from "./list-directory/handler";
import { ListDirectoryArgsSchema } from "./list-directory/schema";
import { handleReadFiles } from "./read-files/handler";
import { ReadFilesArgsSchema } from "./read-files/schema";
import { handleSearchFiles } from "./search-files/handler";
import { SearchFilesArgsSchema } from "./search-files/schema";
import { handleSearchGlob } from "./search-glob/handler";
import { SearchGlobArgsSchema } from "./search-glob/schema";
import { handleSearchRegex } from "./search-regex/handler";
import { SearchRegexArgsSchema } from "./search-regex/schema";

/**
 * Creates filesystem tools with the specified allowed directories.
 * These tools are read-only and safe to use for repository analysis.
 */
export function createFilesystemTools(allowedDirectories: string[]) {
  const readFilesTool = createTool({
    id: "read_files",
    description:
      "Read the contents of one or more files. Returns file contents with line numbers for easy reference.",
    inputSchema: ReadFilesArgsSchema,
    execute: async ({ paths }) => {
      return handleReadFiles(paths, allowedDirectories);
    },
  });

  const directoryTreeTool = createTool({
    id: "directory_tree",
    description:
      "Get a recursive tree structure of a directory showing all files and subdirectories. Useful for understanding project structure.",
    inputSchema: DirectoryTreeArgsSchema,
    execute: async ({ path, excludePatterns }) => {
      return handleDirectoryTree(path, excludePatterns, allowedDirectories);
    },
  });

  const listDirectoryTool = createTool({
    id: "list_directory",
    description:
      "List the contents of a directory (non-recursive). Shows files and subdirectories with type indicators.",
    inputSchema: ListDirectoryArgsSchema,
    execute: async ({ path }) => {
      return handleListDirectory(path, allowedDirectories);
    },
  });

  const searchFilesTool = createTool({
    id: "search_files",
    description:
      "Search for files containing a specific text pattern. Returns matching file paths.",
    inputSchema: SearchFilesArgsSchema,
    execute: async ({ path, pattern, excludePatterns }) => {
      return handleSearchFiles(
        path,
        pattern,
        excludePatterns,
        allowedDirectories,
      );
    },
  });

  const searchGlobTool = createTool({
    id: "search_glob",
    description:
      "Search for files matching a glob pattern (e.g., '**/*.ts', 'src/**/*.json'). Returns matching file paths.",
    inputSchema: SearchGlobArgsSchema,
    execute: async ({ path, pattern, excludePatterns, maxResults }) => {
      return handleSearchGlob(
        path,
        pattern,
        excludePatterns,
        maxResults,
        allowedDirectories,
      );
    },
  });

  const searchRegexTool = createTool({
    id: "search_regex",
    description:
      "Search for content matching a regular expression pattern within files. Returns matching lines with file paths and line numbers.",
    inputSchema: SearchRegexArgsSchema,
    execute: async ({
      path,
      pattern,
      filePatterns,
      excludePatterns,
      maxResults,
      caseSensitive,
    }) => {
      return handleSearchRegex(
        path,
        pattern,
        filePatterns,
        excludePatterns,
        maxResults,
        caseSensitive,
        allowedDirectories,
      );
    },
  });

  const fileInfoTool = createTool({
    id: "file_info",
    description:
      "Get detailed information about a file including size, creation date, modification date, and permissions.",
    inputSchema: GetFileInfoArgsSchema,
    execute: async ({ path }) => {
      return handleGetFileInfo(path, allowedDirectories);
    },
  });

  const countLinesTool = createTool({
    id: "count_lines",
    description:
      "Count lines in a file or directory. Can filter by pattern and recursively count in directories.",
    inputSchema: CountLinesArgsSchema,
    execute: async ({
      path,
      recursive,
      pattern,
      filePattern,
      excludePatterns,
      ignoreEmptyLines,
    }) => {
      return handleCountLines(
        path,
        recursive,
        pattern,
        filePattern,
        excludePatterns,
        ignoreEmptyLines,
        allowedDirectories,
      );
    },
  });

  const contentDiffTool = createTool({
    id: "content_diff",
    description:
      "Compare two content strings and generate a unified diff showing the differences.",
    inputSchema: ContentDiffArgsSchema,
    execute: async ({ content1, content2, label1, label2 }) => {
      return handleContentDiff(content1, content2, label1, label2);
    },
  });

  const fileDiffTool = createTool({
    id: "file_diff",
    description:
      "Compare two files and generate a unified diff showing the differences.",
    inputSchema: FileDiffArgsSchema,
    execute: async ({ file1, file2 }) => {
      return handleFileDiff(file1, file2, allowedDirectories);
    },
  });

  return {
    readFilesTool,
    directoryTreeTool,
    listDirectoryTool,
    searchFilesTool,
    searchGlobTool,
    searchRegexTool,
    fileInfoTool,
    countLinesTool,
    contentDiffTool,
    fileDiffTool,
  };
}

export type FilesystemTools = ReturnType<typeof createFilesystemTools>;
