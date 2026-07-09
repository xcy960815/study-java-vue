# Testing

## Current State

- Test runner: Vitest.
- Vue component test dependency: `@vue/test-utils`.
- Test DOM environment: `jsdom`.
- Config file: `vitest.config.ts`.
- Current repository scan found no existing `*.test.*` or `*.spec.*` files under `src/` or `types/`.

## Run Tests

```sh
pnpm run test:unit
```

The script runs `vitest` in watch mode by default. For one-off CI-style local verification, use:

```sh
pnpm exec vitest run
```

## What To Test

Add focused regression tests for logic that can run without the backend:

- pure utilities in `src/utils/**`
- composables in `src/composables/**`
- route-building behavior in `src/utils/build-route.ts`
- permission helpers in `src/composables/usePermission.ts`
- AI conversation assembly, token/history behavior, and cancellation logic using mocked transport/store
- Vue components when behavior is local and can be mounted with Vue Test Utils

Backend-dependent pages should usually test local transformation/state behavior and mock API modules rather than making real HTTP calls.

## Test File Placement

Use one of these patterns:

- colocated: `src/utils/example.test.ts`
- component-adjacent: `src/components/foo/foo.test.ts`
- feature folder: `src/views/<feature>/<name>.test.ts`

Avoid putting tests under generated/output directories. `tsconfig.app.json` excludes `src/**/__tests__/*` from the app build, but Vitest can still discover standard `*.test.*` and `*.spec.*` files.

## Adding A Regression Test

1. Reproduce the bug or risky behavior with the smallest test.
2. Mock browser APIs, router, Pinia, or API modules only where necessary.
3. Keep assertions tied to observable behavior.
4. Run `pnpm run test:unit` or `pnpm exec vitest run <file>`.
5. Run `pnpm run type-check` when changing exported types, stores, route records, or component props.

## Notes And Constraints

- Vitest merges the main Vite config, so aliases such as `@`, `@utils`, `@apis`, `@store`, `@components`, `@router`, `@enums`, and `@plugins` are available.
- Because `request.ts` uses Axios interceptors and Element Plus messages, unit tests should mock API boundaries when possible.
- Do not rely on a real token, browser storage state, backend server, DeepSeek service, or Ollama service in unit tests.
- No coverage script is configured in `package.json`; add one deliberately if coverage becomes a project requirement.
