/**
 * 文章数据加载模块（CommonJS）
 * 负责从 posts/ 目录扫描 HTML 文件并解析元数据
 */
const { readFileSync, readdirSync, existsSync } = require('fs');
const { resolve, basename, join } = require('path');

const projectRoot = process.cwd();
const postsDir = join(projectRoot, 'posts');

/** 分类目录 → 中文名称映射 */
const CATEGORY_MAP = {
  'tech': '技术笔记',
  'project': '项目实战',
  'life': '生活随笔'
};

/**
 * 从 HTML 内容中提取纯文本
 */
function extractTextFromHtml(html) {
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * 从文件名解析元数据
 */
function parseFileName(fileName) {
  const nameWithoutExt = basename(fileName, '.html');
  const parts = nameWithoutExt.split('-');

  let date = '';
  let slugStartIdx = 0;

  if (parts.length >= 3) {
    const potentialDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
    if (/^\d{4}-\d{2}-\d{2}$/.test(potentialDate)) {
      const d = new Date(potentialDate);
      if (!isNaN(d.getTime())) {
        date = potentialDate;
        slugStartIdx = 3;
      }
    }
  }

  const titleParts = parts.slice(slugStartIdx);
  const title = titleParts.map(part => {
    return part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
  }).join(' ') || nameWithoutExt;

  return { date, title, slug: titleParts.join('-') || nameWithoutExt };
}

/**
 * 字数统计
 */
function countWords(text) {
  const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return { chinese: chineseChars, english: englishWords, total: chineseChars + englishWords };
}

/** 估算阅读时间 */
function estimateReadingTime(text) {
  const { chinese, english } = countWords(text);
  const minutes = Math.max(1, Math.ceil(chinese / 500 + english / 200));
  return `${minutes} 分钟`;
}

/**
 * 提取文章摘要
 */
function extractSummary(text) {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length > 200) {
    return cleaned.slice(0, 200) + '...';
  }
  return cleaned;
}

/**
 * 加载所有文章数据
 */
function loadPosts() {
  const posts = [];
  let idCounter = 0;

  for (const [dir, categoryName] of Object.entries(CATEGORY_MAP)) {
    const fullDir = join(postsDir, dir);
    if (!existsSync(fullDir)) continue;

    const files = readdirSync(fullDir).filter(f => f.endsWith('.html') && f !== 'index.html');

    for (const file of files) {
      try {
        const filePath = join(fullDir, file);
        const raw = readFileSync(filePath, 'utf-8');
        const htmlContent = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
        const { date, title, slug } = parseFileName(file);

        idCounter++;
        const id = String(idCounter).padStart(3, '0');
        const url = `/posts/${dir}/${id}`;
        const plainText = extractTextFromHtml(htmlContent);

        posts.push({
          file,
          title: title || slug,
          date,
          tags: [],
          category: categoryName,
          categoryDir: dir,
          summary: extractSummary(plainText),
          readingTime: estimateReadingTime(plainText),
          slug,
          id,
          url,
        });
      } catch (e) {
        console.warn(`[posts] 解析失败: ${dir}/${file} — ${e.message}`);
      }
    }
  }

  posts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  // 重新分配 ID 基于排序后的顺序
  posts.forEach((post, index) => {
    post.id = String(index + 1).padStart(3, '0');
    post.url = `/posts/${post.categoryDir}/${post.id}`;
  });

  return posts;
}

/**
 * 按分类获取文章
 */
function getPostsByCategory(categoryDir) {
  const posts = loadPosts();
  return posts.filter(p => p.categoryDir === categoryDir);
}

/**
 * 获取单篇文章
 */
function getPost(categoryDir, slug) {
  const posts = loadPosts();
  return posts.find(p => p.categoryDir === categoryDir && p.slug === slug);
}

/**
 * 读取 HTML 文件内容
 */
function readHtmlFile(categoryDir, fileName) {
  const filePath = join(postsDir, categoryDir, fileName);
  if (existsSync(filePath)) {
    return readFileSync(filePath, 'utf-8');
  }
  return null;
}

/**
 * 获取所有分类
 */
function getCategories() {
  return Object.entries(CATEGORY_MAP).map(([dir, name]) => ({
    dir,
    name,
    count: loadPosts().filter(p => p.categoryDir === dir).length
  }));
}

module.exports = {
  loadPosts,
  getPostsByCategory,
  getPost,
  readHtmlFile,
  getCategories,
  CATEGORY_MAP,
  postsDir,
  projectRoot,
};
