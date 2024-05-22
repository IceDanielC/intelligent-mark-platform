import useImageQuery from '@/hooks/useImageQuery'
import { DatasetImage, deleteImage } from '@/services/image'
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons'
import { Image, Popconfirm, Space, Tabs, TabsProps, App } from 'antd'
import LabelColumn from '../autoAnnotate/LabelColumn'
import { useNavigate, useParams } from 'react-router-dom'
import { convertBytesToSize } from '@/utils/convert'

const onDownload = (src: string, imageName: string) => {
  fetch(src)
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.download = imageName
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(url)
      link.remove()
    })
}

const DisplayImage: React.FC<{
  src: string
  imageName: string
  isAnnotated: boolean
  imgId: number
  index: number
  size: number
}> = ({ src, imageName, isAnnotated, imgId, index, size }) => {
  const { message } = App.useApp()
  const { queryClient } = useImageQuery()
  const nav = useNavigate()
  const { dataset, version } = useParams()

  return (
    <>
      <div className="m-2">
        <Image
          width={150}
          height={150}
          src={src}
          preview={{
            toolbarRender: (
              _,
              { transform: { scale }, actions: { onZoomOut, onZoomIn } }
            ) => (
              <Space size={12} className="toolbar-wrapper">
                <DownloadOutlined onClick={() => onDownload(src, imageName)} />
                <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
              </Space>
            )
          }}
        />
        <div className="bg-[#efefef] w-[150px] h-[30px] text-xs pt-2 pl-2 relative">
          {isAnnotated ? (
            '已标注'
          ) : (
            <span style={{ color: 'red' }}>未标注</span>
          )}
          <span className="absolute ml-2">{convertBytesToSize(size)}</span>
          <div style={{ display: 'inline-block', marginLeft: '70px' }}>
            <EditOutlined
              className="cursor-pointer"
              onClick={() => {
                // edit 跳转到 标注界面
                nav(
                  `/manage/auto-annotate/detail/${dataset}/${version}?index=${index}`
                )
              }}
            />
            <Popconfirm
              title="删除图片"
              description="你确定要删除该图片吗"
              onConfirm={async () => {
                const res = await deleteImage(imgId)
                if (res.code === 200) {
                  message.success('删除成功')
                  queryClient.invalidateQueries(['/dataset/images'])
                } else {
                  message.error('删除失败')
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined className="ml-2 cursor-pointer" />
            </Popconfirm>
          </div>
        </div>
      </div>
    </>
  )
}

const Detail: React.FC<{ images: DatasetImage[] }> = ({ images }) => {
  return (
    <div className="flex">
      <div
        className="flex flex-wrap w-[58vw] h-[70vh] border border-solid border-slate-300"
      >
        {images.map((image, index) => (
          <DisplayImage
            key={image.id}
            imgId={image.id as number}
            src={image.url}
            imageName={image.name}
            isAnnotated={image.isAnnotate === 'true'}
            index={index}
            size={image.size}
          />
        ))}
      </div>
      <LabelColumn labelImageRef={null} />
    </div>
  )
}

const DatasetDetail = () => {
  const { allImages, annotatedImages, unAnnoImages } = useImageQuery()

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `全部 (${allImages?.length ?? 0})`,
      children: <Detail images={allImages} />
    },
    {
      key: '2',
      label: `已标记 (${annotatedImages?.length ?? 0})`,
      children: <Detail images={annotatedImages} />
    },
    {
      key: '3',
      label: `未标记 (${unAnnoImages?.length ?? 0})`,
      children: <Detail images={unAnnoImages} />
    }
  ]

  return (
    <Tabs destroyInactiveTabPane={true} defaultActiveKey="1" items={items} />
  )
}

export default DatasetDetail
