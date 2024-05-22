import React, { Suspense, useEffect, useState } from 'react'
import {
  Layout,
  Menu,
  theme,
  Skeleton,
  message,
  Breadcrumb,
  Dropdown,
  Button,
  Avatar
} from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { menuItems } from './MenuItem'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useMenuStore } from '@/store/useMenuStore'

const { Sider, Content, Footer } = Layout

const Header: React.FC = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const username = localStorage.getItem('user/info')

  const handleLogout = () => {
    localStorage.removeItem('user/info')
    localStorage.removeItem('menu-store')
    message.info('User logged out!')
    navigate('/home')
  }

  return (
    <Layout.Header
      className="flex items-center justify-between"
      style={{
        background: colorBgContainer
      }}
    >
      <Breadcrumb
        items={[
          ...pathname
            .split('/')
            .slice(1)
            .map((item) => ({ title: decodeURIComponent(item) }))
        ]}
      />
      <Dropdown
        trigger={['click', 'hover']}
        menu={{
          items: [
            {
              key: 'logout',
              label: 'Logout',
              icon: <LogoutOutlined />,
              onClick: handleLogout
            }
          ]
        }}
      >
        <Button type="text" className="flex items-center !py-6">
          <Avatar icon={<UserOutlined />} />
          <span className="ml-4">{username ?? 'anonymous'}</span>
        </Button>
      </Dropdown>
    </Layout.Header>
  )
}

const ManageLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const location = useLocation()
  const { menus } = useMenuStore()
  const navigate = useNavigate()

  // 路由鉴权
  useEffect(() => {
    if (menus.length > 0) {
      if (
        !menus.includes(
          location.pathname.match(/(?<=(manage\/))[^/]+/)?.[0] ?? ''
        )
      ) {
        navigate('/403')
      }
    }
  }, [location.pathname])

  function getSeletedKeys() {
    return location.pathname.slice(8).split('/')
  }

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        <div
          style={{
            height: '32px',
            margin: '16px',
            background: 'rgba(255,255,255,.2)',
            borderRadius: '6px'
          }}
        ></div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSeletedKeys()}
          items={menuItems.filter((item) => menus.includes(item.key))}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 64px - 100px)',
            background: colorBgContainer,
            overflowX: 'hidden'
          }}
        >
          <Suspense fallback={<Skeleton active paragraph={{ rows: 8 }} />}>
            <Outlet />
          </Suspense>
        </Content>
        <Footer style={{ textAlign: 'center', marginTop: '-20px' }}>
          智能化病虫害标注与检测系统 ©2023 Created by ICE
        </Footer>
      </Layout>
    </Layout>
  )
}

export default ManageLayout
