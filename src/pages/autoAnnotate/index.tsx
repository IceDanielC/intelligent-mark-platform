import React, { useState } from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import AnnotatedTabItem from './AnnotatedTabItem'
import useImageQuery from '@/hooks/useImageQuery'
import { useSearchParams } from 'react-router-dom'

const AutoAnnotate: React.FC = () => {
  const { allImages, annotatedImages, unAnnoImages } = useImageQuery()
  const [_searchParams, setSearchParams] = useSearchParams()
  const [tabKey, setTabKey] = useState('1')

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
      activeKey={tabKey}
      items={items}
      onChange={(key) => {
        setSearchParams('')
        if (key === '2' && annotatedImages.length === 0) {
          setTabKey('1')
          return
        } else if (key === '3' && unAnnoImages.length === 0) {
          setTabKey('1')
          return
        }
        setTabKey(key)
      }}
    />
  )
}

export default AutoAnnotate
