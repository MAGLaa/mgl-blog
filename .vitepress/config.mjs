import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 自动从 markdown 文件中提取标题
function getTitleFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (fmMatch) {
      const titleMatch = fmMatch[1].match(/title:\s*(.+)/)
      if (titleMatch) return titleMatch[1].trim()
    }
    const h1Match = content.match(/^#\s+(.+)/m)
    if (h1Match) return h1Match[1].trim()
  } catch (e) {}
  return path.basename(filePath, '.md')
}

// 自动从 frontmatter 中提取日期
function getDateFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (fmMatch) {
      const dateMatch = fmMatch[1].match(/date:\s*(\S+)/)
      if (dateMatch) return dateMatch[1].trim()
    }
  } catch (e) {}
  return ''
}

// 自动扫描目录生成侧边栏
function generateSidebar() {
  const categories = [
    { dir: 'posts/tech', text: '技术笔记' },
    { dir: 'posts/life', text: '生活随笔' }
  ]

  const sidebar = {}

  categories.forEach(({ dir, text }) => {
    const fullDir = path.resolve(dir)
    if (!fs.existsSync(fullDir)) return

    const files = fs.readdirSync(fullDir)
      .filter(f => f.endsWith('.md') && f !== 'index.md')
      .map(f => {
        const filePath = path.join(fullDir, f)
        return {
          file: f,
          title: getTitleFromFile(filePath),
          date: getDateFromFile(filePath)
        }
      })
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    sidebar[`/${dir}/`] = [
      {
        text,
        items: files.map(({ file, title }) => ({
          text: title,
          link: `/${dir}/${file.replace('.md', '')}`
        }))
      }
    ]
  })

  return sidebar
}

export default defineConfig({
  title: 'MGL的博客',
  description: 'MGL的个人博客 - 技术笔记、生活随笔、架构探索',
  lang: 'zh-CN',
  base: '/mgl-blog/',

  // 仅使用浅色模式
  appearance: false,

  // 清理 URL
  cleanUrls: true,

  // 忽略死链检查（开发阶段）
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/mgl-blog/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#8d7b9e' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'MGL的博客' }],
    ['meta', { property: 'og:description', content: '探索技术 · 记录生活 · 永远好奇，永远热血' }],
    ['meta', { property: 'og:site_name', content: 'MGL的博客' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: 'MGL的博客' }],
    ['meta', { name: 'twitter:description', content: '探索技术 · 记录生活 · 永远好奇，永远热血' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'MGL',

    nav: [
      { text: '首页', link: '/' },
      { text: '技术笔记', link: '/posts/tech/' },
      { text: '生活随笔', link: '/posts/life/' },
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],

    footer: {
      message: '用代码书写无限可能 ✨ 基于 VitePress 构建',
      copyright: '© 2026 MGL · All Rights Reserved'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文章',
            buttonAriaLabel: '搜索文章'
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    outline: {
      label: '本页目录',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单'
  },

  markdown: {
    lineNumbers: true
  },

  vite: {
    server: {
      port: 5173
    }
  }
})
