/**
 * 渲染函数集合（零依赖）
 * 每个函数接收数据，返回完整 HTML 字符串
 * base 参数在 build 时是 '/mgl-blog/'，dev 时是 '/'
 */
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const { siteConfig: siteCfg } = require(path.join(ROOT, 'src', 'config', 'site.js'));
const postsMod = require(path.join(ROOT, 'src', 'lib', 'posts.js'));

function renderNavLogo() {
  return `<div class="nav-logo">
  <span class="nav-prompt">>_</span>
  <span class="nav-typing">MGL<span class="nav-cur"></span></span>
  <span class="nav-sep"></span>
  <span class="nav-sub">用代码书写无限可能</span>
</div>`;
}

function renderHeroLogo() {
  return `<div class="logo-card">
  <div class="logo-accent"></div>
  <div class="logo-inner">
    <div class="logo-bar">
      <span class="logo-d r"></span>
      <span class="logo-d y"></span>
      <span class="logo-d g"></span>
      <span class="logo-fname">mgl.py</span>
    </div>
    <div class="logo-code">
      <div class="logo-ln">
        <span class="logo-nr">1</span>
        <span class="logo-k">class</span> <span class="logo-c">MGL</span><span class="logo-o">:</span>
      </div>
      <div class="logo-ln">
        <span class="logo-nr">2</span>
        <span class="logo-s">  "用代码书写无限可能"</span>
        <span class="logo-cur"></span>
      </div>
    </div>
    <div class="logo-tag">
      <span class="logo-t">探索技术</span>
      <span class="logo-td"></span>
      <span class="logo-t">记录生活</span>
      <span class="logo-td"></span>
      <span class="logo-t">永远好奇</span>
      <span class="logo-th"># ∞</span>
    </div>
  </div>
</div>`;
}

/**
 * 基础布局
 */
function renderLayout({ title, description, base, innerHTML, extraHead = '', extraBody = '' }) {
  const pageTitle = title ? `${title} | ${siteCfg.title}` : siteCfg.title;
  const pageDesc = description || siteCfg.description;
  const b = base.endsWith('/') ? base : base + '/';

  const navLinks = siteCfg.nav.map(item => {
    const link = item.link.replace(/^\/+/, '');
    return `<li><a href="${b}${link}">${item.text}</a></li>`;
  }).join('\n          ');

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${pageDesc}" />
    <link rel="icon" href="${b}logo.svg" />
    <meta name="theme-color" content="#8d7b9e" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${pageTitle}" />
    <meta property="og:description" content="${pageDesc}" />
    <meta property="og:site_name" content="${siteCfg.title}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${pageTitle}" />
    <meta name="twitter:description" content="${pageDesc}" />
    <link rel="stylesheet" href="${b}css/global.css" />
    <title>${pageTitle}</title>
    ${extraHead}
  </head>
  <body>
    <nav class="nav">
      <div class="nav-container">
        <a href="${b}" class="nav-brand">${renderNavLogo()}</a>
        <ul class="nav-links">
          ${navLinks}
        </ul>
        <a href="${b}browse" class="nav-search nav-browse" title="文章树">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7h18M3 12h18M3 17h18"></path>
            <circle cx="6" cy="7" r="1.5" fill="currentColor"></circle>
            <circle cx="6" cy="12" r="1.5" fill="currentColor"></circle>
            <circle cx="6" cy="17" r="1.5" fill="currentColor"></circle>
            <circle cx="18" cy="7" r="1.5" fill="currentColor"></circle>
            <circle cx="18" cy="12" r="1.5" fill="currentColor"></circle>
            <circle cx="18" cy="17" r="1.5" fill="currentColor"></circle>
          </svg>
          <span>文章树</span>
        </a>
      </div>
    </nav>

    <main class="main-content">
      ${innerHTML}
    </main>

    <footer class="footer">
      <p>${siteCfg.footer.message}</p>
      <p class="copyright">${siteCfg.footer.copyright}</p>
    </footer>

    <script>window.__SITE_BASE__ = '${b}';</script>
    ${extraBody}
  </body>
</html>`;
}

/** 首页 */
function renderHome(base) {
  const b = base.endsWith('/') ? base : base + '/';
  const actionsHtml = [
    { theme: 'brand', text: '🚀 开始探索', link: 'posts/tech/' },
    { theme: 'alt', text: '🧪 项目实战', link: 'posts/project/' },
    { theme: 'alt', text: '🌈 生活随笔', link: 'posts/life/' },
  ].map(a => `<a href="${b}${a.link}" class="btn btn-${a.theme}">${a.text}</a>`).join('\n        ');

  const featuresHtml = Object.entries(siteCfg.categories).map(([dir, f], i) =>
    `<a href="${b}posts/${dir}/" class="feature-card" style="animation-delay: ${0.2 + i * 0.15}s">
        <div class="feature-icon">${f.icon}</div>
        <h3 class="feature-title">${f.name}</h3>
        <p class="feature-details">${f.description}</p>
      </a>`
  ).join('\n    ');

  const inner = `<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-bg-2"></div>
  <div class="hero-content">
    <div class="hero-logo">${renderHeroLogo()}</div>
    <div class="hero-actions">
      ${actionsHtml}
    </div>
  </div>
</section>
<section class="features">
    ${featuresHtml}
</section>`;

  return renderLayout({ title: null, description: siteCfg.description, base, innerHTML: inner });
}

/** 文章列表卡片 */
function renderPostList(posts, base) {
  const b = base.endsWith('/') ? base : base + '/';
  function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${y} 年 ${parseInt(m)} 月 ${parseInt(day)} 日`;
  }
  if (!posts.length) return `<div class="empty-state"><p>暂无文章</p></div>`;
  const cards = posts.map(p => `
        <a href="${b}${p.url.replace(/^\//, '')}/" class="post-card">
          <div class="post-card-header">
            <h3 class="post-card-title">${p.title}</h3>
            <span class="post-card-date">${formatDate(p.date)}</span>
          </div>
          ${p.summary ? `<p class="post-card-summary">${p.summary}</p>` : ''}
          <div class="post-card-footer">
            <span class="post-card-reading-time">📖 ${p.readingTime}</span>
            <span class="post-card-category">${p.category}</span>
          </div>
        </a>`).join('\n');
  return `<div class="post-list"><div class="posts-grid">${cards}\n  </div></div>`;
}

