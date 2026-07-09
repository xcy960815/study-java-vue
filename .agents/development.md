# Development

## Requirements

- Node.js `18.20.4` is declared in `package.json` under `volta`.
- Use `pnpm`; the lockfile is `pnpm-lock.yaml`.

## Install

```sh
pnpm install
```

## Development Servers

```sh
pnpm run dev       # Vite with --mode daily
pnpm run dev:pre   # Vite with --mode pre
pnpm run dev:prod  # Vite with --mode prod
```

Vite reads environment variables from `env/.env.daily`, `env/.env.pre`, and `env/.env.prod`. The dev server proxy is configured in `vite.config.ts` from:

- `VITE_PORT`
- `VITE_BASE_URL`
- `VITE_API_DOMAIN_PREFIX`
- `VITE_API_SERVER_DOMAIN`
- `VITE_API_SERVER_DOMAIN_PREFIX`

## Build

```sh
pnpm run build       # daily mode
pnpm run build:pre   # pre mode
pnpm run build:prod  # prod mode
pnpm run build-only  # raw vite build
```

Build output goes to `dist/`. Daily/development builds can also generate `visualizer.html`.
`build-only` does not pass one of this project's explicit modes; prefer `build`, `build:pre`, or
`build:prod` unless you specifically want Vite's default production mode behavior.

## Preview

```sh
pnpm run preview
pnpm run preview:pre
pnpm run preview:prod
```

Preview scripts load the matching `env/.env.*` file through `dotenv-cli` and pass `VITE_BASE_URL` to `vite preview`.

## Type Check

```sh
pnpm run type-check
```

This runs `vue-tsc --build --force` across the referenced TypeScript configs.

## Tests

```sh
pnpm run test:unit
```

See `.agents/testing.md` before adding tests. The current repo has Vitest configured, but no existing `*.test.*` or `*.spec.*` files were found.

## Formatting

```sh
pnpm run format
```

This runs `pretty-quick --staged`, so it formats staged files only. Formatting rules are in `.prettierrc`:

- no semicolons
- single quotes
- 100 column print width
- 2-space indentation
- trailing commas where valid in ES5

`.husky/pre-commit` calls `npm run format`; keep this in mind if changing package-manager assumptions.

## Lint

There is no `lint` script and no root ESLint config file in the current repository. Do not document or run `pnpm run lint` unless the project adds it later. `stylelint.config.js` exists, but there is no package script for it.

## Changelog

```sh
pnpm run changelog
pnpm run changelog:first
```

These use Conventional Changelog with `changelog-config.cjs`.

## Deployment

- Docker image build is defined in `Dockerfile`.
- The GitHub workflow `.github/workflows/docker-build.yml` builds and pushes Docker images when tags matching `v*` are pushed.
- Runtime serving uses `nginx.conf` and static files copied from `dist/`.
