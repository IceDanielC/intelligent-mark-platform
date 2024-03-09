import { Spin } from 'antd'
import { useEffect } from 'react'

// 调用模型API进行检测标注
export const detectByModel = (mask: number[][]) => {
  const cav: any = document.querySelector('#drawing')
  if (cav?.getContext) {
    const ctx = cav.getContext('2d')
    // 使用 API 达到预期效果
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgb(255 78 22)' // 后端传
    ctx.strokeRect(10, 150, 610, 100) // 后端传
    ctx.fillStyle = 'rgb(255 78 22)'
    ctx.fillRect(10, 150 - 20, 150, 20) // 后端传+计算
    ctx.strokeStyle = 'white'
    ctx.font = '100 14px sans-serif'
    ctx.strokeText('XXXX XXXXX 0.99', 10, 130 + 15) // 后端传+计算
    ctx.beginPath()
    // mask掩膜数据来自后端
    mask.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point[0], point[1])
      ctx.lineTo(point[0], point[1])
    })
    ctx.closePath()
    ctx.fillStyle = 'rgb(255 78 22 / 50%)' // 后端传，默认50%透明度
    ctx.fill()
  }
}

// 导出标注图片
export const downloadImage = (imageName: string = '未命名') => {
  const canvas = document.querySelector('#drawing')
  // 创建一个 a 标签，并设置 href 和 download 属性
  const el = document.createElement('a')
  // 设置 href 为图片经过 base64 编码后的字符串，默认为 png 格式
  // @ts-ignore
  el.href = canvas.toDataURL()
  el.download = imageName
  // 创建一个点击事件并对 a 标签进行触发
  const event = new MouseEvent('click')
  el.dispatchEvent(event)
}

const DetectImage: React.FC<{
  imageUrl: string
  imageLoading: boolean
  setImageLoading: (l: boolean) => void
}> = ({ imageUrl, imageLoading, setImageLoading }) => {
  useEffect(() => {
    if (!imageLoading) {
      const img: any = document.querySelector('#img')
      const cav: any = document.querySelector('#drawing')
      if (cav?.getContext) {
        cav.width = img.width
        cav.height = img.height
        const ctx = cav.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
      }
    }
  }, [imageLoading])

  return (
    <Spin tip="图片加载中" spinning={imageLoading} className="">
      <div
        style={{
          width: '100%',
          backgroundColor: '#efefef',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <canvas id="drawing" style={{ width: '55vw' }}>
          A drawing of something
        </canvas>
        <img
          id="img"
          src={imageUrl}
          crossOrigin="anonymous"
          style={{ display: 'none' }}
          onLoad={() => {
            console.log('图片加载完毕')
            setImageLoading(false)
          }}
        />
      </div>
    </Spin>
  )
}

export default DetectImage
