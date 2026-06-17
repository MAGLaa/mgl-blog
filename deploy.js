/**
 * 一键部署脚本 - GitHub Pages
 *
 * 流程：自动补充标签 → 构建 → git add → git commit → git push
 * 推送后 GitHub Actions 自动部署到 GitHub Pages
 *
 * 使用方式：
 *   npm run deploy          # 一键部署
 *   npm run deploy -- "提交信息"  # 自定义提交信息
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function run(cmd) {
  console.log(`> ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

// 目录名到标签的映射
const dirTagMap = {
  'posts/tech': '技术',
  'posts/life': '生活'
}

// 自动补充缺失的 tags
function autoAddTags() {
  console.log('🏷️  检查文章标签...')
  const postsDir = path.resolve('posts')
  let updatedCount = 0

  function processDir(dir) {
    if (!fs.existsSync(dir)) return
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        processDir(filePath)
      } else if (file.endsWith('.md') && file !== 'index.md') {
        const content = fs.readFileSync(filePath, 'utf-8')
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
        
        if (fmMatch) {
          const frontmatter = fmMatch[1]
          
          // 检查是否已有 tags
          if (!/tags\s*:/.test(frontmatter)) {
            // 根据目录生成标签
            const relPath = path.relative(postsDir, filePath).replace(/\\/g, '/')
            const dirName = relPath.split('/')[0]
            const tag = dirTagMap[`posts/${dirName}`] || dirName
            
            // 在 frontmatter 末尾插入 tags
            const newFm = frontmatter + `\ntags: [${tag}]`
            const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${newFm}\n---`)
            
            fs.writeFileSync(filePath, newContent, 'utf-8')
            console.log(`  ✓ 已为 ${path.relative(process.cwd(), filePath)} 添加标签: [${tag}]`)
            updatedCount++
          }
        }
      }
    })
  }

  processDir(postsDir)
  
  if (updatedCount === 0) {
    console.log('  ✓ 所有文章已有标签')
  } else {
    console.log(`  ✓ 共更新 ${updatedCount} 篇文章的标签`)
  }
}

try {
  // 0. 自动补充标签
  autoAddTags()
  console.log()

  // 1. 构建
  console.log('� 正在构建博客...')
  run('npx vitepress build')

  // 2. 提交
  const msg = process.argv[2] || 'deploy: update blog'
  console.log('\n📦 正在提交更改...')
  run('git add -A')

  // 检查是否有变更
  try {
    execSync('git diff --cached --quiet', { stdio: 'ignore' })
    console.log('⚠️  没有新的更改需要提交')
  } catch {
    run(`git commit -m "${msg}"`)
  }

  // 3. 推送
  console.log('\n� 正在推送到 GitHub...')
  run('git push')

  console.log('\n✅ 推送完成！GitHub Actions 正在自动部署...')
  console.log('💡 部署完成后访问: https://<你的用户名>.github.io/mgl-blog/')
} catch (e) {
  console.error('\n❌ 部署失败，请检查错误信息')
  process.exit(1)
}
