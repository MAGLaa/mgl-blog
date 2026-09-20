/**
 * 新建文章脚本
 *
 * 使用方式：
 *   node new-post.js <标题> <分类> [标签1,标签2,...]
 *
 * 示例：
 *   node new-post.js "Vue3组合式API" tech "Vue,前端"
 *   node new-post.js "周末爬山记" life "生活,户外"
 *
 * 分类可选：tech / life
 */

const fs = require('fs')
const path = require('path')

const title = process.argv[2]
const category = process.argv[3] || 'tech'
const tagsStr = process.argv[4] || ''

if (!title) {
  console.log('用法: node new-post.js <标题> <分类> [标签]')
  console.log('')
  console.log('示例: node new-post.js "Vue3组合式API" tech "Vue,前端"')
  console.log('')
  console.log('分类: tech(技术笔记) / life(生活随笔)')
  process.exit(1)
}

const categoryMap = {
  tech: { dir: 'tech', name: '技术笔记' },
  life: { dir: 'life', name: '生活随笔' }
}

const cat = categoryMap[category] || categoryMap.tech
const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : []
const date = new Date().toISOString().split('T')[0]

// 生成文件名（仅替换 Windows 非法字符，保留中英文）
const slug = title
  .replace(/[\\/:*?"<>|]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .substring(0, 50)
  || 'untitled'

const filePath = path.join(__dirname, 'posts', cat.dir, `${slug}.html`)

const content = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  <p>在这里写你的文章内容...</p>
</body>
</html>
`

fs.writeFileSync(filePath, content, 'utf-8')

console.log(`✅ 文章已创建: ${filePath}`)
console.log(`📝 标题: ${title}`)
console.log(`📂 分类: ${cat.name}`)
console.log(`📅 日期: ${date}`)
console.log('')
console.log('💡 提示: 文章页面会在下次构建时自动生成，无需手动配置')
