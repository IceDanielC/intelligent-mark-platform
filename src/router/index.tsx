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
const DatasetSelect = lazy(() => import('@/pages/autoAnnotate/DatasetSelect'))
const MyDataset = lazy(() => import('@/pages/dataset/MyDataset'))
const ImportForm = lazy(() => import('@/pages/dataset/ImportForm'))
const Detail = lazy(() => import('@/pages/dataset/Detail'))
const GroupManage = lazy(() => import('@/pages/LabelGroup/GroupManage'))
const NewDataset = lazy(() => import('@/pages/dataset/NewDataset'))

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
        path: 'dataset/my-dataset',
        element: <MyDataset />
      },
      {
        path: 'dataset/my-dataset/:datasetId/import',
        element: <ImportForm />
      },
      {
        path: 'dataset/my-dataset/:dataset/:version/detail',
        element: <Detail />
      },
      {
        path: 'dataset/create',
        element: <NewDataset />
      },
      {
        path: 'auto-annotate/dataset-select',
        element: <DatasetSelect />
      },
      {
        path: 'auto-annotate/detail/:dataset/:version',
        element: <AutoAnnotate />
      },
      {
        path: 'label-group/management',
        element: <GroupManage />
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
