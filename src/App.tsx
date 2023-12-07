import { RouterProvider } from 'react-router-dom'
import { App as AntdProvider, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import routerConfig from '@/router'
import { QueryClient, QueryClientProvider } from 'react-query'

// Create a client
const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AntdProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={routerConfig}></RouterProvider>
        </QueryClientProvider>
      </AntdProvider>
    </ConfigProvider>
  )
}

export default App
