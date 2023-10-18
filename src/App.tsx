import { RouterProvider } from 'react-router-dom'
import routerConfig from '@/router'

const App: React.FC = () => {
  return <RouterProvider router={routerConfig}></RouterProvider>
}

export default App
