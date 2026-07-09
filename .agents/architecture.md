# Architecture

## Bootstrap Flow

`src/main.ts` imports global CSS, Element Plus dark CSS variables, SVG sprite registration, Pinia, router, global components, and the permission plugin. It starts the loading progress simulation, then mounts `App.vue` to `#app`.

Installed app pieces:

- `registerGlobalComponents`: registers `HandleTooBar` and `Icon`.
- `store`: Pinia with `pinia-plugin-persistedstate` installed.
- `permission`: global `v-hasPermi` directive.
- `router`: Vue Router hash-history router.

## Routing And Auth

- Static routes live in `src/router/routes.ts`.
- Router setup and guards live in `src/router/index.ts`.
- Whitelisted paths are `'/login'` and `'/register'`.
- `beforeEach` starts NProgress, updates the tab icon, checks token state, loads user info, then loads backend-provided routes once.
- Backend menu routes come from `src/apis/system/menu.ts#getRoutes`.
- `src/utils/build-route.ts` maps `StudyJavaSysMenuVo[]` into Vue Router records using `import.meta.glob('@/views/**/*.vue')`.
- Dynamic route component values must point to files under `src/views/**`; values containing `layout` use `src/components/layout/index.vue`.
- `redirectRoutes` adds `/404` and a catch-all route after dynamic routes are loaded.

## Event Bus

`src/utils/event-emits.ts` defines a typed event emitter for:

- `token-invalid`: reset state and go to login.
- `login`: redirect to the requested path or `BASE_REDIRECT_PATH`.
- `logout`: reset state and go to login.
- `get-routes`: fetch and install dynamic routes.

Use these events instead of duplicating router/auth reset logic in pages.

## State

Pinia stores are exported from `src/store/index.ts`:

- `useUserInfoStore`: user profile, permissions, and loaded state. `getUserInfo()` calls `userModule.getUserInfo()`.
- `useSystemInfoStore`: dynamic route flag, backend routes, menu open state, history list, and keep-alive list.
- `useLoginStore`: login-related state.

When changing store state shapes, update the matching declarations in `types/store/**`.

## HTTP API Layer

- `src/utils/request.ts` creates the shared Axios instance.
- `baseURL` is `import.meta.env.VITE_API_DOMAIN_PREFIX`; Vite proxy rewrites this in development.
- Request interceptor adds `Authorization: Bearer <token>` except for `/login`.
- Response interceptor returns `response.data`.
- HTTP 401 matching `loginEnum.InvalidToken` triggers refresh-token flow and queues concurrent requests while refresh is in progress.
- Failed refresh emits `token-invalid`.

API functions in `src/apis/**` should stay thin: build the URL, pass typed params/body, and return typed business data.

## Permissions

- The global directive is `v-hasPermi`.
- Implementation is in `src/plugins/permission.ts`.
- Permission checks delegate to `src/composables/usePermission.ts`.
- Use `v-hasPermi="['system:user:add']"` for any-permission behavior and `v-hasPermi.all="[...]"`
  for all-permission behavior.

## Layout

`src/components/layout/index.vue` provides the authenticated app shell:

- left menu: `src/components/layout/menu/**`
- header: `src/components/layout/header/**`
- main content: `<router-view>` inside Element Plus `el-config-provider`
- keep-alive list from `useSystemInfoStore().getKeepLiveList`

The `/password` route passes a `content` prop so it can reuse layout without nesting a child route.

## AI Chat Flow

The AI chat code is split into reusable layers:

- UI: `src/components/ai-chat/**`
- Session state: `src/composables/useAiChatSession.ts`
- DeepSeek/OpenAI-style adapter: `src/composables/useCompletions.ts`
- Core abstraction: `src/utils/completions-core.ts`
- Transport: `src/utils/fetch-openai-transport.ts`
- Conversation store: `src/utils/ai-in-memory-conversation-store.ts`
- Token counting and prompt history: `src/utils/ai-token-counter.ts`, `src/utils/ai-gpt-request.ts`
- Response assembly and content transform: `src/utils/ai-gpt-response-assembler.ts`, `src/utils/ai-content-transformer.ts`

`CompletionsCore` owns cancellation, timeout, transport, token counting, and conversation storage. `Completions` builds request payloads, handles streaming or non-streaming completions, and writes assistant messages back to the conversation store.

## Extension Points

- New page: add a `.vue` file under `src/views/**`, then add a static route in `src/router/routes.ts` or ensure the backend menu route points to the file path used by `buildRoute`.
- New API group: add `src/apis/<domain>.ts`, export it from `src/apis/index.ts`, and add DTO/VO declarations under `types/apis/**`.
- New store module: add `src/store/modules/<name>.ts`, export it from `src/store/index.ts`, and add declarations under `types/store/**`.
- New SVG sprite icon: add source SVG under `src/assets/svg-icons/`; the Vite SVG plugin registers it as `icon-[name]`.
- New AI provider behavior: prefer extending the existing transport/core/completions layers instead of embedding fetch logic in a component.
