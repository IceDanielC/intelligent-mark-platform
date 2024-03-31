import { User, registerUser } from '@/services/user'
import {
  ModalForm,
  ProForm,
  ProFormDependency,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components'
import { Button, message } from 'antd'

export const CreateUserModal: React.FC = () => {
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
