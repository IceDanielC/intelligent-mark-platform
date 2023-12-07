import {
  DashboardOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

export const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: <NavLink to="/manage/dashboard">Dashboard</NavLink>
  },
  {
    key: 'auth-management',
    icon: <UserOutlined />,
    label: '权限管理',
    children: [
      {
        key: 'user',
        label: <NavLink to="/manage/auth-management/user">用户管理</NavLink>
      },
      {
        key: 'role',
        label: <NavLink to="/manage/auth-management/role">角色管理</NavLink>
      }
    ]
  },
  {
    key: '2',
    icon: <VideoCameraOutlined />,
    label: 'nav 2'
  },
  {
    key: '3',
    icon: <UploadOutlined />,
    label: 'nav 3'
  }
]
