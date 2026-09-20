/**
 * 一键部署：提交源码 → push → GitHub Actions 自动构建到 dist/
 *
 * 用法：
 *   node deploy.js                     # 默认 msg: deploy: update blog
 *   node deploy.js "fix: 调整样式"      # 自定义提交信息
 */
const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function runNoErr(cmd) {
  try { execSync(cmd, { stdio: 'ignore' }); return true; } catch { return false; }
}

try {
  const rawMsg = process.argv.slice(2).join(' ') || 'deploy: update blog';
  // 把 commit message 里的双引号替换掉，避免 git 命令炸
  const safeMsg = rawMsg.replace(/"/g, '\\"');

  console.log('\n📦 添加源码到暂存区...');
  run('git add build.js server.js deploy.js new-post.js src/ public/ posts/ package.json .github/ .gitignore');

  if (!runNoErr('git diff --cached --quiet')) {
    console.log('\n✍️  提交: ' + rawMsg);
    run(`git commit -m "${safeMsg}"`);
  } else {
    console.log('⚠️  没有新的更改需要提交');
  }

  console.log('\n🚀 推送到 GitHub...');
  run('git push');

  console.log('\n✅ 推送完成！GitHub Actions 正在自动构建并部署...');
  console.log('💡 部署完成后访问: https://maglaa.github.io/mgl-blog/');
} catch (e) {
  console.error('\n❌ 部署失败，请检查上面的错误信息');
  process.exit(1);
}
