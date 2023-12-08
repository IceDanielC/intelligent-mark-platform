import { lazy } from 'react'
import {
  type LoaderFunction,
  createBrowserRouter,
  redirect
} from 'react-router-dom'
import { message } from 'antd'

import MainLayout from '../layouts/MainLayout'
import ManageLayout from '@/layouts/ManageLayout'
import Home from '@/pages/home/Home'
import Login from '@/pages/login/Login'
import NotFound from '../pages/NotFound'

const UserManagement = lazy(() => import('@/pages/authority/UserManagement'))
const RoleManagement = lazy(() => import('@/pages/authority/RoleManagement'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const AutoAnnotate = lazy(() => import('@/pages/autoAnnotate'))

const homeLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const user = localStorage.getItem('user/info')

  if (url.pathname === '/login') {
    if (user) return redirect('/manage/dashboard')
  }
  return {}
}

const manageLoader: LoaderFunction = async () => {
  const user = localStorage.getItem('user/info')
  if (!user) {
    message.error('身份信息失效，请重新登陆')
    return redirect('/')
  }
  return {}
}

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    loader: homeLoader,
    children: [
      {
        index: true,
        loader: () => redirect('/home')
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
  {
    path: '/manage',
    element: <ManageLayout />,
    loader: manageLoader,
    children: [
      {
        index: true,
        loader: () => redirect('/manage/dashboard')
      },
      {
        path: 'auth-management/user',
        element: <UserManagement />
      },
      {
        path: 'auth-management/role',
        element: <RoleManagement />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'auto-annotate',
        element: <AutoAnnotate />
      }
    ]
  },
  {
    path: '*', // 404 路由配置
    element: <NotFound />
  }
]

const router = createBrowserRouter(routes)

export default router

// 常用的路由，常量
export const HOME_PATHNAME = '/'
export const LOGIN_PATHNAME = '/login'
