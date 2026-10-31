# Muhammad Usman | AI Engineer Portfolio

A full-stack portfolio that is itself a portfolio project: a 3D hero, case studies of real projects,
an admin dashboard and an "Ask about my work" RAG chatbot.

**Status:** Week 1 of 7 (setup and design). See [docs/PLAN.md](docs/PLAN.md) for the full build plan.

## Projects featured

- **IntelliMeet**: video meetings with live speech-to-speech translation, so an Urdu speaker and an
  English speaker each hear the other in their own language (about 1.8 s from speaker to listener).
- **JobPilot**: turns a resume into a ranked shortlist of real job listings and fact-checked
  application drafts, and never sends anything without the user's click.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · next-themes · Framer Motion.
Coming next: React Three Fiber, Prisma + Neon Postgres (pgvector), Auth.js, Vercel AI SDK + Gemini.

## Run locally (no Docker)

Requirements: Node.js 20.9+ (developed on Node 24) and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

| Script              | What it does        |
| ------------------- | ------------------- |
| `npm run dev`       | Dev server          |
| `npm run build`     | Production build    |
| `npm run lint`      | ESLint              |
| `npm run typecheck` | TypeScript, no emit |
| `npm run format`    | Prettier            |

Nothing in this project uses Docker. The database (from Week 4) is hosted on Neon, so there is
no local Postgres to install.
