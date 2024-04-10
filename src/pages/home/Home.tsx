import { useNavigate } from 'react-router-dom'
import { Button, Typography } from 'antd'
import { LOGIN_PATHNAME } from '@/router'
import styles from './Home.module.scss'
import { FireOutlined } from '@ant-design/icons'

const { Title } = Typography

const Home: React.FC = () => {
  const navigator = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Title>智能化病虫害标注与检测系统 | 在线标注</Title>
        <div>
          <Button
            type="primary"
            shape="round"
            onClick={() =>
              navigator(
                localStorage.getItem('user/info') ? '/manage' : LOGIN_PATHNAME
              )
            }
            style={{ padding: '0 2rem' }}
          >
            <FireOutlined />
            开始使用
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home
