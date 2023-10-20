import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'

const NotFound: React.FC = () => {
  const nav = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在"
      extra={
        <Button type="primary" onClick={() => nav('/')}>
          返回首页
        </Button>
      }
    ></Result>
  )
}

export default NotFound
