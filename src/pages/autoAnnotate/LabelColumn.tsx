import { DatasetLabel, getDatasetLabels } from '@/services/label'
import { useLabelStore } from '@/store/useLabelStore'
import { EllipsisOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Dropdown, MenuProps } from 'antd'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

const items: MenuProps['items'] = [
  {
    key: 'delete',
    label: <div>删除标签</div>
  }
]

const DatasetLabelItem: React.FC<{
  label: DatasetLabel
  onClick: (item: DatasetLabel) => void
}> = ({ label, onClick }) => {
  return (
    <div
      className="h-10 border border-slate-300 hover:border-[#1677ff]
    border-solid my-3 flex items-center cursor-pointer"
      // @ts-ignore
      onClick={onClick}
    >
      <div
        style={{
          height: '100%',
          width: '10px',
          backgroundColor: label.color,
          marginLeft: '20px',
          marginRight: '10px'
        }}
      />
      <span>{label.name}</span>
      {/* <Button type="text" danger size="small" className="absolute right-6">
        删除
      </Button> */}
      <Dropdown menu={{ items }}>
        <EllipsisOutlined className="absolute right-8 text-xl" />
      </Dropdown>
    </div>
  )
}

const LabelColumn: React.FC<{ labelImageRef: any }> = ({ labelImageRef }) => {
  const { dataset, version } = useParams()
  const { datasetLabels, setDatasetLabels } = useLabelStore()
  useQuery({
    queryKey: ['/labelGroup/dataset', dataset, version],
    queryFn: () =>
      getDatasetLabels(dataset as string, version as string).then(
        (res) => res.data
      ),
    onSuccess(labels) {
      setDatasetLabels(labels)
    },
    staleTime: Infinity
  })

  const handleLabelClick = (item: DatasetLabel) => {
    const uuid = labelImageRef.current
      .getImageLabel()
      .current.activeLabel()?.uuid

    labelImageRef.current
      .getImageLabel()
      .current.setLabelByUuid(uuid, { name: item.name, color: item.color })
  }

  return (
    <Card className="flex-1 ml-2">
      <div>
        <div className="flex justify-between">
          <span style={{ fontSize: 16 }}>标签栏</span>
          <Button type="primary">添加标签</Button>
        </div>

        <Divider />
        {datasetLabels?.map((item) => (
          <DatasetLabelItem
            key={item.id}
            label={item}
            onClick={() => handleLabelClick(item)}
          />
        ))}
      </div>
    </Card>
  )
}

export default LabelColumn
