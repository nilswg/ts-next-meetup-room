/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: allowDevPage(['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'])
}

module.exports = nextConfig


function allowDevPage(config) {
  /**
   * 擴展名 dev.tsx，表示僅在 development 階段中使用；在 production 階段則被剔除掉。
   */
  if (process.env.NODE_ENV === 'production') {
    return config
  }

  /**
   * 非正式環境時，建立新的擴展名規則，添加 [檔案名].dev.[擴展名]
   * 如 .js 會變成 [js, dev.js]； .tsx 會變成 [tsx, dev.tsx]
   */
  let res = []
  config.forEach((ext) => {
    res.push(ext)
    res.push(`dev.${ext}`)
  })

  return res
}

// 測試
if (require.main === module) {
  process.env.NODE_ENV = "development"
  allowDevPage(['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'])
}