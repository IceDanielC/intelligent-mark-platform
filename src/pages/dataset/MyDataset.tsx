import { useAntdResizableHeader } from '@minko-fe/use-antd-resizable-header'
import { ClockCircleOutlined, GroupOutlined } from '@ant-design/icons'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Button, Popconfirm, Tag, message } from 'antd'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

import useSearchParams from '@/hooks/useSearchParams'
import {
  Dataset,
  deleteDataset,
  getDatasetPagesByUser
} from '@/services/dataset'
import { useMemo } from 'react'

const MyDataset: React.FC = () => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams<any>()
  const PAGE_SIZE = 5
  const nav = useNavigate()

  const {
    data: datasetsPage,
    isFetching,
    isLoading,
    isPreviousData
  } = useQuery({
    queryKey: [
      '/dataset/user/page',
      searchParams?.current,
      searchParams?.nameKeyword
    ],
    queryFn: () =>
      getDatasetPagesByUser(
        localStorage.getItem('user/info') as string,
        searchParams?.current ?? 1,
        PAGE_SIZE,
        searchParams?.nameKeyword ?? ''
      ).then((res) => res.data),
    keepPreviousData: true
  })

  const columns: ProColumns<Dataset>[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '数据集名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 250
    },
    {
      title: '数据集版本',
      dataIndex: 'version',
      width: 50,
      hideInSearch: true
    },
    {
      title: '标注类型',
      dataIndex: 'annotateType',
      hideInSearch: true,
      width: 200
    },
    {
      title: '数据量',
      dataIndex: 'imgNumber',
      hideInSearch: true,
      width: 70
    },
    {
      title: '标注情况',
      hideInSearch: true,
      render(_dom, dataset) {
        return (
          <span>{`${Math.round(
            (Number.isNaN(dataset.annotatedNumber / dataset.imgNumber)
              ? 0
              : dataset.annotatedNumber / dataset.imgNumber) * 100
          )}% (${dataset.annotatedNumber}/${dataset.imgNumber})`}</span>
        )
      },
      width: 150
    },
    {
      title: '标注模版',
      hideInSearch: true,
      dataIndex: 'module',
      width: 120
    },
    {
      title: '存储平台',
      hideInSearch: true,
      dataIndex: 'savePlace',
      width: 150
    },
    {
      title: '创建时间',
      hideInSearch: true,
      dataIndex: 'createTime',
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
      render(_dom, dataset) {
        return (
          <div className="space-x-2">
            {dataset.imgNumber > 0 ? (
              <Button
                type="link"
                size="small"
                onClick={() =>
                  nav(
                    `/manage/dataset/my-dataset/${dataset.name}/${dataset.version}/detail`
                  )
                }
              >
                查看
              </Button>
            ) : null}
            <Button
              type="link"
              size="small"
              onClick={() =>
                nav(`/manage/dataset/my-dataset/${dataset.id}/import`)
              }
            >
              导入
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                nav(
                  `/manage/auto-annotate/detail/${dataset.name}/${dataset.version}`
                )
              }}
            >
              标注
            </Button>
            {dataset.version === 'V1' ? (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  console.log('新增版本')
                }}
              >
                新增版本
              </Button>
            ) : null}
            <Popconfirm
              title="删除数据集"
              description={`你确定要删除${dataset.name}吗?`}
              onConfirm={async () => {
                const res = await deleteDataset(dataset.id)
                if (res.code === 200) {
                  message.success('删除成功')
                  queryClient.invalidateQueries(['/dataset/user/page'])
                } else {
                  message.error('删除失败')
                }
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      }
    }
  ]

  const { resizableColumns, components, tableWidth } = useAntdResizableHeader({
    /** @ts-ignore */
    columns: useMemo(() => columns, []), // 如果columns定义在组件内，必须使用useMemo
    minConstraints: 50,
    columnsState: {
      persistenceKey: 'table/widths/dataset',
      persistenceType: 'localStorage'
    }
  })

  return (
    <ProTable<Dataset>
      columnsState={{
        defaultValue: {
          id: { show: false }
        },
        persistenceKey: 'table/settings/dataset',
        persistenceType: 'localStorage'
      }}
      columns={resizableColumns}
      components={components}
      dataSource={datasetsPage?.records ?? []}
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
      cardProps={{ title: '数据集总览', bordered: true }}
      headerTitle={
        <Button
          type="primary"
          icon={<GroupOutlined />}
          onClick={() => nav('/manage/dataset/create')}
        >
          新建数据集
        </Button>
      }
      options={{
        reload: () => queryClient.invalidateQueries(['/dataset/user/page', {}])
      }}
      sticky
      scroll={{ x: tableWidth }}
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

export default MyDataset