/** 分类列表页 */
function renderCategory(categoryDir, posts, base) {
  const b = base.endsWith('/') ? base : base + '/';
  const c = siteCfg.categories[categoryDir];
  const inner = `<div class="category-page">
    <header class="category-header">
      <h1>${c.icon} ${c.name}</h1>
      <p class="category-desc">${c.description}</p>
      <span class="post-count">共 ${posts.length} 篇文章</span>
    </header>
    ${renderPostList(posts, base)}
  </div>`;
  return renderLayout({ title: `${c.icon} ${c.name}`, description: c.description, base, innerHTML: inner });
}

/** 文章树浏览 */
function renderBrowse(base) {
  const b = base.endsWith('/') ? base : base + '/';
  const allPosts = postsMod.loadPosts();

  function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${y}-${parseInt(m)}-${parseInt(day)}`;
  }

  const groups = Object.entries(siteCfg.categories).map(([dir, cfg]) => {
    const ps = allPosts.filter(p => p.categoryDir === dir);
    const postsHtml = ps.length > 0 ? ps.map(p => `
                  <a href="${b}${p.url.replace(/^\//, '')}/" class="tree-post" data-category="${dir}">
                    <span class="tree-post-dot">•</span>
                    <span class="tree-post-title">${p.title}</span>
                    <span class="tree-post-meta">
                      ${p.date ? `<span class="tree-post-date">${formatDate(p.date)}</span>` : ''}
                      <span class="tree-post-time">📖 ${p.readingTime}</span>
                    </span>
                  </a>`).join('\n') : `<div class="tree-empty">暂无文章</div>`;

    return `<div class="tree-category" data-category="${dir}">
          <div class="tree-category-header">
            <button class="tree-toggle" aria-label="展开/折叠">
              <svg class="tree-arrow" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <span class="tree-icon">${cfg.icon}</span>
            <span class="tree-category-name">${cfg.name}</span>
            <span class="tree-count">${ps.length}</span>
          </div>
          <div class="tree-posts">${postsHtml}
          </div>
        </div>`;
  }).join('\n');

  const inner = `<div class="tree-page">
    <header class="tree-header">
      <h1>📁 文章树</h1>
      <p class="tree-desc">按分类浏览所有文章，点击箭头展开/折叠</p>
      <div class="tree-actions">
        <button class="tree-btn" id="expandAll">全部展开</button>
        <button class="tree-btn" id="collapseAll">全部折叠</button>
      </div>
    </header>
    <div class="tree-container">
        ${groups}
    </div>
  </div>`;

  const clientScript = `<script>
document.addEventListener('DOMContentLoaded', () => {
  var cats = document.querySelectorAll('.tree-category');
  if (cats.length > 0) {
    cats[0].classList.add('expanded');
    var a = cats[0].querySelector('.tree-arrow');
    if (a) a.style.transform = 'rotate(90deg)';
  }
  cats.forEach(function(c) {
    var header = c.querySelector('.tree-category-header');
    var arrow = c.querySelector('.tree-arrow');
    header.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      var on = c.classList.toggle('expanded');
      if (arrow) arrow.style.transform = on ? 'rotate(90deg)' : 'rotate(0deg)';
    });
  });
  var ea = document.getElementById('expandAll');
  if (ea) ea.addEventListener('click', function() { cats.forEach(function(c) { c.classList.add('expanded'); var a = c.querySelector('.tree-arrow'); if (a) a.style.transform = 'rotate(90deg)'; }); });
  var ca = document.getElementById('collapseAll');
  if (ca) ca.addEventListener('click', function() { cats.forEach(function(c) { c.classList.remove('expanded'); var a = c.querySelector('.tree-arrow'); if (a) a.style.transform = 'rotate(0deg)'; }); });
  document.querySelectorAll('.tree-post').forEach(function(p) { p.addEventListener('click', function(e) { e.stopPropagation(); }); });
});
</script>`;

  return renderLayout({ title: '文章树', description: '按分类浏览所有文章', base, innerHTML: inner, extraBody: clientScript });
}

/** 文章详情页 */
function renderPost(post, htmlBody, relatedPosts, base) {
  const b = base.endsWith('/') ? base : base + '/';

  function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${y} 年 ${parseInt(m)} 月 ${parseInt(day)} 日`;
  }

  const relatedHtml = relatedPosts && relatedPosts.length > 0 ? `
    <section class="related-posts">
      <h3>📚 相关文章</h3>
      <div class="related-grid">
        ${relatedPosts.map(r => `<a href="${b}${r.url.replace(/^\//, '')}/" class="related-card">
          <span class="related-title">${r.title}</span>
          <span class="related-date">${formatDate(r.date)}</span>
        </a>`).join('\n        ')}
      </div>
    </section>` : '';

  const inner = `
<div class="reading-progress" id="readingProgress"></div>
<button class="back-to-top" id="backToTop" aria-label="回到顶部">↑</button>
<nav class="toc-sidebar" id="tocSidebar"><h4>📑 目录</h4><ul id="tocList"></ul></nav>

<article class="post-page">
  <header class="post-header">
    <div class="post-meta">
      <span>📅 ${formatDate(post.date) || '未知日期'}</span>
      <span>📖 ${post.readingTime}</span>
      <span>🏷️ ${post.category}</span>
    </div>
    <h1 class="post-title">${post.title}</h1>
  </header>
  <div class="post-content">
    <div class="html-content">${htmlBody}</div>
  </div>
  ${relatedHtml}
</article>`;

  return renderLayout({
    title: post.title,
    description: post.summary,
    base,
    innerHTML: inner,
    extraBody: `<script src="${b}js/post-enhance.js"></script>`
  });
}

/** 404 */
function render404(base) {
  const b = base.endsWith('/') ? base : base + '/';
  const inner = `<div class="not-found">
    <div class="error-code">404</div>
    <div class="error-emoji">🚀</div>
    <h1 class="error-title">页面飞到外太空了</h1>
    <p class="error-desc">你访问的页面不存在或已被移动。<br/>别担心，让我们回到安全的港湾。</p>
    <div class="error-actions">
      <a href="${b}" class="btn-home">🏠 回到首页</a>
      <a href="${b}posts/tech/" class="btn-tech">⚡ 看看技术文章</a>
    </div>
  </div>`;
  return renderLayout({ title: '404', description: '页面不存在', base, innerHTML: inner });
}

module.exports = {
  renderLayout,
  renderHome,
  renderCategory,
  renderBrowse,
  renderPost,
  render404,
};
