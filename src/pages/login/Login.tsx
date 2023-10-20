import React, { useEffect } from 'react'
// import { useNavigate } from "react-router-dom";
import { Typography, Space, Form, Input, Button, Checkbox, message } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
// import { MANAGE_INDEX_PATHNAME } from "../router";
import { loginService } from '@/services/user'
import styles from './Login.module.scss'
import request from '@/utils/request'

const { Title } = Typography

export const USERNAME_KEY = 'USERNAME'
export const PASSWORD_KEY = 'PASSWORD'
export const ACCESS_TOKEN = 'access_token'
export const FRESH_TOKEN = 'fresh_token'

function rememberUser(username: string, password: string) {
  localStorage.setItem(USERNAME_KEY, username)
  localStorage.setItem(PASSWORD_KEY, password)
}

function deleteUserFromStorage() {
  localStorage.removeItem(USERNAME_KEY)
  localStorage.removeItem(PASSWORD_KEY)
}

function getUserInfoFromStorage() {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY)
  }
}

const Login: React.FC = () => {
  // const nav = useNavigate();
  const [form] = Form.useForm() // 第三方 hook

  useEffect(() => {
    const { username, password } = getUserInfoFromStorage()
    form.setFieldsValue({ username, password })
  }, [])

  const { run: userLogin, loading } = useRequest(
    async (username: string, password: string) => {
      const data = await loginService(username, password)
      return data
    },
    {
      manual: true,
      onSuccess(result) {
        if (result.code === 200) {
          const { accessToken, freshToken } = result.data
          localStorage.setItem(ACCESS_TOKEN, accessToken)
          localStorage.setItem(FRESH_TOKEN, freshToken)
          message.success('登录成功')
        }
      }
    }
  )

  const onFinish = (values: any) => {
    const { username, password, remember } = values || {}

    userLogin(username, password)
    if (remember) {
      rememberUser(username, password)
    } else {
      deleteUserFromStorage()
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <Space>
          <Title level={2}>
            <UserAddOutlined />
          </Title>
          <Title level={2}>用户登录</Title>
        </Space>
      </div>
      <div>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: false }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              {
                type: 'string',
                min: 5,
                max: 20,
                message: '字符长度在 5-20 之间'
              },
              { pattern: /^\w.+$/, message: '只能是字母数字下划线' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 6, span: 16 }}
          >
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                登录
              </Button>
              <Button
                type="link"
                size="middle"
                onClick={async () => {
                  const res = await request.get('/bulletin/items')
                  console.log(res)
                }}
              >
                忘记密码
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
