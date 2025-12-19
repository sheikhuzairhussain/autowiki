import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    github: {
      url: new URL("https://api.githubcopilot.com/mcp/"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_MCP_PAT}`,
          "X-MCP-Toolsets": "repos",
        },
      },
    },
  },
});
