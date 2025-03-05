import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件

import { userInfoStore as useUserInfoStore } from './user'

import { systemInfoStore as useSystemInfoStore } from './system'

import { loginStore as useLoginStore } from './login'

// @link https://github.com/vitejs/vite/issues/9599#issuecomment-1209333753
// type PiniaStore = {
//     useUserInfoStore: ReturnType<typeof useUserInfoStore>;
//     useSystemInfoStore: ReturnType<typeof useSystemInfoStore>;
//     useLoginStore: ReturnType<typeof useLoginStore>;
// };

// // 动态加载 store 模块并导出
// const modules = import.meta.glob('./*.ts', { eager: true }) //as Record<string, PiniaStore>
// console.log("modules", modules);

// // 通过动态导入，将所有 store 批量导出
// for (const path in modules) {
//   const module = modules[path];
//   if (module) {
//     const storeName = path.replace(/^\.\/(.*)\.ts$/, '$1');
//     export { module as `use${storeName.charAt(0).toUpperCase() + storeName.slice(1)}Store}` };
//   }
// }

export {
  useUserInfoStore,
  useSystemInfoStore,
  useLoginStore
}

const store = createPinia()
/* 数据持久化 */
store.use(piniaPluginPersistedstate)

export default store
