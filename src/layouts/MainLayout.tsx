import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Logo from '../components/Logo'
import styles from './MainLayout.module.scss'

const { Header, Content, Footer } = Layout

const MainLayout: React.FC = () => {
  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
      </Header>
      <Content className={styles.main}>
        <Outlet />
      </Content>
      <Footer className={styles.footer}>
        智能化病虫害标注与检测系统 &copy;2023 - present. Created by Ice
      </Footer>
    </Layout>
  )
}

export default MainLayout
