// @ts-ignore
import SimpleImageLabel from 'simple-image-label'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { LabelInfo } from '@/services/detection'
import { Spin } from 'antd'
import { useQuery } from 'react-query'
import { getDatasetLabels, getLabelsByImage } from '@/services/label'
import { useParams } from 'react-router-dom'

export type ImageLabelComponentType = {
  color: string
  name: string
  uuid: string
  height: number
  width: number
  x: number
  y: number
}

const DEFAULT_COLOR = 'blue'

const ImageLabelComponent: React.FC<{
  imageUrl: string
  labels: LabelInfo[]
  ref: any
  annotating?: boolean
  imageLoading: boolean
  setImageLoading: (l: boolean) => void
}> = forwardRef(
  ({ imageUrl, labels, annotating, imageLoading, setImageLoading }, ref) => {
    const { dataset, version } = useParams()

    const simpleImageLabel = useRef<any>(null)
    useImperativeHandle(ref, () => ({
      getImageLabel: () => simpleImageLabel
    }))

    const { data: labelsFromServer } = useQuery({
      queryKey: ['/labelInfo/imageLabels', imageUrl],
      queryFn: () =>
        getLabelsByImage(imageUrl, dataset as string, version as string).then(
          (res) => res.data
        )
    })

    const { data: savedLabels } = useQuery({
      queryKey: ['/labelGroup/dataset', dataset, version],
      queryFn: () =>
        getDatasetLabels(dataset as string, version as string).then(
          (res) => res.data
        ),
      staleTime: Infinity
    })

    useEffect(() => {
      initSimpleDom()
    }, [imageUrl, labels, labelsFromServer, imageLoading, annotating])

    function initSimpleDom() {
      const image = new Image()
      image.src = imageUrl
      // 获取原始高度
      image.onload = () => {
        setImageLoading(false)
        simpleImageLabel.current = new SimpleImageLabel({
          el: 'ImageLabelComponent',
          imageUrl: image.src,
          // 云检测标签 ? 显示云检测标签 : 显示服务器标签
          labels:
            labels.length > 0
              ? labels.map((label, index) => ({
                  color:
                    savedLabels?.find((l) => l.name === label.name)?.color ??
                    DEFAULT_COLOR,
                  name: label.name,
                  uuid: label.name + index,
                  height:
                    label.location.height / (image.naturalHeight as number),
                  width: label.location.width / (image.naturalWidth as number),
                  x: label.location.left / (image.naturalWidth as number),
                  y: label.location.top / (image.naturalHeight as number)
                }))
              : labelsFromServer?.map((label, index) => ({
                  color: label.color ?? DEFAULT_COLOR,
                  name: label.labelName,
                  uuid: label.labelName + label.imageId + index,
                  height: label.heightPx / (image.naturalHeight as number),
                  width: label.widthPx / (image.naturalWidth as number),
                  x: label.leftPx / (image.naturalWidth as number),
                  y: label.topPx / (image.naturalHeight as number)
                })) ?? [],
          contextmenu: (e: any) => {
            console.log(e)
          },
          labelClick: (label: any) => {
            console.log(label)
          },
          error: (e: any) => {
            console.log(e)
          }
        })
      }
    }

    return (
      <Spin tip="图片加载中" spinning={imageLoading} className="mt-[8%]">
        <div className="bg-gray-100">
          <Spin tip="正在智能标注中..." spinning={annotating}>
            <div
              id="ImageLabelComponent"
              className="w-[60vw] "
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Backspace') {
                  simpleImageLabel.current?.removeLabelByUuid(
                    simpleImageLabel.current?.activeLabel()?.uuid
                  )
                }
              }}
            />
          </Spin>
        </div>
      </Spin>
    )
  }
)

export default ImageLabelComponent
