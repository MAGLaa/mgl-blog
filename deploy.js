/**
 * 一键部署：提交源码 → push → GitHub Actions 自动构建到 dist/
 *
 * 用法：
 *   node deploy.js                     # 默认 msg: deploy: update blog
 *   node deploy.js "fix: 调整样式"      # 自定义提交信息
 */
const { execSync, execFileSync } = require('child_process');

// 经由 shell 执行的命令（不含用户输入参数）
function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

// 不经 shell 解析的命令（参数含用户输入时使用，避免引号/特殊字符问题）
function runFile(cmd, args) {
  console.log(`> ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { stdio: 'inherit' });
}

function runNoErr(cmd) {
  try { execSync(cmd, { stdio: 'ignore' }); return true; } catch { return false; }
}

try {
  const rawMsg = process.argv.slice(2).join(' ') || 'deploy: update blog';

  console.log('\n📦 添加源码到暂存区...');
  run('git add -A');

  if (!runNoErr('git diff --cached --quiet')) {
    console.log('\n✍️  提交: ' + rawMsg);
    // 用 execFileSync 传参，中文/引号/特殊字符都不会被 shell 展开
    runFile('git', ['commit', '-m', rawMsg]);
  } else {
    console.log('⚠️  没有新的更改需要提交');
  }

  console.log('\n🚀 推送到 GitHub...');
  run('git push');

  console.log('\n✅ 推送完成！GitHub Actions 正在自动构建并部署...');
  console.log('💡 部署完成后访问: https://maglaa.github.io/mgl-blog/');
} catch (e) {
  console.error('\n❌ 部署失败: ' + (e.message || e));
  process.exit(1);
}
