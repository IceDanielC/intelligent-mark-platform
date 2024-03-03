import {
  Dataset,
  createDatasetVersion,
  getDatasetNewVersion
} from '@/services/dataset'
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components'
import { Button, Form, message } from 'antd'
import { useQueryClient } from 'react-query'

const NewVersionModal: React.FC<{ dataset: Dataset }> = ({ dataset }) => {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  return (
    <ModalForm
      title="新增数据集版本"
      layout="horizontal"
      request={async () => {
        const { data: latestVersion } = await getDatasetNewVersion(dataset.name)
        return { version: 'V' + (parseInt(latestVersion.slice(1)) + 1) }
      }}
      trigger={
        <Button type="link" size="small">
          新增版本
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={async (params) => {
        await createDatasetVersion(
          {
            username: localStorage.getItem('user/info')!,
            name: params.name,
            version: params.version,
            module: params.module,
            annotateType: params.annotateType,
            savePlace: params.savePlace
          } as Dataset,
          params.extends,
          params.historyVersion
        )
        message.success('新增版本成功')
        queryClient.invalidateQueries(['/dataset/user/page'])
        return true
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="数据集名称"
          initialValue={dataset.name}
          readonly
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="version"
          label="数据集版本"
          tooltip="系统默认生成，无需修改"
          readonly
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="annotateType"
          label="标注类型"
          initialValue={dataset.annotateType}
          readonly
        />
        <ProFormText
          width="md"
          name="module"
          label="标注模版"
          initialValue={dataset.module}
          readonly
        />
        <ProFormText
          width="md"
          name="savePlace"
          label="存储平台"
          initialValue={dataset.savePlace}
          readonly
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="md"
          name="note"
          label="备注信息"
          placeholder="请备注本次版本主要做的修改，如添加数据、更换标注方式等，限制50字符内"
          fieldProps={{ maxLength: 50, showCount: true }}
        />
      </ProForm.Group>
      <ProFormSwitch
        label="继承历史版本"
        tooltip="开启后，支持在选择历史版本基础上对数据做进一步修改"
        name="extends"
        initialValue={true}
      />
      <ProForm.Group>
        <ProFormSelect
          label="历史版本"
          name="historyVersion"
          initialValue={'V1'}
          request={async () => {
            const { data: latestVersion } = await getDatasetNewVersion(
              dataset.name
            )
            let versionNumber = parseInt(latestVersion.slice(1))
            return new Array(versionNumber).fill(0).map(() => ({
              label: 'V' + versionNumber,
              value: 'V' + versionNumber--
            }))
          }}
        />
      </ProForm.Group>
    </ModalForm>
  )
}

export default NewVersionModal
