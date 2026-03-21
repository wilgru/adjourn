# Copilot Agent Configuration

This file defines custom agent instructions for GitHub Copilot Chat in this repository.

## Project Context

- 'Adjourn' refers to the Electron build with local DB, which is the default/standard way to use the app
- 'Adjourn Cloud' refers to the server hosted web app and DB, where the 'cloud' prefix has to be mentioned in any context when talking about this build of the app

## Tech Stack

- Bun for runtime, package manager and test runner
- Vite for the bundler
- DB is an SQLite file
- Drizzle ORM and Bun's built in SQLite driver for querying the DB
- full stack project is built on Tanstack Start with React and Typescript
- Tailwind CSS is used for styling, falling back to CSS modules where Tailwind cant be used
- Custom Tanstack Query hooks are used with server functions internally by the frontend to communicate with the backend

## Coding Preferences

- Use modern TypeScript and React best practices
- Prefer TanStack Query and TanStack Start idioms
- Use Drizzle ORM with Tanstack Start server functions for all database access
- Use Tailwind CSS for styling
- Prefer functional components and hooks
- Use absolute imports from `src/`
- Write concise, well-documented code
- Always check for relevant skills before acting

## Electron Guidance

- Electron build output goes to `dist/`, cloud build to `dist-cloud/`
- Electron-builder release output goes to `dist/release/`
- Electron build resources (icons, etc.) are in `resources/`

## Communication

- Be concise and direct
- Always provide file links for code changes
- Summarize changes after multi-file edits
- Summarize reasoning for architectural decisions when relevant
