import { RouterProvider } from 'react-router-dom'
import { App as AntdProvider, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import routerConfig from '@/router'

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AntdProvider>
        <RouterProvider router={routerConfig}></RouterProvider>
      </AntdProvider>
    </ConfigProvider>
  )
}

export default App
