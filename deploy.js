/**
 * 阿里云服务器部署脚本
 *
 * 服务器：47.120.66.18
 * 部署方式：构建 → SCP 上传 → Nginx 托管
 *
 * 前置条件：
 *   1. 服务器已安装 Nginx（首次运行 npm run setup-server 自动配置）
 *   2. 本机已配置 SSH 密钥登录（ssh root@47.120.66.18 无需密码）
 *
 * 使用方式：
 *   npm run deploy          # 构建并部署
 *   npm run setup-server    # 首次：安装并配置 Nginx
 */

const { execSync } = require('child_process')
const path = require('path')

const SERVER = 'root@47.120.66.18'
const REMOTE_DIR = '/var/www/blog'
const BUILD_DIR = path.join(__dirname, '.vitepress', 'dist')

function run(cmd) {
  console.log(`> ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: __dirname })
}

const action = process.argv[2]

if (action === 'setup') {
  // 首次服务器配置
  try {
    console.log('🔧 正在配置服务器...')

    // 在服务器上安装 Nginx 并创建目录
    run(`ssh ${SERVER} "apt update && apt install -y nginx && mkdir -p ${REMOTE_DIR}"`)

    // 上传 Nginx 配置
    run(`scp nginx.conf ${SERVER}:/etc/nginx/sites-available/blog`)
    run(`ssh ${SERVER} "ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx"`)

    console.log('\n✅ 服务器配置完成！')
    console.log(`💡 访问 http://47.120.66.18 查看博客`)
  } catch (e) {
    console.error('\n❌ 服务器配置失败，请检查 SSH 连接')
    process.exit(1)
  }
} else {
  // 常规部署
  try {
    console.log('🔨 正在构建博客...')
    run('npx vitepress build')

    console.log('\n📦 正在上传到服务器...')
    // 先清空远程目录，再上传
    run(`ssh ${SERVER} "rm -rf ${REMOTE_DIR}/* && mkdir -p ${REMOTE_DIR}"`)
    run(`scp -r "${BUILD_DIR}/*" ${SERVER}:${REMOTE_DIR}/`)

    console.log('\n✅ 部署完成！')
    console.log(`💡 访问 http://47.120.66.18 查看博客`)
  } catch (e) {
    console.error('\n❌ 部署失败，请检查错误信息')
    process.exit(1)
  }
}
