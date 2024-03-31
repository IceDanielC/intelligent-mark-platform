import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    importToCDN({
      modules: [autoComplete('react'), autoComplete('react-dom')]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src')
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection', // 后端服务实际地址
        changeOrigin: true, // 控制服务器收到的请求头中Host字段的值
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
