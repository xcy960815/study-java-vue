/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [],
  content: ['./src/**/*.{js,jsx,ts,tsx,vue}'], // 这里配置要使用Tailwind className的文件地址（tailwind亦将根据这些文件自动进行purge，移除未使用过的类名）
  theme: {
    extend: {}
  },
  plugins: []
}
