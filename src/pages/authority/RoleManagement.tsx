import { type Role, getRoleList, updateRole } from '@/services/role'
import React, { useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { App, Button, Input, type InputRef, Popconfirm, Space, Tag } from 'antd'
import { EditableProTable, type ProColumns } from '@ant-design/pro-components'

const TagList: React.FC<{
  tags?: {
    key: string
    label: string
  }[]
  onChange?: (menus: string[]) => void
}> = ({ tags, onChange }) => {
  const ref = useRef<InputRef | null>(null)
  const [inputValue, setInputValue] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    let tempsTags = [...(tags || [])]
    if (
      inputValue &&
      tempsTags.filter((tag) => tag.label === inputValue).length === 0
    ) {
      tempsTags = [...tempsTags, { key: inputValue, label: inputValue }]
    }
    onChange?.(tempsTags.map((menu) => menu.label))
    setInputValue('')
  }

  return (
    <Space className="flex-wrap">
      {(tags || []).map((item) => {
        return (
          <Tag
            key={item.key}
            closable
            onClose={(e) => {
              onChange?.(
                tags
                  ?.filter((menu) => menu.label !== item.label)
                  .map((menu) => menu.label) ?? []
              )
              e.preventDefault()
            }}
          >
            {item.label}
          </Tag>
        )
      })}
      <Input
        ref={ref}
        type="text"
        size="small"
        style={{ width: 78 }}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
    </Space>
  )
}

const RoleManagement: React.FC = () => {
  const { message } = App.useApp()
  const { data: roleList, isFetching } = useQuery({
    queryKey: ['/role/list'],
    queryFn: () => getRoleList().then((res) => res.data)
  })
  const queryClient = useQueryClient()
  const formRef = useRef<any>(null)

  const [menuTags, setMenuTags] = useState<string[]>([])

  const columns: ProColumns<Role>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      readonly: true,
      width: '10%'
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      key: 'role',
      width: '15%',
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
      key: 'menuList',
      dataIndex: 'menuList',
      width: 500,
      renderFormItem: (_, { isEditable, record }) => {
        const tags = record?.menuList?.map((menu) => ({
          key: menu,
          label: menu
        }))
        return isEditable ? (
          <TagList tags={tags} onChange={setMenuTags} />
        ) : (
          <Input />
        )
      },
      render: (_, { menuList }) => (
        <Space className="flex-wrap">
          {menuList.map((menu) => (
            <Tag key={menu}>{menu}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'action',
      width: '300px',
      render: (_dom, record, index, action) => [
        <Button
          key={`edit+${index}`}
          size="small"
          type="primary"
          onClick={() => {
            if (record.id === 1) {
              message.warning('此条数据不能修改')
              return
            }
            action?.startEditable?.(record.id)
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          key={`delete+${index}`}
          title="删除角色"
          description={`您确定要删除 ${record.role} ?`}
          onConfirm={() => {
            if (record.id === 1) {
              message.warning('此条数据不能修改')
              return
            }
            // handleDelete(record.id as number)
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button size="small" type="primary" danger>
            删除
          </Button>
        </Popconfirm>
      ]
    }
  ]

  return (
    <EditableProTable<Role>
      editableFormRef={formRef}
      rowKey="id"
      headerTitle="角色管理"
      scroll={{
        x: 960
      }}
      loading={isFetching}
      columns={columns}
      value={roleList}
      recordCreatorProps={{
        // @ts-ignore
        record: () => ({ id: '-' }),
        creatorButtonText: '新增角色'
      }}
      editable={{
        type: 'single',
        onSave: async (_rowKey, data) => {
          // save
          // @ts-ignore
          if (data.id === '-') {
            // @ts-ignore
            data.id = null
            const res = await updateRole(data)
            if (res.code === 200) {
              message.success('修改角色成功')
              queryClient.invalidateQueries(['/role/list'])
            }
          } else {
            // update
            if (menuTags.length !== 0) {
              data.menuList = menuTags
            }
            const res = await updateRole(data)
            if (res.code === 200) {
              message.success('修改角色成功')
              queryClient.invalidateQueries(['/role/list'])
            }
          }
        }
      }}
    />
  )
}

export default RoleManagement
