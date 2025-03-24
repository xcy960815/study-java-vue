/** 
 * @type {import('tailwindcss').Config} 
 */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,vue,scss}'], // 这里配置要使用Tailwind className的文件地址（tailwind亦将根据这些文件自动进行purge，移除未使用过的类名）
  theme: {
    extend: {
      // 添加新的工具类
      utilities: {
        'whitespace-initial': {
          'white-space': 'initial',
        },
      },
      colors:{
        "bg-#f6f6f7": "#f6f6f7",
      }
    }
  },
  plugins: []
}


module.exports = config