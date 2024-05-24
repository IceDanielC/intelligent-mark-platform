import { detectImageUseOnlineModal } from '@/services/detection'
import { DatasetImage, unAnnotatedImagesFromDataset } from '@/services/image'
import {
  LabelInfoSelf,
  getDatasetLabels,
  saveLabelByImage
} from '@/services/label'
import { RobotOutlined } from '@ant-design/icons'
import { Button, Modal, Popconfirm, Progress, ProgressProps, message } from 'antd'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { DEFAULT_COLOR } from './LabeledImage'

export type Process = {
  complete: number
  total: number
}

const BatchDetectButton: React.FC<{
  apiPath: string
}> = ({ apiPath }) => {
  const { dataset, version } = useParams()
  const [isModalOpen, setIsModalopen] = useState(false)
  const [process, setProcess] = useState<Process>({ complete: 0, total: 1 })

  const { data: savedLabels } = useQuery({
    queryKey: ['/labelGroup/dataset', dataset, version],
    queryFn: () =>
      getDatasetLabels(
        localStorage.getItem('user/info') as string,
        dataset as string,
        version as string
      ).then((res) => res.data),
    staleTime: Infinity
  })

  // 对所有未标注图片进行标注
  const handleBatchAnnotate = async () => {
    setIsModalopen(true)
    // 获取所有未标注图片
    const { data: unAnnoImages } = await unAnnotatedImagesFromDataset(
      localStorage.getItem('user/info') as string,
      dataset as string,
      version as string
    )
    if(unAnnoImages.length === 0) {
        message.warning('当前数据集已标注完成')
        setIsModalopen(false)
        return;
    }
    // 对unAnnoImages进行分组，每组最多两个（API限制）
    const unAnnoImagesChunks: DatasetImage[][] = []
    for (let i = 0; i < unAnnoImages.length; i += 2) {
      const pair = unAnnoImages.slice(i, i + 2)
      unAnnoImagesChunks.push(pair)
    }
    setProcess((process) => ({ ...process, total: unAnnoImages.length }))
    // 循环标注
    let i = 0
    while (i < unAnnoImagesChunks.length) {
      const chunk = unAnnoImagesChunks[i]
      await Promise.all(
        chunk.map(async (image) => {
          // 处理每张图片中的标签框
          const { results } = await detectImageUseOnlineModal(
            image.url,
            apiPath
          )
          const saveLabels: Omit<LabelInfoSelf, 'id'>[] = results.map(
            (label) => ({
              imageId: image.id as number,
              labelName: label.name ? label.name : '未命名标签',
              color:
                savedLabels?.find((l) => l.name === label.name)?.color ??
                DEFAULT_COLOR,
              leftPx: Math.round(label.location.left),
              topPx: Math.round(label.location.top),
              heightPx: Math.round(label.location.height),
              widthPx: Math.round(label.location.width)
            })
          )
          // 保存标签到mysql
          // @ts-ignore
          await saveLabelByImage(image.id!, saveLabels)
          setProcess((process) => ({
            ...process,
            complete: process.complete + 1
          }))
        })
      )
      // 每隔两秒处理一批，避免被认为是恶意请求
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('处理完了一批...')
      i++
    }
    setIsModalopen(false)
    // 刷新
    window.location.reload()
  }

  const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
  };

  return (
    <>
      <Popconfirm
        title="一键标注"
        description="您确定要使用当前模型对未检测图片进行标注吗？"
        okText="继续"
        cancelText="取消"
        onConfirm={handleBatchAnnotate}
      >
        <Button
          type="primary"
          icon={<RobotOutlined />}
          className="bg-[#00b359] btn-auto-annotate absolute top-[-64px] right-0"
        >
          一键自动化标注
        </Button>
      </Popconfirm>
      <Modal
        title="标注进行中..."
        open={isModalOpen}
        footer=""
        closable={false}
      >
        <div>
          <div>标注过程中请勿刷新页面</div>
          <Progress
            percent={(process.complete / process.total) * 100}
            status="active"
            strokeColor={twoColors} 
          />
        </div>
      </Modal>
    </>
  )
}

export default BatchDetectButton
