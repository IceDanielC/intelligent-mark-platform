import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import AnnotatedTabItem from './AnnotatedTabItem'
import {
  annotatedImagesFromDataset,
  imagesFromDataset,
  unAnnotatedImagesFromDataset
} from '@/services/image'
import { useParams } from 'react-router-dom'

// const onChange = (key: string) => {
//   console.log(key)
// }

const AutoAnnotate: React.FC = () => {
  const { dataset, version } = useParams()
  const [total, setTotal] = useState(0)
  const [annotated, setAnnotated] = useState(0)
  const [unAnno, setUnAnno] = useState(0)

  const initNumber = async () => {
    const { data: allImages } = await imagesFromDataset(
      dataset as string,
      version as string
    )
    const { data: annotatedImages } = await annotatedImagesFromDataset(
      dataset as string,
      version as string
    )
    const { data: unAnnoImages } = await unAnnotatedImagesFromDataset(
      dataset as string,
      version as string
    )
    setTotal(allImages.length)
    setAnnotated(annotatedImages.length)
    setUnAnno(unAnnoImages.length)
  }

  useEffect(() => {
    initNumber()
  }, [])

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `全部 (${total})`,
      children: <AnnotatedTabItem imageType="1" />
    },
    {
      key: '2',
      label: `已标记 (${annotated})`,
      children: <AnnotatedTabItem imageType="2" />
    },
    {
      key: '3',
      label: `未标记 (${unAnno})`,
      children: <AnnotatedTabItem imageType="3" />
    }
  ]

  return (
    <Tabs destroyInactiveTabPane={true} defaultActiveKey="1" items={items} />
  )
}

export default AutoAnnotate
