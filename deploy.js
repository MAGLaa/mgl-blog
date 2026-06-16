/**
 * 一键部署脚本 - GitHub Pages
 *
 * 流程：构建 → git add → git commit → git push
 * 推送后 GitHub Actions 自动部署到 GitHub Pages
 *
 * 使用方式：
 *   npm run deploy          # 一键部署
 *   npm run deploy -- "提交信息"  # 自定义提交信息
 */

const { execSync } = require('child_process')

function run(cmd) {
  console.log(`> ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

try {
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
