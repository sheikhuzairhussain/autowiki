import { MCPClient } from "@mastra/mcp";
import { env } from "@/lib/env";

export const mcp = new MCPClient({
  servers: {
    github: {
      url: new URL("https://api.githubcopilot.com/mcp/"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${env.GITHUB_MCP_PAT}`,
          "X-MCP-Toolsets": "repos",
        },
      },
    },
  },
});
