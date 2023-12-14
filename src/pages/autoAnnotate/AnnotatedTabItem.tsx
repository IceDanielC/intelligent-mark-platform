import { Button, Popconfirm, Space, Spin, Tooltip, message } from 'antd'
import LabeledImage, { type ImageLabelComponentType } from './LabeledImage'
import { useEffect, useRef, useState } from 'react'
import { type LabelInfo, detectImageUseOnlineModal } from '@/services/detection'
import { EditOutlined, RobotOutlined } from '@ant-design/icons'
import { useQuery } from 'react-query'
import {
  annotatedImagesFromDataset,
  imagesFromDataset,
  isImageAnnotate,
  unAnnotatedImagesFromDataset
} from '@/services/image'
import { useParams } from 'react-router-dom'
import { LabelInfoSelf, saveLabelByImage } from '@/services/label'

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
        setCurrentIndex(currentIndex + 1)
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

  return (
    <>
      <Spin spinning={isSaving} tip="标注保存中...">
        <div className="flex">
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
        </div>
      </Spin>
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
            description="再次自动化标注可能会导致标签冗余，您确定要继续吗"
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
      </Space>
    </>
  )
}

export default AnnotatedTabItem
