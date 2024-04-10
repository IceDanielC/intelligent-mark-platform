import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'

const UnAuthorize: React.FC = () => {
  const nav = useNavigate()

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您无权访问当前页面"
      extra={
        <Button type="primary" onClick={() => nav('/')}>
          返回首页
        </Button>
      }
    ></Result>
  )
}

export default UnAuthorize
