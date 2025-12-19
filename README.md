# AutoWiki

AI-powered wiki generator that analyzes GitHub repositories and creates
comprehensive documentation automatically.

## Overview

AutoWiki uses AI agents to analyze your codebase and generate beautiful,
navigable wiki documentation. Simply provide a GitHub repository URL and
AutoWiki will:

1. **Analyze** the repository structure, architecture, and features
2. **Generate** organized wiki pages with cross-references and source links

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **AI Agents**: [Mastra](https://mastra.ai) for building AI agents
- **Background Jobs**: [Trigger.dev](https://trigger.dev) for long-running tasks
- **Database**: [Neon](https://neon.tech) (PostgreSQL) with
  [Drizzle ORM](https://orm.drizzle.team)
- **API**: [tRPC](https://trpc.io) for type-safe APIs
- **Styling**: [Tailwind CSS](https://tailwindcss.com) with
  [shadcn/ui](https://ui.shadcn.com)

## How It Works

AutoWiki uses two specialized AI agents:

### Project Analyzer Agent

Analyzes GitHub repositories using the GitHub MCP server to:

- Understand project structure and architecture
- Identify features and their implementations
- Map code dependencies and data flows
- Extract key files and their purposes

### Wiki Generator Agent

Transforms the analysis into documentation:

- Creates a home page with project overview
- Generates feature pages with technical details
- Adds cross-references between related pages
- Links directly to source files on GitHub

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 20+
- PostgreSQL database (we recommend [Neon](https://neon.tech))
- [Trigger.dev](https://trigger.dev) account
- OpenAI API key
- Google AI API key
- GitHub Personal Access Token

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/autowiki.git
cd autowiki
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure the following variables:

```env
# Database
DATABASE_URL=postgresql://...

# AI Models (e.g., "openai:gpt-4o" or "google:gemini-2.0-flash")
ANALYZER_MODEL=openai:o3
GENERATOR_MODEL=google:gemini-2.5-pro

# API Keys
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=...
TRIGGER_SECRET_KEY=tr_dev_...

# GitHub MCP (Personal Access Token with repo scope)
GITHUB_MCP_PAT=ghp_...
```

4. Run database migrations:

```bash
bun drizzle-kit push
```

5. Start the development server:

```bash
bun dev
```

6. In a separate terminal, start the Trigger.dev worker:

```bash
bunx trigger dev
```

Open [http://localhost:3000](http://localhost:3000) to use AutoWiki.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Project dashboard
│   └── projects/           # Wiki viewer
├── components/             # React components
├── db/                     # Database schema and client
├── mastra/                 # AI agents
│   ├── agents/             # Agent definitions
│   └── tools/              # MCP client setup
├── schemas/                # Zod schemas
├── trigger/                # Background tasks
└── trpc/                   # tRPC routers
```

## License

MIT
