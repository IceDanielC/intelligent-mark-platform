import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    importToCDN({
      modules: [
        // autoComplete('react'),
        // autoComplete('react-dom'),
        // autoComplete('ahooks'),
        // autoComplete('axios')
      ]
    }),
    visualizer({
      // open: true, //注意这里要设置为true，否则无效
      filename: 'stats.html', //分析图生成的文件名
      gzipSize: true, // 收集 gzip 大小并将其显示
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
  },
  build: {
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // manualChunks(id) {
        //   // if (id.includes('node_modules/axios')) {
        //   //   return 'axios'
        //   // }
        //   // if (id.includes('node_modules/ahooks')) {
        //   //   return 'ahooks'
        //   // }
        //   // if (id.includes('node_modules/lodash-es')) {
        //   //   return 'lodash-es'
        //   // }
        //   // if (id.includes('node_modules/antd')) {
        //   //   return 'antd'
        //   // }
        // }
      }
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      // 清除console和debugger
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
