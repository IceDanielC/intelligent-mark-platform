import { useAntdResizableHeader } from '@minko-fe/use-antd-resizable-header'
import { GroupOutlined } from '@ant-design/icons'
import { ProColumns, ProTable } from '@ant-design/pro-components'
import { Button } from 'antd'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

import useSearchParams from '@/hooks/useSearchParams'
import { Dataset, getDatasetPagesByUser } from '@/services/dataset'

const MyDataset: React.FC = () => {
  const queryClient = useQueryClient()
  const [_searchParams, setSearchParams] = useSearchParams<any>()
  const nav = useNavigate()

  const {
    data: datasetsPage,
    isFetching,
    isLoading,
    isPreviousData
  } = useQuery({
    queryKey: ['/dataset/user/page'],
    queryFn: () =>
      getDatasetPagesByUser(localStorage.getItem('user/info') as string).then(
        (res) => res.data
      ),
    keepPreviousData: true
  })

  const columns: ProColumns<Dataset>[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      fixed: 'left',
      hideInTable: true
    },
    {
      title: '数据集名称',
      dataIndex: 'name',
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
      hideInSearch: true
    },
    {
      title: '数据量',
      dataIndex: 'imgNumber',
      hideInSearch: true
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
            <Button type="link" size="small" danger>
              删除
            </Button>
          </div>
        )
      }
    }
  ]

  const { resizableColumns, components, tableWidth } = useAntdResizableHeader({
    /** @ts-ignore */
    columns,
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
      rowKey="id"
      form={{ span: 6 }}
      cardProps={{ title: '数据集总览', bordered: true }}
      headerTitle={
        <Button
          type="primary"
          icon={<GroupOutlined />}
          onClick={() => {
            console.log('新增数据集')
          }}
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
        current: datasetsPage?.current,
        total: datasetsPage?.total,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: false,
        onChange: (page) =>
          setSearchParams((prev) => ({ ...prev, page: `${page}` }))
      }}
    />
  )
}

export default MyDataset
