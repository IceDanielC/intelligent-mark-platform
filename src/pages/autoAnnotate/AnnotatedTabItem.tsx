import { Button, Popconfirm, Space, Spin, Tooltip, message } from 'antd'
import LabeledImage, { type ImageLabelComponentType } from './LabeledImage'
import { useEffect, useRef, useState } from 'react'
import { type LabelInfo, detectImageUseOnlineModal } from '@/services/detection'
import { EditOutlined, RobotOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from 'react-query'
import {
  annotatedImagesFromDataset,
  imagesFromDataset,
  isImageAnnotate,
  unAnnotatedImagesFromDataset
} from '@/services/image'
import { useParams } from 'react-router-dom'
import { LabelInfoSelf, YOLOLabel, saveLabelByImage } from '@/services/label'
import LabelColumn from './LabelColumn'

const imageTypeMap = {
  '1': imagesFromDataset,
  '2': annotatedImagesFromDataset,
  '3': unAnnotatedImagesFromDataset
}

const AnnotatedTabItem: React.FC<{ imageType: '1' | '2' | '3' }> = ({
  imageType
}) => {
  const labelImageRef = useRef<any>(null)
  const { dataset, version } = useParams()

  // 通过数据集获取images
  const { data: images, isLoading } = useQuery({
    queryKey: ['/dataset/images', dataset, version, imageType],
    queryFn: () =>
      imageTypeMap[imageType](dataset as string, version as string).then(
        (res) => res.data
      )
  })

  const imageList = images?.map((image) => image.url) ?? []
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [labels, setLabels] = useState<LabelInfo[]>([])
  const [isAnnotating, setIsAnnotating] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const autosaveRef = useRef<any>(null)

  useEffect(() => {
    autosaveRef.current = images?.[currentIndex]
    if (images) {
      if (images.length === 0) {
        message.warning('该数据集还没有上传图片，请先上传', 5)
      }
    }
  }, [images, currentIndex])

  useEffect(() => {
    setImageLoading(true)

    const handleKeyDown = (e: any) => {
      if (e.key === 's') {
        handleSaveAnnotate(autosaveRef.current?.id as number)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex])

  const queryClient = useQueryClient()

  // 保存标注
  const handleSaveAnnotate = async (imageId: number) => {
    setIsSaving(true)
    const { width, height } =
      labelImageRef.current.getImageLabel().current.imageInfo
    const saveLabels: LabelInfoSelf[] = labelImageRef.current
      .getImageLabel()
      .current?.labels?.map((label: ImageLabelComponentType) => {
        return {
          imageId,
          labelName: label.name ? label.name : '未命名标签',
          color: label.color,
          leftPx: Math.round(label.x * width),
          topPx: Math.round(label.y * height),
          heightPx: Math.round(label.height * height),
          widthPx: Math.round(label.width * width)
        }
      })
    const res = await saveLabelByImage(imageId, saveLabels)
    setIsSaving(false)
    if (res.code === 200) {
      message.success('自动保存成功')
      if (currentIndex !== imageList.length - 1) {
        if (imageType !== '3') setCurrentIndex(currentIndex + 1)
        setLabels([])

        queryClient.invalidateQueries(['/dataset/images'])
      } else {
        message.info('已经是最后一张图片')
      }
    }
  }

  const handleAutoAnnotate = async () => {
    setIsAnnotating(true)
    const res = await detectImageUseOnlineModal(imageList[currentIndex])
    setLabels(res.results)
    setIsAnnotating(false)
    if (res.results) {
      message.success('智能标注成功')
    }
  }

  const { data: isImageAnnotated } = useQuery({
    queryKey: ['/image/isAnnotated', currentIndex],
    queryFn: () =>
      isImageAnnotate(imageList[currentIndex]).then((res) => res.data),
    enabled: imageList[currentIndex] !== undefined
  })

  const handleDownloadYOLO = async () => {
    const saveLabels: YOLOLabel[] = labelImageRef.current
      .getImageLabel()
      .current?.labels?.map((label: ImageLabelComponentType) => {
        return {
          labelIndex: 0,
          x: label.x,
          y: label.y,
          height: label.height,
          width: label.width
        }
      })
    const content = saveLabels
      .map(
        (label) =>
          `${label.labelIndex} ${label.x} ${label.y} ${label.width} ${label.height}`
      )
      .join('\n')
    const blob = new Blob([content], {
      type: 'text/plain'
    })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `${images?.[currentIndex].name}.txt` // 设置下载的文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  }

  return (
    <>
      <div className="flex">
        <Spin spinning={isSaving} tip="标注保存中...">
          {isLoading ? (
            <Spin spinning={isLoading}></Spin>
          ) : (
            <LabeledImage
              imageUrl={imageList[currentIndex]}
              ref={labelImageRef}
              labels={labels}
              annotating={isAnnotating}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
            />
          )}
        </Spin>
        <LabelColumn labelImageRef={labelImageRef} />
      </div>
      <Space className="mt-8">
        <Button
          type="link"
          onClick={() => {
            if (currentIndex !== 0) {
              setCurrentIndex(currentIndex - 1)
              setLabels([])
            } else {
              message.warning('已经是第一张了')
            }
          }}
        >
          上一张图像
        </Button>
        <Button
          type="link"
          onClick={() => {
            if (currentIndex !== imageList.length - 1) {
              setCurrentIndex(currentIndex + 1)
              setLabels([])
            } else {
              message.warning('已经是最后一张了')
            }
          }}
        >
          下一张图像
        </Button>
        <Tooltip placement="top" title={'保存快捷键[S]'}>
          <Button
            type="primary"
            onClick={() =>
              handleSaveAnnotate(images?.[currentIndex].id as number)
            }
            icon={<EditOutlined />}
          >
            保存标注
          </Button>
        </Tooltip>
        {isImageAnnotated ? (
          <Popconfirm
            title="该图片已经标注"
            description="自动化标注可能会覆盖当前标注，您确定要继续吗"
            okText="继续"
            cancelText="取消"
            onConfirm={handleAutoAnnotate}
          >
            <Button
              className="bg-[#00b359]"
              type="primary"
              icon={<RobotOutlined />}
            >
              云智能标注
            </Button>
          </Popconfirm>
        ) : (
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={handleAutoAnnotate}
            className="bg-[#00b359]"
          >
            云智能标注
          </Button>
        )}
        <Button
          type="primary"
          size="small"
          className="ml-4"
          style={{ backgroundColor: 'orange' }}
          onClick={handleDownloadYOLO}
        >
          导出标注文件(YOLO)
        </Button>
      </Space>
    </>
  )
}

export default AnnotatedTabItem