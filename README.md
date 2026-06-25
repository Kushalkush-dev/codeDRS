# CodeDRS

AI code reviews for GitHub pull requests, wrapped in a modern SaaS dashboard with RAG-powered codebase awareness.

CodeDRS connects to your GitHub repositories, listens for pull request activity, indexes your codebase for context-aware review, and posts an AI-generated review back to the PR. It is built as a full-stack product, not a toy demo: auth, billing hooks, usage limits, repository management, async jobs, vector search, and a dashboard are all part of the system.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)
![GitHub](https://img.shields.io/badge/GitHub-Automation-181717?style=for-the-badge&logo=github)
![AI](https://img.shields.io/badge/AI-Code_Reviews-7C3AED?style=for-the-badge)
![RAG](https://img.shields.io/badge/RAG-Code_Context-06B6D4?style=for-the-badge)
![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-00C7B7?style=for-the-badge)

<p>
  <img src="https://img.shields.io/badge/Auth-GitHub_OAuth-24292F?style=flat-square&logo=github" />
  <img src="https://img.shields.io/badge/Jobs-Inngest-6366F1?style=flat-square" />
  <img src="https://img.shields.io/badge/Billing-Polar-0EA5E9?style=flat-square" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/UI-Tailwind_CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

## The idea

Pull requests deserve more than a rubber stamp. CodeDRS acts like a context-aware reviewer that already knows the surrounding codebase:

- Connect a repository from your GitHub account.
- CodeDRS installs a pull request webhook.
- The repository is chunked, embedded, and indexed into Pinecone as a vector database.
- New or updated PRs are queued through Inngest.
- The AI reviewer reads the diff, retrieves relevant code context through RAG, writes a structured review, and posts it to GitHub.
- The dashboard keeps a history of reviews, connected repositories, usage limits, and contribution stats.

```mermaid
flowchart LR
  A[GitHub repository] --> B[Webhook]
  B --> C[Next.js API route]
  C --> D[Inngest job]
  D --> E[Fetch PR diff]
  D --> F[RAG retrieval]
  F --> G[Pinecone vector DB]
  G --> K[Relevant code context]
  E --> H[AI review engine]
  K --> H
  H --> I[GitHub PR comment]
  H --> J[Prisma review history]
```

## What makes it different

| Capability | What CodeDRS does |
| --- | --- |
| Repository memory | Reads source files and stores searchable code context in Pinecone |
| RAG pipeline | Embeds PR intent, retrieves related files, and injects that context into the review prompt |
| PR automation | Reacts to GitHub `opened` and `synchronize` events through webhooks |
| Async reliability | Uses Inngest jobs for indexing and review generation instead of blocking requests |
| SaaS controls | Tracks repository limits, review usage, subscriptions, and review history |

## Features

- GitHub OAuth login with `better-auth`
- Repository discovery and connection flow
- Automatic GitHub pull request webhook creation
- Async PR review generation with Inngest
- AI-powered review output through the Vercel AI SDK
- RAG implementation for context-aware pull request analysis
- Repository indexing with embeddings and Pinecone vector database search
- Dashboard stats for commits, PRs, reviews, and connected repositories
- Review history stored in Postgres through Prisma
- Subscription tiers and usage limits for free/pro plans
- Polar checkout, customer creation, portal, and subscription lifecycle integration
- shadcn-style component system with Tailwind CSS 4

## Tech stack

| Layer | Tools |
| --- | --- |
| App | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, Radix UI, Base UI, lucide-react, Recharts |
| Auth | better-auth, GitHub OAuth |
| Database | PostgreSQL, Prisma 7, Prisma PG adapter |
| AI | Vercel AI SDK, AI model provider, embedding model |
| RAG | Codebase indexing, semantic retrieval, prompt context injection |
| Vector database | Pinecone |
| Jobs | Inngest |
| Billing | Polar |
| Data fetching | TanStack Query |

## Project structure

```txt
app/
  api/                 API routes for auth, webhooks, and Inngest
  dashboard/           Main SaaS dashboard pages
  inngest/             Background job client and functions

components/
  ui/                  Reusable UI primitives

modules/
  ai/                  RAG, embeddings, and PR review actions
  auth/                Login/logout utilities and components
  dashboard/           Dashboard stats and contribution data
  github/              GitHub API helpers
  repository/          Repository connection workflows
  review/              Review history actions
  settings/            Profile and repository settings
  subscription/        Polar and usage-limit logic

prisma/
  schema.prisma        Database schema
  migrations/          Database migration history
```

## Getting started

### 1. Install dependencies

This project includes a `bun.lock`, so Bun is the smoothest path.

```bash
bun install
```

You can also use npm/pnpm/yarn if you prefer, but keep one package manager consistent.

### 2. Configure environment variables

Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXT_PUBLIC_APP_BASE_URL="http://localhost:3000"

GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"

PINECONE_DB_API_KEY="your-pinecone-api-key"

GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"

POLAR_ACCESS_TOKEN="your-polar-access-token"
POLAR_WEBHOOK_SECRET="your-polar-webhook-secret"
POLAR_SUCCESS_URL="http://localhost:3000/dashboard/subscription?success=true"
```

Notes:

- GitHub OAuth must request repository access because CodeDRS creates repository webhooks and reads pull request data.
- `NEXT_PUBLIC_APP_BASE_URL` must be publicly reachable for real GitHub webhooks. Use a tunnel such as ngrok during local testing.
- Pinecone expects an index named `codedrs`.
- The app uses Gemini models through the AI SDK, so the Google AI API key must be available to the runtime.

### 3. Prepare the database

```bash
bunx prisma generate
bunx prisma migrate dev
```

### 4. Run the app

```bash
bun dev
```

Open `http://localhost:3000`.

### 5. Run background jobs locally

The app exposes Inngest at:

```txt
/api/inngest
```

Run the Inngest dev server in a separate terminal when testing repository indexing and PR review jobs.

```bash
bunx inngest-cli@latest dev
```

## Available scripts

```bash
bun dev      # Start the Next.js dev server
bun build    # Create a production build
bun start    # Start the production server
bun lint     # Run ESLint
```

## RAG implementation

CodeDRS uses retrieval-augmented generation so the reviewer is not limited to the pull request diff alone.

```mermaid
flowchart TD
  A[Repository connected] --> B[Fetch text files from GitHub]
  B --> C[Create file-aware chunks]
  C --> D[Generate embeddings]
  D --> E[Upsert vectors into Pinecone]
  F[Pull request received] --> G[Embed PR title and description]
  G --> H[Query Pinecone by repository]
  H --> I[Return top matching code context]
  I --> J[Build review prompt]
  F --> J
  J --> K[AI-generated review]
```

The vector records include:

- `repoId` for repository-level filtering
- `path` so the review can understand where context came from
- `content` containing the truncated source text used for retrieval

This gives each review access to nearby architecture, helper functions, models, and implementation patterns that may not appear directly in the PR diff.

## Product flow

1. A user signs in with GitHub.
2. CodeDRS lists their repositories.
3. The user connects a repository.
4. A GitHub webhook is created for pull request events.
5. CodeDRS queues repository indexing with Inngest.
6. Source files are embedded and stored in Pinecone.
7. Pull request `opened` and `synchronize` events trigger an AI review.
8. RAG retrieves relevant code context for the PR.
9. The review is posted as a GitHub comment and saved to the dashboard.

## Subscription model

CodeDRS currently models two tiers:

| Tier | Repositories | Reviews |
| --- | ---: | ---: |
| Free | 5 repositories | 5 reviews per repository |
| Pro | Unlimited | Unlimited |

Polar integration is wired through the `better-auth` Polar plugin for checkout, portal access, customer creation, and subscription status updates. The standalone `/api/webhooks/polar` route currently returns a simple acknowledgement; subscription webhook logic lives inside the auth plugin configuration.

## Development notes

- Review generation is handled in `app/inngest/functions/review.ts`.
- Repository indexing is handled in `app/inngest/functions/function.ts`.
- GitHub webhook handling starts at `app/api/webhooks/github/route.ts`.
- Vector retrieval and embedding helpers live in `modules/ai/lib/rag.ts`.
- Usage limits live in `modules/subscription/lib/subscription.ts`.

<!-- ## Roadmap ideas

- Add webhook signature verification for GitHub events.
- Replace sample monthly review chart data with real review analytics.
- Add richer repository health insights.
- Add team/workspace support.
- Add inline review comments in addition to summary PR comments.
- Add screenshots or a short demo video to this README once the UI is finalized. -->

## License

This repository is private by default. Add a license before distributing or open-sourcing the project.
