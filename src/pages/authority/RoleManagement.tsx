import { type Role, getRoleList } from '@/services/role'
import React from 'react'
import { useQuery } from 'react-query'
import type { ColumnsType } from 'antd/es/table'
import { Button, Space, Table, Tag } from 'antd'

const columns: ColumnsType<Role> = [
  {
    title: 'id',
    dataIndex: 'id'
  },
  {
    title: '角色名称',
    dataIndex: 'role',
    render(_dom, record) {
      return record.role === 'ADMIN' ? (
        <Tag color="volcano">{record.role}</Tag>
      ) : (
        <Tag color="cyan">{record.role}</Tag>
      )
    }
  },
  {
    title: '菜单权限',
    dataIndex: 'menuList',
    render: (_, { menuList }) => menuList.map((menu) => <Tag>{menu}</Tag>)
  },
  {
    title: '操作',
    dataIndex: '',
    key: 'action',
    width: '300px',
    render: (_, _record) => {
      return (
        <Space>
          <Button size="small" type="primary">
            编辑
          </Button>
          <Button size="small" type="primary" danger>
            删除
          </Button>
        </Space>
      )
    }
  }
]

const RoleManagement: React.FC = () => {
  const { data: roleList, isLoading } = useQuery({
    queryKey: ['/role/list'],
    queryFn: () => getRoleList().then((res) => res.data)
  })
  return <Table columns={columns} dataSource={roleList} loading={isLoading} />
}

export default RoleManagement
