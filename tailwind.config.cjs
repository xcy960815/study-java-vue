/** 
 * @type {import('tailwindcss').Config} 
 */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,vue,scss}'], // 这里配置要使用Tailwind className的文件地址（tailwind亦将根据这些文件自动进行purge，移除未使用过的类名）
  theme: {
    extend: {
      lineHeight:{
        "24": "24px",
      },
      colors: {
        "0d1117": "#0d1117",
      },
    }
  },
  plugins: []
}


module.exports = config