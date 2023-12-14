// @ts-ignore
import SimpleImageLabel from 'simple-image-label'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { LabelInfo } from '@/services/detection'
import { Spin } from 'antd'
import { useQuery } from 'react-query'
import { getLabelsByImage } from '@/services/label'

export type ImageLabelComponentType = {
  color: string
  name: string
  uuid: string
  height: number
  width: number
  x: number
  y: number
}

const ImageLabelComponent: React.FC<{
  imageUrl: string
  labels: LabelInfo[]
  ref: any
  annotating?: boolean
  imageLoading: boolean
  setImageLoading: (l: boolean) => void
}> = forwardRef(
  ({ imageUrl, labels, annotating, imageLoading, setImageLoading }, ref) => {
    const simpleImageLabel = useRef<any>(null)
    useImperativeHandle(ref, () => ({
      getImageLabel: () => simpleImageLabel
    }))
    const { data: labelsFromServer } = useQuery({
      queryKey: ['/labelInfo/imageLabels', imageUrl],
      queryFn: () => getLabelsByImage(imageUrl).then((res) => res.data)
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
          labels: labels // 云检测标签
            .map((label, index) => ({
              color: label.color ?? 'blue',
              name: label.name,
              uuid: label.name + index,
              height: label.location.height / (image.naturalHeight as number),
              width: label.location.width / (image.naturalWidth as number),
              x: label.location.left / (image.naturalWidth as number),
              y: label.location.top / (image.naturalHeight as number)
            }))
            .concat(
              // 服务器存储标签
              labelsFromServer?.map((label, index) => ({
                color: label.color ?? 'blue',
                name: label.labelName,
                uuid: label.labelName + label.imageId + index,
                height: label.heightPx / (image.naturalHeight as number),
                width: label.widthPx / (image.naturalWidth as number),
                x: label.leftPx / (image.naturalWidth as number),
                y: label.topPx / (image.naturalHeight as number)
              })) ?? []
            ),
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
      <Spin tip="图片加载中" spinning={imageLoading}>
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
