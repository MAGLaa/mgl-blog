/**
 * 文章详情页的客户端增强脚本
 * （从原文章详情页的内联脚本提取）
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.html-content');
    if (!content) return;

    // ===== 1. 阅读进度条 + 回到顶部 =====
    const progressBar = document.getElementById('readingProgress');
    const backToTopBtn = document.getElementById('backToTop');

    function updateScrollProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressBar) progressBar.style.width = progress + '%';
      if (backToTopBtn) {
        if (scrollTop > 300) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ===== 2. 代码块复制 =====
    const codeBlocks = content.querySelectorAll('pre');
    codeBlocks.forEach((block, index) => {
      const codeElement = block.querySelector('code');
      if (!codeElement) return;
      const langMatch = codeElement.className.match(/language-(\w+)/);
      const lang = langMatch ? langMatch[1] : '';

      const header = document.createElement('div');
      header.className = 'code-header';
      const langLabel = document.createElement('span');
      langLabel.className = 'code-lang';
      langLabel.textContent = lang || 'code';
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy';
      copyBtn.textContent = '复制';
      copyBtn.addEventListener('click', () => {
        const text = codeElement.textContent;
        const done = () => {
          copyBtn.textContent = '已复制 ✓';
          copyBtn.classList.add('copied');
          setTimeout(() => { copyBtn.textContent = '复制'; copyBtn.classList.remove('copied'); }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(fallback);
        } else {
          fallback();
        }
        function fallback() {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          done();
        }
      });
      header.appendChild(langLabel);
      header.appendChild(copyBtn);
      block.insertBefore(header, codeElement);
    });

    // ===== 3. 图片灯箱 =====
    content.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.className = 'img-lightbox';
        const enlargedImg = document.createElement('img');
        enlargedImg.src = img.src;
        enlargedImg.alt = img.alt || '';
        lightbox.appendChild(enlargedImg);
        document.body.appendChild(lightbox);
        lightbox.addEventListener('click', () => document.body.removeChild(lightbox));
      });
    });

    // ===== 4. 目录导航 =====
    const tocList = document.getElementById('tocList');
    const tocSidebar = document.getElementById('tocSidebar');
    const headings = content.querySelectorAll('h2, h3, h4');
    if (headings.length > 2 && tocList && tocSidebar) {
      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = 'heading-' + index;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
        const level = heading.tagName.toLowerCase();
        a.classList.add('toc-' + level);
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(heading.id);
          if (target) {
            const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        });
        li.appendChild(a);
        tocList.appendChild(li);
      });
      tocSidebar.classList.add('visible');

      const tocLinks = tocList.querySelectorAll('a');
      const ob = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
          }
        });
      }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });
      headings.forEach(h => ob.observe(h));
    }

    // ===== 5. 数学公式 =====
    if (content.querySelector('script[type="math/tex"]') && !window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.onload = () => window.MathJax && window.MathJax.typesetPromise && window.MathJax.typesetPromise([content]);
      document.head.appendChild(script);
    }
  });
})();
