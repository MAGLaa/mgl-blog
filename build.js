/**
 * 纯静态构建脚本（零依赖）
 * 读取 posts/ 目录 → 生成 dist/ 下所有 HTML 页面 + sitemap.xml
 *
 * 用法：node build.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'dist');
const POSTS_DIR = path.join(ROOT, 'posts');
const SRC_STYLES = path.join(ROOT, 'src', 'styles', 'global.css');
const PUBLIC_DIR = path.join(ROOT, 'public');

const { siteConfig } = require(path.join(ROOT, 'src', 'config', 'site.js'));
const { loadPosts, CATEGORY_MAP } = require(path.join(ROOT, 'src', 'lib', 'posts.js'));
const { cleanTyporaHtml } = require(path.join(ROOT, 'src', 'lib', 'html-cleaner.js'));
const tpl = require(path.join(ROOT, 'src', 'lib', 'templates.js'));

const base = siteConfig.base; // '/mgl-blog/'
const site = siteConfig.site || `https://maglaa.github.io${base.replace(/\/$/, '')}`;

/** 递归删除目录 */
function rmrf(p) {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    const fp = path.join(p, entry.name);
    if (entry.isDirectory()) rmrf(fp); else fs.unlinkSync(fp);
  }
  fs.rmdirSync(p);
}

/** 递归拷贝目录 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

/** 写文件（自动创建目录） */
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}

/** 生成 URL（去掉前导 /，base 已有结尾 /） */
function urlOf(rel) {
  const clean = rel.replace(/^\/+/, '');
  return `${base}${clean}`;
}

/** 从 Typora HTML 提取 <body> 内部 */
function extractBody(raw) {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : raw;
}

function main() {
  const t0 = Date.now();
  console.log('🔨 MGL Blog build start');

  // 1. 清理旧产物
  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });

  // 2. 拷贝静态资源
  copyDir(PUBLIC_DIR, DIST);
  // 同时把 global.css 放到 dist/css/
  writeFile(path.join(DIST, 'css', 'global.css'), fs.readFileSync(SRC_STYLES, 'utf-8'));

  // 3. 首页
  writeFile(path.join(DIST, 'index.html'), tpl.renderHome(base));
  console.log('  ✓ index.html');

  // 4. 分类列表页
  const categories = Object.keys(CATEGORY_MAP);
  const posts = loadPosts();
  for (const dir of categories) {
    const list = posts.filter(p => p.categoryDir === dir);
    const html = tpl.renderCategory(dir, list, base);
    writeFile(path.join(DIST, 'posts', dir, 'index.html'), html);
    console.log(`  ✓ posts/${dir}/index.html  (${list.length} 篇)`);
  }

  // 5. 文章详情页（每篇一个目录，形如 posts/tech/001/index.html）
  for (const post of posts) {
    const categoryDir = post.categoryDir;
    // 读取原始 HTML（文件名来自 posts.file，带 .html）
    const rawPath = path.join(POSTS_DIR, categoryDir, post.file);
    let body = '';
    if (fs.existsSync(rawPath)) {
      const raw = fs.readFileSync(rawPath, 'utf-8').replace(/^\uFEFF/, '');
      body = cleanTyporaHtml(extractBody(raw));
    }

    const related = posts
      .filter(p => p.categoryDir === categoryDir && p.id !== post.id)
      .slice(0, 3);

    const html = tpl.renderPost(post, body, related, base);
    const outFile = path.join(DIST, 'posts', categoryDir, post.id, 'index.html');
    writeFile(outFile, html);
  }
  console.log(`  ✓ ${posts.length} 篇文章详情页`);

  // 6. 文章树浏览
  writeFile(path.join(DIST, 'browse', 'index.html'), tpl.renderBrowse(base));
  console.log('  ✓ browse/index.html');

  // 7. 404
  writeFile(path.join(DIST, '404.html'), tpl.render404(base));
  console.log('  ✓ 404.html');

  // 8. sitemap.xml
  const now = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: urlOf(''), lastmod: now, priority: '1.0' },
    { loc: urlOf('browse/'), lastmod: now, priority: '0.8' },
    ...categories.map(dir => ({ loc: urlOf(`posts/${dir}/`), lastmod: now, priority: '0.9' })),
    ...posts.map(p => ({ loc: urlOf(`${p.url}/`), lastmod: p.date || now, priority: '0.7' })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  writeFile(path.join(DIST, 'sitemap.xml'), sitemap);
  console.log('  ✓ sitemap.xml');

  // 9. robots.txt
  writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${urlOf('sitemap.xml')}\n`);
  console.log('  ✓ robots.txt');

  const dt = Date.now() - t0;
  console.log(`✅ Build done in ${dt}ms → ${path.relative(ROOT, DIST)}`);
}

main();
