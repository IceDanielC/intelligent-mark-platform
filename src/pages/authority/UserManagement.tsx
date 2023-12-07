import type { ProColumns } from '@ant-design/pro-components'
import { App, Popconfirm, Tag } from 'antd'
import { EditableProTable } from '@ant-design/pro-components'
import { useRef } from 'react'
import { useQuery, useQueryClient } from 'react-query'

import {
  type User,
  getAllUsers,
  updateUsers,
  deleteUser
} from '@/services/user'

const roleOptions = [
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'USER', value: 'USER' }
]

export default () => {
  const { message } = App.useApp()
  const { data: userList, isFetching } = useQuery({
    queryKey: ['/user/list'],
    queryFn: () => getAllUsers().then((res) => res.data)
  })
  const queryClient = useQueryClient()

  const formRef = useRef<any>(null)

  const handleDelete = async (id: number) => {
    const res = await deleteUser(id)
    if (res.code === 200) {
      queryClient.invalidateQueries(['/user/list'])
      message.success('删除成功')
    } else {
      message.error('删除失败')
    }
  }

  const columns: ProColumns<User>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      readonly: true,
      width: '10%'
    },
    {
      title: '用户名称',
      dataIndex: 'username',
      formItemProps: (_form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : []
        }
      },
      // 第一行不允许编辑
      editable: (_text, _record, index) => {
        return index !== 0
      },
      width: '20%'
    },
    {
      title: '用户密码',
      dataIndex: 'password',
      formItemProps: (_form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : []
        }
      },
      // 第一行不允许编辑
      editable: (_text, _record, index) => {
        return index !== 0
      },
      width: '20%',
      valueType: 'password'
    },
    {
      title: '用户权限',
      key: 'role',
      dataIndex: 'role',
      valueType: 'select',
      fieldProps: () => {
        return {
          options: roleOptions
        }
      },
      // 第一行不允许编辑
      editable: (_text, _record, index) => {
        return index !== 0
      },
      formItemProps: (_form, { rowIndex }) => {
        return {
          rules:
            rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : []
        }
      },
      render(_dom, record) {
        return record.role === 'ADMIN' ? (
          <Tag color="volcano">{record.role}</Tag>
        ) : (
          <Tag color="cyan">{record.role}</Tag>
        )
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            if (record.id === 1 || record.id === 2) {
              message.warning('此条数据不能修改')
              return
            }
            action?.startEditable?.(record.id)
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="删除用户"
          description={`您确定要删除 ${record.username} ?`}
          onConfirm={() => handleDelete(record.id as number)}
          okText="Yes"
          cancelText="No"
        >
          <a
            onClick={() => {
              if (record.id === 1 || record.id === 2) {
                message.warning('此条数据不能修改')
                return
              }
            }}
          >
            删除
          </a>
        </Popconfirm>
      ]
    }
  ]

  return (
    <>
      <EditableProTable<User>
        editableFormRef={formRef}
        rowKey="id"
        headerTitle="用户管理"
        scroll={{
          x: 960
        }}
        loading={isFetching}
        columns={columns}
        value={userList}
        recordCreatorProps={{
          // @ts-ignore
          record: () => ({ id: '-' }),
          creatorButtonText: '新增用户'
        }}
        editable={{
          type: 'single',
          onSave: async (rowKey, data) => {
            if (data.id === '-') {
              // @ts-ignore
              data.id = null
            }
            const res = await updateUsers(data)
            if (res.code === 200) {
              queryClient.invalidateQueries(['/user/list'])
              message.success('修改用户信息成功')
              formRef.current.setRowData(rowKey, {
                username: '',
                password: '',
                role: ''
              })
            } else {
              message.error('修改用户信息失败')
            }
          }
        }}
      />
    </>
  )
}
