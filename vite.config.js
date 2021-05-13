import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markdown from 'vite-plugin-md'
import pages from 'vite-plugin-pages'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/'

loadLanguages(['elixir', 'shell'])

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'docs'
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    pages({
      pagesDir: 'src/views',
      extensions: ['vue', 'md']
    }),
    markdown({
      markdownItOptions: {
        highlight(str, language) {
          const grammar = Prism.languages[language]
          return Prism.highlight(str, grammar, language)
        }
      }
    })
  ]
})
