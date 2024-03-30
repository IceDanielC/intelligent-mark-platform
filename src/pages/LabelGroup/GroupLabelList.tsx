import useSearchParams from '@/hooks/useSearchParams'
import {
  UserLabelItem,
  deleteItem,
  deleteItemList,
  getUserLabelItmeList,
  updateItemList
} from '@/services/userLabelItem'
import { LeftOutlined, PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProColumns,
  ProForm,
  ProFormText,
  ProTable
} from '@ant-design/pro-components'
import { Button, ColorPicker, Divider, Popconfirm, Space, message } from 'antd'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'

const LabelItem: React.FC<{ item: UserLabelItem }> = ({ item }) => {
  return (
    <div className="flex absolute">
      <div
        style={{
          width: '10px',
          height: '25px',
          backgroundColor: item.color,
          marginRight: '10px',
          marginLeft: '10px'
        }}
      ></div>
      <span>{item.name}</span>
    </div>
  )
}

const ItemFormModal: React.FC<{ option: string; item?: UserLabelItem }> = ({
  option,
  item
}) => {
  const queryClient = useQueryClient()
  const { groupId } = useParams()

  return (
    <ModalForm
      // @ts-ignore
      labelWidth="auto"
      title={option + '标签'}
      trigger={
        option === '新增' ? (
          <Button type="primary">
            <PlusOutlined />
            添加标签
          </Button>
        ) : (
          <Button type="link" size="small" onClick={() => console.log(123)}>
            编辑
          </Button>
        )
      }
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={async (values: any) => {
        if (!values.color) {
          message.warning('不能使用默认颜色')
          return
        }

        const labelData: any = {
          name: values.name,
          color:
            typeof values.color === 'string'
              ? values.color
              : values.color.toHexString()
        }
        if (item) {
          // 更新
          labelData.groupId = item.groupId
          labelData.id = item.id
          await updateItemList(labelData)
        } else {
          // 新增
          labelData.groupId = groupId
          const res: any = await updateItemList(labelData)
          if (res.code !== 200) {
            return false
          }
        }
        message.success('操作成功')
        queryClient.invalidateQueries(['/userLabelItem/list/page'])
        return true
      }}
    >
      <ProForm.Group>
        <ProForm.Item
          name="color"
          label="标签颜色"
          initialValue={item?.color ?? '#1677FF'}
        >
          <ColorPicker
            styles={{
              popupOverlayInner: {
                width: 468 + 24
              }
            }}
            presets={[
              {
                label: 'Recommended',
                colors: [
                  '#000000',
                  '#000000E0',
                  '#000000A6',
                  '#00000073',
                  '#00000040',
                  '#00000026',
                  '#0000001A',
                  '#00000012',
                  '#0000000A',
                  '#00000005',
                  '#F5222D',
                  '#FA8C16',
                  '#FADB14',
                  '#8BBB11',
                  '#52C41A',
                  '#13A8A8',
                  '#1677FF',
                  '#2F54EB',
                  '#722ED1',
                  '#EB2F96',
                  '#F5222D4D',
                  '#FA8C164D',
                  '#FADB144D',
                  '#8BBB114D',
                  '#52C41A4D',
                  '#13A8A84D',
                  '#1677FF4D',
                  '#2F54EB4D',
                  '#722ED14D',
                  '#EB2F964D'
                ]
              },
              {
                label: 'Recent',
                colors: [
                  '#F5222D4D',
                  '#FA8C164D',
                  '#FADB144D',
                  '#8BBB114D',
                  '#52C41A4D',
                  '#13A8A84D'
                ]
              }
            ]}
            panelRender={(_, { components: { Picker, Presets } }) => (
              <div
                className="custom-panel"
                style={{
                  display: 'flex',
                  width: 468
                }}
              >
                <div
                  style={{
                    flex: 1
                  }}
                >
                  <Presets />
                </div>
                <Divider
                  type="vertical"
                  style={{
                    height: 'auto'
                  }}
                />
                <div
                  style={{
                    width: 234
                  }}
                >
                  <Picker />
                </div>
              </div>
            )}
          />
        </ProForm.Item>
        <ProFormText
          required
          rules={[
            {
              required: true,
              message: '标签名称不能为空'
            }
          ]}
          width="md"
          name="name"
          label="标签名称"
          initialValue={item?.name ?? ''}
          placeholder="请输入名称"
        />
      </ProForm.Group>
    </ModalForm>
  )
}

