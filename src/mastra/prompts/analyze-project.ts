type AnalyzeProjectPromptParams = {
  repositoryUrl: string;
  clonePath: string;
};

export function getAnalyzeProjectPrompt({
  repositoryUrl,
  clonePath,
}: AnalyzeProjectPromptParams): string {
  return `Analyze the repository that has been cloned to ${clonePath} and return a complete ProjectAnalysis.
        
The repository was cloned from: ${repositoryUrl}

Use the filesystem tools to explore the codebase. Start by getting the directory tree to understand the structure, then read key files like README, package.json, etc.`;
}
