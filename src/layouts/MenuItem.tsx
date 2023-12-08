import {
  DashboardOutlined,
  ExpandOutlined,
  UploadOutlined,
  UserOutlined
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
    key: 'auto-annotate',
    icon: <ExpandOutlined />,
    label: <NavLink to="/manage/auto-annotate">病虫害自动化标注</NavLink>
  },
  {
    key: '3',
    icon: <UploadOutlined />,
    label: 'nav 3'
  }
]
