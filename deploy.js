const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  const msg = process.argv[2] || 'deploy: update blog';

  console.log('\n📦 正在提交源码...');
  run('git add src/ public/ astro.config.mjs package.json package-lock.json .github/');

  try {
    execSync('git diff --cached --quiet', { stdio: 'ignore' });
    console.log('⚠️  没有新的更改需要提交');
  } catch {
    run(`git commit -m "${msg}"`);
  }

  console.log('\n🚀 正在推送到 GitHub...');
  run('git push');

  console.log('\n✅ 推送完成！GitHub Actions 正在自动构建并部署...');
  console.log('💡 部署完成后访问: https://maglaa.github.io/mgl-blog/');
} catch (e) {
  console.error('\n❌ 部署失败，请检查错误信息');
  process.exit(1);
}