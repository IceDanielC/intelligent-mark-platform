import React, { useEffect } from 'react'
// import { useNavigate } from "react-router-dom";
import { Typography, Space, Form, Input, Button, message } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
// import { MANAGE_INDEX_PATHNAME } from "../router";
import {
  User,
  getMinioServerToken,
  loginService,
  registerUser
} from '@/services/user'
import styles from './Login.module.scss'
import { useNavigate } from 'react-router-dom'
import {
  ModalForm,
  ProForm,
  ProFormDependency,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components'

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

const CreateUserModal: React.FC = () => {
  return (
    <ModalForm
      title={'新用户注册'}
      width={450}
      trigger={
        <Button type="link" size="middle">
          新用户注册
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={async (values: User) => {
        if (values.isAdmin) {
          console.log(values.checkNumber)

          if (values.checkNumber !== '20011001') {
            message.warning('权限验证码不正确')
            return false
          }
        }
        const res = await registerUser(values)
        if (res.code === 200) {
          message.success('注册成功')
          return true
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          required
          width="md"
          rules={[
            {
              required: true,
              message: '用户名不能低于5位',
              min: 5
            }
          ]}
          name="username"
          label="用户名"
          tooltip="最长为 12 位"
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText.Password
          required
          width="md"
          rules={[
            {
              required: true,
              message: '密码不能低于6位',
              min: 6
            }
          ]}
          name="password"
          label="密码"
          placeholder="请输入密码"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSwitch
          name="isAdmin"
          label="是否注册为管理员"
          initialValue={false}
        />
        <ProFormDependency name={['isAdmin']}>
          {({ isAdmin }) => {
            return isAdmin ? (
              <ProForm.Group>
                <ProFormText
                  required
                  width="md"
                  rules={[
                    {
                      required: true,
                      message: '请输入权限验证码'
                    }
                  ]}
                  name="checkNumber"
                  label="权限验证码"
                  placeholder="请输入权限验证码"
                />
              </ProForm.Group>
            ) : null
          }}
        </ProFormDependency>
      </ProForm.Group>
    </ModalForm>
  )
}

const Login: React.FC = () => {
  const navigator = useNavigate()
  const [form] = Form.useForm() // 第三方 hook

  useEffect(() => {
    const { username, password } = getUserInfoFromStorage()
    form.setFieldsValue({ username, password })
  }, [])

  const { run: userLogin, loading } = useRequest(
    async (username: string, password: string) => {
      const data = await loginService(username, password)
      await getMinioServerToken()
      return data
    },
    {
      manual: true,
      onSuccess(result) {
        if (result.code === 200) {
          const { accessToken, freshToken, username } = result.data
          localStorage.setItem(ACCESS_TOKEN, accessToken)
          localStorage.setItem(FRESH_TOKEN, freshToken)
          localStorage.setItem('user/info', username as string)
          navigator('/manage')
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
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                登录
              </Button>
              <CreateUserModal />
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
