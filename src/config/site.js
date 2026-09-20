/**
 * 站点配置
 */
export const siteConfig = {
  title: 'MGL的博客',
  description: 'MGL的个人博客 - 技术笔记、项目实战、生活随笔',
  base: '/mgl-blog/',

  nav: [
    { text: '首页', link: '/' },
    { text: '技术笔记', link: '/posts/tech/' },
    { text: '项目实战', link: '/posts/project/' },
    { text: '生活随笔', link: '/posts/life/' },
  ],

  footer: {
    message: '用代码书写无限可能 ✨ 基于 Astro 构建',
    copyright: '© 2026 MGL · All Rights Reserved'
  },

  categories: {
    tech: {
      name: '技术笔记',
      icon: '⚡',
      description: '编程修炼、架构探索、AI 实践、Bug 攻克，用技术改变世界'
    },
    project: {
      name: '项目实战',
      icon: '🚀',
      description: '完整项目开发流程、实战经验总结、踩坑记录与解决方案'
    },
    life: {
      name: '生活随笔',
      icon: '🌈',
      description: '生活灵感、读书心得、兴趣探索，记录每一刻精彩'
    }
  }
};
