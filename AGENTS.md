# AI Agent Guide

## Project Snapshot

- `study-java-vue` is a Vue 3 + Vite + TypeScript single-page admin/frontend project.
- Package manager: `pnpm`. Node version is pinned by `package.json` Volta config to `18.20.4`.
- Runtime shape: Vite dev server for local development, static `dist/` output for Nginx/Docker deployment.
- Main stack: Vue Router, Pinia, Element Plus, Icon Park, Tailwind/PostCSS, Axios, Vitest.
- Read the detailed agent docs in `.agents/` before making non-trivial changes.

## Start Here

1. Read `.agents/project-overview.md` for the directory map and generated files.
2. Read `.agents/development.md` before running commands.
3. Read `.agents/architecture.md` before changing routing, API, store, permissions, or AI chat code.
4. Read `.agents/testing.md` before adding or updating tests.

## High-Value Paths

- App bootstrap: `src/main.ts`, `src/App.vue`
- Router and dynamic routes: `src/router/index.ts`, `src/router/routes.ts`, `src/utils/build-route.ts`
- State: `src/store/index.ts`, `src/store/modules/*`
- HTTP API layer: `src/utils/request.ts`, `src/apis/**`
- Layout and navigation: `src/components/layout/**`
- AI chat flow: `src/components/ai-chat/**`, `src/composables/useCompletions.ts`, `src/composables/useAiChatSession.ts`, `src/utils/completions-core.ts`
- Global declarations: `types/**`
- Build config: `vite.config.ts`, `vitest.config.ts`, `env/.env.*`

## Default Workflow For AI Agents

1. Read the files directly related to the change first; do not infer behavior from names alone.
2. Keep edits scoped to the affected view/component/API/store/composable.
3. Add or update TypeScript declarations in `types/**` when API DTO/VO/store shapes change.
4. Add a focused regression test when changing logic that can be isolated from the backend.
5. Run the smallest useful verification first, then broader checks when risk is higher.
6. Report any command that is unavailable or currently not configured instead of inventing one.

## Common Commands

- Install: `pnpm install`
- Dev daily mode: `pnpm run dev`
- Dev pre/prod modes: `pnpm run dev:pre`, `pnpm run dev:prod`
- Build daily/pre/prod: `pnpm run build`, `pnpm run build:pre`, `pnpm run build:prod`
- Preview built output: `pnpm run preview`, `pnpm run preview:pre`, `pnpm run preview:prod`
- Type check: `pnpm run type-check`
- Unit tests: `pnpm run test:unit`
- Format staged files: `pnpm run format`
- Changelog: `pnpm run changelog`

## Important Constraints

- There is no configured `lint` script in `package.json` at the time this guide was written.
- Do not manually edit generated or dependency output: `node_modules/`, `dist/`, `coverage/`, `*.tsbuildinfo`, `public/file-structure.json`, `visualizer.html`, `auto-imports.d.ts`, `components.d.ts`.
- Keep `pnpm-lock.yaml` in sync with dependency changes, but do not hand-edit it.
- Environment-specific behavior comes from `env/.env.daily`, `env/.env.pre`, and `env/.env.prod`.
- Dynamic route component paths from the backend must match files under `src/views/**` or `layout`.
- Commits are expected to follow Conventional Commits; `.husky/commit-msg` enforces a restricted type/scope format.
