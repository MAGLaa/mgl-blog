import DefaultTheme from 'vitepress/theme'
import { h, ref, onMounted, onUnmounted } from 'vue'
import './style.css'

// 阅读进度条组件
const ReadingProgress = {
  setup() {
    const progress = ref(0)
    let ticking = false

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      progress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll, { passive: true })
      updateProgress()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
    })

    return () =>
      h('div', {
        class: 'reading-progress',
        style: { width: `${progress.value}%` }
      })
  }
}

// 浮动装饰元素组件
const HeroDecorations = () =>
  h('div', { class: 'hero-decorations' },
    Array.from({ length: 8 }, (_, i) =>
      h('div', { class: `deco-shape deco-${i + 1}`, key: i })
    )
  )

const Layout = () =>
  h(DefaultTheme.Layout, null, {
    'layout-top': () => h(ReadingProgress),
    'home-hero-before': () => h(HeroDecorations),
  })

export default {
  ...DefaultTheme,
  Layout,
}
