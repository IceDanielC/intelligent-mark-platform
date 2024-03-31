import { imagesFromDataset } from '@/services/image'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import DetectImage, { detectByModel, downloadImage } from './DetectImage'
import { App, Button, Space, Spin } from 'antd'
import {
  DownloadOutlined,
  LeftOutlined,
  OneToOneOutlined,
  RightOutlined
} from '@ant-design/icons'

export default () => {
  const { message } = App.useApp()
  const { dataset, version } = useParams()
  const nav = useNavigate()

  // 通过数据集获取images
  const { data: images, isLoading } = useQuery({
    queryKey: ['/dataset/images', dataset, version],
    queryFn: () =>
      imagesFromDataset(
        localStorage.getItem('user/info') as string,
        dataset as string,
        version as string
      ).then((res) => res.data)
  })

  const imageList = images?.map((image) => image.url) ?? []
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [isDetecting, setIsDetecting] = useState<boolean>(false)

  useEffect(() => {
    if (images) {
      if (images.length === 0) {
        message.warning('该数据集还没有上传图片，请先上传', 5)
        nav('/manage/dataset/my-dataset')
      }
    }
  }, [images])

  useEffect(() => {
    setImageLoading(true)
  }, [currentIndex])

  const handleDetection = async () => {
    // 模拟从服务器获取检测框和mask掩膜
    const mask = [
      [3.3175355450236967, 213.20853080568725],
      [72.51184834123224, 191.88151658767777],
      [181.51658767772514, 175.29383886255926],
      [254.97630331753555, 169.60663507109007],
      [363.98104265402844, 175.76777251184836],
      [443.6018957345972, 186.19431279620852],
      [538.388625592417, 191.40758293838866],
      [616.1137440758295, 181.92890995260666],
      [590.9952606635071, 192.35545023696682],
      [517.0616113744076, 203.25592417061614],
      [429.8578199052133, 223.6350710900474],
      [351.18483412322274, 239.2748815165877],
      [258.76777251184836, 242.1184834123223],
      [158.29383886255926, 233.5876777251185],
      [61.61137440758294, 233.1137440758294],
      [5.213270142180095, 240.69668246445502]
    ]
    setIsDetecting(true)
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mask)
      }, 1500)
    })
    setIsDetecting(false)
    detectByModel(mask)
  }

  return (
    <div>
      {isLoading ? (
        <Spin spinning={isLoading}></Spin>
      ) : (
        <Spin spinning={isDetecting} tip="正在检测中...">
          <DetectImage
            imageUrl={imageList[currentIndex]}
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
          />
        </Spin>
      )}
      <Space className="mt-8">
        <Button
          size="small"
          type="primary"
          icon={<LeftOutlined />}
          onClick={() => {
            if (currentIndex !== 0) {
              setCurrentIndex(currentIndex - 1)
            } else {
              message.warning('已经是第一张了')
            }
          }}
        >
          上一张图片
        </Button>
        <Button
          size="small"
          type="primary"
          icon={<RightOutlined />}
          onClick={() => {
            if (currentIndex !== imageList.length - 1) {
              setCurrentIndex(currentIndex + 1)
            } else {
              message.warning('已经是最后一张了')
            }
          }}
        >
          下一张图片
        </Button>
        <Button
          size="small"
          type="primary"
          icon={<OneToOneOutlined />}
          style={{ backgroundColor: 'orange' }}
          onClick={handleDetection}
          disabled={imageLoading}
        >
          高精度检测
        </Button>
        <Button
          size="small"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => downloadImage(images?.[currentIndex].name!)}
          disabled={imageLoading}
        >
          导出标注图片
        </Button>
      </Space>
    </div>
  )
}
