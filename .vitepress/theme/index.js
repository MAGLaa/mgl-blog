import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './style.css'

// 浮动装饰元素组件
const HeroDecorations = () =>
  h('div', { class: 'hero-decorations' },
    Array.from({ length: 6 }, (_, i) =>
      h('div', { class: 'deco-shape', key: i })
    )
  )

const Layout = () =>
  h(DefaultTheme.Layout, null, {
    'home-hero-before': () => h(HeroDecorations),
  })

export default {
  ...DefaultTheme,
  Layout,
}
