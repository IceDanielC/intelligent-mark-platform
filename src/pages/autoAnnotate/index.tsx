import React from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import AnnotatedTabItem from './AnnotatedTabItem'
import {
  annotatedImagesFromDataset,
  imagesFromDataset,
  unAnnotatedImagesFromDataset
} from '@/services/image'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useImageStore } from '@/store/useImageStore'

// const onChange = (key: string) => {
//   console.log(key)
// }

const AutoAnnotate: React.FC = () => {
  const { dataset, version } = useParams()
  const {
    allImages,
    annotatedImages,
    unAnnoImages,
    setAllImages,
    setAnnotatedImages,
    setunAnnoImages
  } = useImageStore()

  useQuery({
    queryKey: ['/dataset/images', dataset, version, '1'],
    queryFn: () =>
      imagesFromDataset(dataset as string, version as string).then(
        (res) => res.data
      ),
    onSuccess(data) {
      setAllImages(data)
    }
  })

  useQuery({
    queryKey: ['/dataset/images', dataset, version, '2'],
    queryFn: () =>
      annotatedImagesFromDataset(dataset as string, version as string).then(
        (res) => res.data
      ),
    onSuccess(data) {
      setAnnotatedImages(data)
    }
  })

  useQuery({
    queryKey: ['/dataset/images', dataset, version, '3'],
    queryFn: () =>
      unAnnotatedImagesFromDataset(dataset as string, version as string).then(
        (res) => res.data
      ),
    onSuccess(data) {
      setunAnnoImages(data)
    }
  })

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `全部 (${allImages?.length ?? 0})`,
      children: <AnnotatedTabItem imageType="1" />
    },
    {
      key: '2',
      label: `已标记 (${annotatedImages?.length ?? 0})`,
      children: <AnnotatedTabItem imageType="2" />
    },
    {
      key: '3',
      label: `未标记 (${unAnnoImages?.length ?? 0})`,
      children: <AnnotatedTabItem imageType="3" />
    }
  ]

  return (
    <Tabs destroyInactiveTabPane={true} defaultActiveKey="1" items={items} />
  )
}

export default AutoAnnotate
