import { uploadImages } from '@/services/image'
import { PlusOutlined } from '@ant-design/icons'
import {
  PageContainer,
  ProForm,
  ProFormRadio
} from '@ant-design/pro-components'
import { Modal, Upload, type UploadFile, App } from 'antd'
import { RcFile, UploadProps } from 'antd/es/upload'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const ImportForm: React.FC = () => {
  const { datasetId } = useParams()
  const { message } = App.useApp()
  const nav = useNavigate()

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [imageList, setImageList] = useState<UploadFile[]>([])

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    // 设置预览图片名称
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setImageList(newFileList)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  )

  return (
    <>
      <PageContainer title="导入配置">
        <div>
          <ProForm
            // @ts-ignore
            labelWidth="auto"
            onFinish={async (_values: any) => {
              const images = imageList.map((image) => ({
                url: image.response.msg.replace('localhost', '47.104.78.142'),
                datasetId: Number.parseInt(datasetId as string),
                isAnnotate: 'false',
                name: image.name,
                isValidated: 'true',
                size: image.size as number
              }))
              const res = await uploadImages(images)
              if (res.code === 200) {
                message.success('导入成功')
                nav('/manage/dataset/my-dataset')
              } else {
                message.error('导入失败')
              }
            }}
          >
            <ProForm.Group>
              <ProFormRadio.Group
                name="type"
                label="数据标注状态:"
                options={[
                  {
                    label: '无标注信息',
                    value: 'non-label'
                  },
                  {
                    label: '有标注信息',
                    value: 'labeled',
                    disabled: true
                  }
                ]}
                initialValue="non-label"
              />
            </ProForm.Group>
            <ProForm.Group>
              {/* 图片上传 */}
              <ProForm.Item
                name="upload"
                label="数据集图片上传："
                tooltip="支持批量上传"
                rules={[
                  {
                    required: true,
                    message: '请至少上传一张图片',
                    validator: (_, _value) =>
                      imageList.length > 0
                        ? Promise.resolve()
                        : Promise.reject(new Error('请至少上传一张图片'))
                  }
                ]}
              >
                <Upload
                  action="http://47.104.78.142:8085/minio/upload"
                  headers={{
                    Authorization: localStorage.getItem('minio/token') ?? ''
                  }}
                  listType="picture-card"
                  fileList={imageList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  multiple={true}
                  className="mb-4"
                >
                  {imageList.length >= 100 ? null : uploadButton}
                </Upload>
              </ProForm.Item>
            </ProForm.Group>
          </ProForm>
        </div>
      </PageContainer>
      {/* 图片预览Modal */}
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default ImportForm
