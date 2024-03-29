import {
  UserLabel,
  deleteUserLabel,
  getUserLabelList,
  updateUserLabel
} from '@/services/userLabel'
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProColumns,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components'
import { Button, Popconfirm, Tag, message } from 'antd'
import { useQuery, useQueryClient } from 'react-query'
import useSearchParams from '@/hooks/useSearchParams'

const UpdateLabelModal: React.FC<{
  option: string
  userLabel?: UserLabel
}> = ({ option, userLabel }) => {
  const queryClient = useQueryClient()

  return (
    <ModalForm
      title={option + '标签组'}
      width={500}
      trigger={
        option === '新增' ? (
          <Button type="primary">
            <PlusOutlined />
            新建标签组
          </Button>
        ) : (
          <Button type="link" size="small">
            编辑
          </Button>
        )
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={async (values: UserLabel) => {
        values.username = localStorage.getItem('user/info') as string
        if (userLabel) {
          values.createTime = userLabel.createTime
          values.id = userLabel.id
          values.userId = userLabel.userId
          await updateUserLabel(values)
          queryClient.invalidateQueries(['/userLabel/list/page'])
          message.success('编辑成功')
        } else {
          const res: any = await updateUserLabel(values)
          if (res.code === 10000) {
            return false
          }
          queryClient.invalidateQueries(['/userLabel/list/page'])
          message.success('新增成功')
        }
        return true
      }}
    >
      <ProForm.Group>
        <ProFormText
          required
          width="md"
          rules={[
            {
              required: true,
              message: '标签名称不能为空'
            }
          ]}
          name="groupName"
          initialValue={userLabel?.groupName ?? ''}
          label="标签组名称"
          tooltip="最长为 12 位"
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="md"
          name="description"
          label="标签组描述"
          initialValue={userLabel?.description ?? ''}
          placeholder="请输入描述"
        />
      </ProForm.Group>
    </ModalForm>
  )
}

const columns: ProColumns<UserLabel>[] = [
  {
    key: 'id',
    title: 'ID',
    dataIndex: 'id',
    hideInSearch: true,
    hideInTable: true
  },
  {
    title: '标签组名称',
    dataIndex: 'groupName',
    fixed: 'left'
  },
  {
    title: '用户id',
    dataIndex: 'userId',
    hideInSearch: true,
    width: 100
  },
  {
    title: '标签组描述',
    dataIndex: 'description',
    hideInSearch: true,
    width: 300
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    hideInSearch: true,
    width: 150,
    sorter: (a, b) => Date.parse(a.createTime) - Date.parse(b.createTime),
    render(_dom, dataset) {
      return (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          {dataset.createTime}
        </Tag>
      )
    }
  },
  {
    key: 'actions',
    title: '操作',
    hideInSearch: true,
    width: 240,
    fixed: 'right',
    render(_dom, userLabel) {
      const queryClient = useQueryClient()

      return (
        <>
          <Button type="link" size="small">
            标签管理
          </Button>
          <UpdateLabelModal option="编辑" userLabel={userLabel} />

          <Popconfirm
            title="删除标签组"
            description="你确定要删除该标签组吗？"
            onConfirm={async () => {
              await deleteUserLabel(userLabel.id)
              queryClient.invalidateQueries(['/userLabel/list/page'])
              message.success('删除成功')
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      )
    }
  }
]

const GroupManage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams<any>()
  const PAGE_SIZE = 5
  const queryClient = useQueryClient()

  const {
    data: datasetsPage,
    isFetching,
    isLoading,
    isPreviousData
  } = useQuery({
    queryKey: [
      '/userLabel/list/page',
      searchParams?.current,
      searchParams?.nameKeyword
    ],
    queryFn: () =>
      getUserLabelList(
        localStorage.getItem('user/info') as string,
        searchParams?.current ?? 1,
        PAGE_SIZE,
        searchParams?.nameKeyword ?? ''
      ).then((res) => res.data),
    keepPreviousData: true
  })

  return (
    <ProTable<UserLabel>
      columnsState={{
        defaultValue: {
          id: { show: false }
        }
      }}
      columns={columns}
      dataSource={datasetsPage?.records ?? []}
      loading={isLoading || (isFetching && isPreviousData)}
      onReset={() => setSearchParams({})}
      onSubmit={(params) =>
        setSearchParams((prev) => ({
          ...prev,
          nameKeyword: `${params.groupName ?? ''}`
        }))
      }
      rowKey="id"
      form={{ span: 6 }}
      cardProps={{ title: '标签组总览', bordered: true }}
      headerTitle={<UpdateLabelModal option="新增" />}
      options={{
        reload: () =>
          queryClient.invalidateQueries(['/userLabel/list/page', {}])
      }}
      sticky
      search={{ labelWidth: 'auto' }}
      pagination={{
        current: parseInt(searchParams?.current ?? 1),
        total: datasetsPage?.total,
        pageSize: PAGE_SIZE,
        showQuickJumper: true,
        showSizeChanger: false,
        onChange: (page) =>
          setSearchParams((prev) => ({ ...prev, current: `${page}` }))
      }}
    />
  )
}

export default GroupManage