const GroupLabelList = () => {
  const { groupId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams<any>()
  const PAGE_SIZE = 5
  const queryClient = useQueryClient()
  const nav = useNavigate()

  const {
    data: itemPage,
    isFetching,
    isLoading,
    isPreviousData
  } = useQuery({
    queryKey: [
      '/userLabelItem/list/page',
      searchParams?.current,
      searchParams?.nameKeyword
    ],
    queryFn: () =>
      getUserLabelItmeList(
        +groupId!,
        searchParams?.current ?? 1,
        PAGE_SIZE,
        searchParams?.nameKeyword ?? ''
      ).then((res) => res.data),
    keepPreviousData: true
  })

  const columns: ProColumns<UserLabelItem>[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      fixed: 'left',
      width: '80%',
      render(_dom, labelItem) {
        return <LabelItem item={labelItem} />
      }
    },

    {
      key: 'actions',
      title: '操作',
      hideInSearch: true,
      fixed: 'right',
      render(_dom, item) {
        return (
          <>
            <ItemFormModal option="编辑" item={item} />
            <Popconfirm
              title="删除标签"
              description="你确定要删除该标签吗？"
              onConfirm={async () => {
                await deleteItem(item.id)
                queryClient.invalidateQueries(['/userLabelItem/list/page'])
                if (itemPage?.records.length === 1) {
                  setSearchParams((prev) => ({
                    ...prev,
                    current: `${searchParams.current - 1}`
                  }))
                }
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

  return (
    <>
      <ProTable<UserLabelItem>
        columnsState={{
          defaultValue: {
            id: { show: false }
          }
        }}
        rowSelection={
          {
            // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
            // 注释该行则默认不显示下拉选项
            // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
          }
        }
        tableAlertOptionRender={({ selectedRows, onCleanSelected }) => {
          return (
            <Space size={16}>
              <a
                onClick={async () => {
                  await deleteItemList(selectedRows.map((row) => row.id))
                  queryClient.invalidateQueries(['/userLabelItem/list/page'])
                  if (itemPage?.records.length === selectedRows.length) {
                    setSearchParams((prev) => ({
                      ...prev,
                      current: `${searchParams.current - 1}`
                    }))
                  }
                  onCleanSelected()
                  message.success('删除成功')
                }}
              >
                批量删除
              </a>
            </Space>
          )
        }}
        columns={columns}
        dataSource={itemPage?.records ?? []}
        loading={isLoading || (isFetching && isPreviousData)}
        onReset={() => setSearchParams({})}
        onSubmit={(params) =>
          setSearchParams((prev) => ({
            ...prev,
            nameKeyword: `${params.name ?? ''}`
          }))
        }
        rowKey="id"
        form={{ span: 6 }}
        cardProps={{ title: '标签总览', bordered: true }}
        headerTitle={<ItemFormModal option="新增" />}
        options={{
          reload: () =>
            queryClient.invalidateQueries(['/userLabelItem/list/page', {}])
        }}
        sticky
        search={{ labelWidth: 'auto' }}
        pagination={{
          current: parseInt(searchParams?.current ?? 1),
          total: itemPage?.total,
          pageSize: PAGE_SIZE,
          showQuickJumper: true,
          showSizeChanger: false,
          onChange: (page) =>
            setSearchParams((prev) => ({ ...prev, current: `${page}` }))
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '100px',
          left: '230px',
          cursor: 'pointer'
        }}
        onClick={() => nav('/manage/label-group/management')}
      >
        <LeftOutlined /> 返回
      </div>
    </>
  )
}

export default GroupLabelList
