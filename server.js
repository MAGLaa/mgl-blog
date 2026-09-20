/**
 * 开发服务器（零依赖）
 * - 不要求先 build：所有页面运行时渲染
 * - base 自动用 '/'（dev 环境下方便 localhost 直接访问）
 * - 简单的 live reload（文件改动时自动刷新浏览器）
 *
 * 用法：node server.js            （默认 http://localhost:5173）
 *      node server.js --port 8080
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const SRC_STYLES = path.join(ROOT, 'src', 'styles', 'global.css');
const PUBLIC_DIR = path.join(ROOT, 'public');
const POSTS_DIR = path.join(ROOT, 'posts');

const { siteConfig } = require(path.join(ROOT, 'src', 'config', 'site.js'));
const { loadPosts, readHtmlFile, CATEGORY_MAP } = require(path.join(ROOT, 'src', 'lib', 'posts.js'));
const { cleanTyporaHtml } = require(path.join(ROOT, 'src', 'lib', 'html-cleaner.js'));
const tpl = require(path.join(ROOT, 'src', 'lib', 'templates.js'));

// ---- dev 环境 base 用 '/' ----
const DEV_BASE = '/';

// ---- 端口 ----
const portArg = process.argv.indexOf('--port');
const PORT = portArg >= 0 ? parseInt(process.argv[portArg + 1], 10) : 5173;

// ---- 静态文件 MIME ----
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.xml':  'application/xml; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
};

function send(res, status, content, mime) {
  res.writeHead(status, { 'Content-Type': mime || 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' });
  res.end(content);
}

function sendStatic(res, filePath) {
  if (!fs.existsSync(filePath)) return false;
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) { send(res, 500, 'Internal Error'); return; }
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-cache' });
    res.end(data);
  });
  return true;
}

function extractBody(raw) {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : raw;
}

function renderAll() {
  return {
    home:      () => tpl.renderHome(DEV_BASE),
    browse:    () => tpl.renderBrowse(DEV_BASE),
    category:  (dir) => { const list = loadPosts().filter(p => p.categoryDir === dir); return tpl.renderCategory(dir, list, DEV_BASE); },
    post:      (cat, id) => {
                 const post = loadPosts().find(p => p.categoryDir === cat && p.id === id);
                 if (!post) return null;
                 const raw = readHtmlFile(cat, post.file) || '';
                 const body = cleanTyporaHtml(extractBody(raw));
                 const related = loadPosts().filter(p => p.categoryDir === cat && p.id !== id).slice(0, 3);
                 return tpl.renderPost(post, body, related, DEV_BASE);
               },
    notFound:  () => tpl.render404(DEV_BASE),
  };
}

function route(urlPath) {
  const pathname = urlPath.split('?')[0].split('#')[0];
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/' || p === '/index.html') return { kind: 'page', fn: r => r.home() };
  if (p === '/browse') return { kind: 'page', fn: r => r.browse() };
  const cat = p.match(/^\/posts\/(tech|project|life)(?:\/index\.html)?$/);
  if (cat) return { kind: 'page', fn: r => r.category(cat[1]) };
  const post = p.match(/^\/posts\/(tech|project|life)\/(\d{3})(?:\/index\.html)?$/);
  if (post) return { kind: 'post', cat: post[1], id: post[2] };
  return null;
}

// ---- live reload（长轮询） ----
const reloadClients = new Set();
let reloadToken = Date.now();

function sumDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let s = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    try { s += entry.isDirectory() ? sumDir(fp) : fs.statSync(fp).mtimeMs; } catch (_) {}
  }
  return s;
}

function startWatcher() {
  const targets = [
    path.join(ROOT, 'src'),
    path.join(ROOT, 'posts'),
    path.join(ROOT, 'public'),
  ];
  let last = targets.reduce((a, d) => a + sumDir(d), 0);
  setInterval(() => {
    const now = targets.reduce((a, d) => a + sumDir(d), 0);
    if (now !== last) {
      last = now;
      reloadToken = Date.now();
      reloadClients.forEach(c => { try { c.end(String(reloadToken)); } catch (_) {} });
      reloadClients.clear();
      console.log('  🔄 文件变动，触发刷新');
    }
  }, 800);
}

// ---- HTTP Server ----
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url);

  // live reload 端点
  if (urlPath === '/_reload.js') {
    return send(res, 200, `(function(){var last=${reloadToken};function tick(){fetch('/_wait?t='+Date.now()).then(function(r){return r.text();}).then(function(tok){if(tok&&tok!==String(last)){location.reload();}else{tick();}}).catch(function(){setTimeout(tick,1000);});}tick();})();`, 'application/javascript; charset=utf-8');
  }
  if (urlPath.startsWith('/_wait')) {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-cache' });
    reloadClients.add(res);
    setTimeout(() => {
      if (reloadClients.has(res)) { reloadClients.delete(res); res.end(String(reloadToken)); }
    }, 30000);
    return;
  }

  // 静态资源
  if (urlPath.startsWith('/css/global.css')) return sendStatic(res, SRC_STYLES);
  if (urlPath.startsWith('/js/')) return sendStatic(res, path.join(PUBLIC_DIR, urlPath));
  if (urlPath === '/logo.svg') return sendStatic(res, path.join(PUBLIC_DIR, 'logo.svg')) || sendStatic(res, path.join(ROOT, 'logo.svg'));

  // 页面
  const r = renderAll();
  const matched = route(urlPath);
  let html = null;
  if (matched) {
    if (matched.kind === 'page') html = matched.fn(r);
    else if (matched.kind === 'post') html = r.post(matched.cat, matched.id);
    if (!html) html = r.notFound();
  } else {
    html = r.notFound();
  }
  html = html.replace('</body>', '<script src="/_reload.js"></script></body>');
  send(res, matched && (matched.kind === 'post' && !renderAll().post(matched.cat, matched.id)) ? 404 : (matched ? 200 : 404), html, 'text/html; charset=utf-8');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n🚀 Dev server ready`);
  console.log(`   → http://127.0.0.1:${PORT}/`);
  console.log(`   Ctrl+C 停止\n`);
});

startWatcher();
