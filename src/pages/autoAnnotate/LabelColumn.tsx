import { mergeLabelGroup } from '@/services/dataset'
import {
  DatasetLabel,
  addLabelGroup,
  deleteDatasetLabel,
  getDatasetLabels
} from '@/services/label'
import { getListByUsername } from '@/services/userLabel'
import { useLabelStore } from '@/store/useLabelStore'
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components'
import {
  Button,
  Card,
  ColorPicker,
  Divider,
  Dropdown,
  MenuProps,
  Modal,
  Popconfirm,
  Select,
  Space,
  message
} from 'antd'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

const DatasetLabelItem: React.FC<{
  label: DatasetLabel
  onClick: (item: DatasetLabel) => void
}> = ({ label, onClick }) => {
  const queryClient = useQueryClient()

  const items: MenuProps['items'] = [
    {
      key: 'delete',
      label: (
        <Popconfirm
          title="删除标签"
          description={`你确定要删除标签${label.name}?`}
          onConfirm={async () => {
            await deleteDatasetLabel(label.id!)
            message.success('删除成功')
            queryClient.invalidateQueries(['/labelGroup/dataset'])
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button size="small" type="link" danger>
            删除标签
          </Button>
        </Popconfirm>
      )
    }
  ]

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
      <Dropdown menu={{ items }}>
        <EllipsisOutlined className="absolute right-8 text-xl" />
      </Dropdown>
    </div>
  )
}

const AddGroupModal: React.FC<{
  modalOpen: boolean
  setModalOpen: (b: boolean) => void
  datasetName: string
  datasetVersion: string
}> = ({ modalOpen, setModalOpen, datasetName, datasetVersion }) => {
  const username = localStorage.getItem('user/info')
  const [groupName, setGroupName] = useState<string | undefined>(undefined)
  const queryClient = useQueryClient()

  const { data: labelGroupList } = useQuery({
    queryKey: ['/userLabel/options', username],
    queryFn: () => getListByUsername(username as string).then((res) => res.data)
  })

  return (
    <Modal
      title="导入标签组"
      open={modalOpen}
      onCancel={() => {
        setModalOpen(false)
        setGroupName(undefined)
      }}
      onOk={async () => {
        if (!groupName) {
          message.warning('请选择一个标签组')
          return false
        } else {
          const res: any = await mergeLabelGroup(
            username!,
            datasetName,
            datasetVersion,
            groupName
          )
          if (res.code === 200) {
            queryClient.invalidateQueries(['/labelGroup/dataset'])
            message.success('导入成功')
            setModalOpen(false)
          }
        }
      }}
    >
      <Space className="mt-6">
        <div>标签组名称：</div>
        <Select
          style={{ width: 160 }}
          placeholder="请选择标签组"
          value={groupName}
          onChange={setGroupName}
          options={labelGroupList?.map((item) => ({
            label: item.groupName,
            value: item.groupName
          }))}
        />
      </Space>
    </Modal>
  )
}

const LabelColumn: React.FC<{ labelImageRef: any }> = ({ labelImageRef }) => {
  const { dataset, version } = useParams()
  const { datasetLabels, setDatasetLabels } = useLabelStore()
  const [modalOpen, setModalOpen] = useState(false)

  const queryClient = useQueryClient()
  useQuery({
    queryKey: ['/labelGroup/dataset', dataset, version],
    queryFn: () =>
      getDatasetLabels(
        localStorage.getItem('user/info') as string,
        dataset as string,
        version as string
      ).then((res) => res.data),
    onSuccess(labels) {
      setDatasetLabels(labels)
    }
  })

  const handleLabelClick = (item: DatasetLabel) => {
    const uuid = labelImageRef?.current
      .getImageLabel()
      .current.activeLabel()?.uuid

    labelImageRef?.current
      .getImageLabel()
      .current.setLabelByUuid(uuid, { name: item.name, color: item.color })
  }

  const items: MenuProps['items'] = [
    {
      label: '导入标签组',
      key: 'import',
      icon: <PlusOutlined />
    }
  ]
  const menuProps = {
    items,
    onClick: () => {
      setModalOpen(true)
    }
  }

  return (
    <Card className="flex-1 ml-2">
      <div>
        <div className="flex justify-between">
          <span style={{ fontSize: 16 }}>标签栏</span>
          <ModalForm
            // @ts-ignore
            labelWidth="auto"
            title="添加标签"
            trigger={
              <Dropdown.Button
                type="primary"
                menu={menuProps}
                className="absolute left-40 top-5"
              >
                添加标签
              </Dropdown.Button>
            }
            modalProps={{
              destroyOnClose: true
            }}
            onFinish={async (values: any) => {
              if (!values.color) {
                message.warning('不能使用默认颜色')
                return
              }
              const labelData = {
                name: values.name,
                color: values.color.toHexString()
              }
              const res = await addLabelGroup(
                localStorage.getItem('user/info') as string,
                dataset as string,
                version as string,
                labelData
              )
              if (res.code === 200) {
                message.success('新增成功')
                queryClient.invalidateQueries(['/labelGroup/dataset'])
                return true
              }
            }}
          >
            <ProForm.Group>
              <ProForm.Item name="color" label="标签颜色">
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
                placeholder="请输入名称"
              />
            </ProForm.Group>
          </ModalForm>
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
      <AddGroupModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        datasetName={dataset!}
        datasetVersion={version!}
      />
    </Card>
  )
}

export default LabelColumn
