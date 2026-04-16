# Copilot Agent Configuration

This file defines custom agent instructions for GitHub Copilot Chat in this repository.

## Project Context

Pocketbook is a desktop app built with Electron. There is only one build target — the Electron app with a local SQLite database.

## Tech Stack

- Node.js runtime, npm as the package manager
- Vite for bundling (with `@tanstack/router-plugin/vite`)
- Electron for the desktop app shell; electron-forge for packaging and releases
- SQLite file-based database via `better-sqlite3`
- Drizzle ORM with `drizzle-orm/better-sqlite3` for all database access and migrations
- TanStack Router for client-side routing (SPA)
- React with TypeScript for the UI
- TanStack Query for server-state management and data fetching hooks
- Jotai for client-side global state
- Tailwind CSS for styling, falling back to CSS modules where Tailwind can't be used
- Radix UI primitives for accessible UI components
- Phosphor Icons for iconography
- Electron build output goes to `.vite/build/`

## Coding Preferences

- Use modern TypeScript and React best practices
- Prefer TanStack Query and TanStack Router idioms
- Use Drizzle ORM for all database access
- Use Tailwind CSS for styling
- Prefer functional components and hooks
- Use absolute imports from `src/`
- Write concise, well-documented code
- Always check for relevant skills before acting
- Avoid type assertions (`as`) unless absolutely necessary; prefer explicit type annotations instead
- When typing a variable, look for an existing type in `.type.ts` files rather than deriving one with `typeof`
- Use full, unabbreviated names for iteration callback parameters (e.g. `objects.map((object) => {})` not `objects.map((obj) => {})`)
- Check for existing components that can be reused; if a suitable component exists in a feature-specific area, consider extracting it into a generic, shared component and modify it as needed

## Electron Guidance

- Electron-forge release output goes to `dist/`
- Electron build resources (icons, etc.) are in `resources/`
- Drizzle migration files are included in Electron's `extraResource` (see `forge.config.ts`).
- On app startup, migrations are run programmatically using Drizzle ORM, referencing the bundled migration folder in production (see `src/db/connection.ts`).

## Communication

- Be concise and direct
- Always provide file links for code changes
- Summarize changes after multi-file edits
- Summarize reasoning for architectural decisions when relevant
