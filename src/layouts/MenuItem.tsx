import {
  DashboardOutlined,
  DatabaseOutlined,
  ExpandOutlined,
  OneToOneOutlined,
  TagsOutlined,
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
    key: 'dataset',
    label: '数据集管理',
    icon: <DatabaseOutlined />,
    children: [
      {
        key: 'my-dataset',
        label: <NavLink to="/manage/dataset/my-dataset">我的数据集</NavLink>
      },
      {
        key: 'create',
        label: <NavLink to="/manage/dataset/create">创建数据集</NavLink>
      }
    ]
  },
  {
    key: 'label-group',
    label: '标签组管理',
    icon: <TagsOutlined />,
    children: [
      {
        key: 'management',
        label: <NavLink to="/manage/label-group/management">我的标签组</NavLink>
      }
    ]
  },
  {
    key: 'auto-annotate',
    icon: <ExpandOutlined />,
    label: (
      <NavLink to="/manage/auto-annotate/dataset-select">
        病虫害自动化标注
      </NavLink>
    )
  },
  {
    key: 'high-precision-detection',
    icon: <OneToOneOutlined />,
    label: (
      <NavLink to="/manage/high-precision-detection/index">
        病虫害高精度检测
      </NavLink>
    )
  }
]
