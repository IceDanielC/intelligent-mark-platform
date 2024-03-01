import React from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import AnnotatedTabItem from './AnnotatedTabItem'
import useImageQuery from '@/hooks/useImageQuery'
import { useSearchParams } from 'react-router-dom'

const AutoAnnotate: React.FC = () => {
  const { allImages, annotatedImages, unAnnoImages } = useImageQuery()
  const [_searchParams, setSearchParams] = useSearchParams()

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
    <Tabs
      destroyInactiveTabPane={true}
      defaultActiveKey="1"
      items={items}
      onChange={() => setSearchParams('')}
    />
  )
}

export default AutoAnnotate
