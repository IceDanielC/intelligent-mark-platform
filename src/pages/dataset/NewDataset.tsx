import { Dataset, createDataset } from '@/services/dataset'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  PageContainer,
  ProForm,
  ProFormRadio,
  ProFormText
} from '@ant-design/pro-components'
import { Collapse, CollapseProps, Divider, Tooltip, message } from 'antd'
import { useNavigate } from 'react-router-dom'

const DetectionRadio: React.FC = () => {
  return (
    <div>
      <div>植物病虫害识别</div>
      <img
        src="https://console.bce.baidu.com/easydata/app/datav/img/OBJ_DCT.b8e1856b.png"
        width={100}
      />
    </div>
  )
}

const NewDataset: React.FC = () => {
  const nav = useNavigate()

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: '1. 图片格式要求',
      children: (
        <p style={{ maxWidth: '300px' }}>
          目前支持图片类型为jpg, png, jpeg，图片大小限制在14M以内。
          图片长宽比在3:1以内，其中最长边小于4096px，最短边大于30px。
        </p>
      )
    },
    {
      key: '2',
      label: '2. 图片内容要求',
      children: (
        <p style={{ maxWidth: '300px' }}>
          训练图片和实际场景要识别的图片拍摄环境一致，举例：如果实际要识别的图片是摄像头俯拍的，训练图片就不能用网上下载的目标正面图片。
          每个标签的图片需要覆盖实际场景里面的可能性，如拍照角度、光线明暗的变化，训练集覆盖的场景越多，模型的泛化能力越强。
          每个模型训练图片量不得低于4张，每个标签建议标注50个框以上。
        </p>
      )
    },
    {
      key: '3',
      label: '3. 如何设计',
      children: (
        <p style={{ maxWidth: '300px' }}>
          每种需要识别的目标都需要一个标签，一张图片中可以有多种目标出现。
          标签的上限为1000种，标签名由数字、中英文、中/下划线组成，长度上限256字符。
        </p>
      )
    }
  ]

  return (
    <div className="flex">
      <PageContainer title="基本信息" className="grow">
        <div>
          <ProForm
            // @ts-ignore
            onFinish={async (params: Dataset) => {
              params.username = localStorage.getItem('user/info')!
              const res = await createDataset(params)
              console.log(res)
              message.success('创建数据集成功')
              nav('/manage/dataset/my-dataset')
            }}
            layout={'horizontal'}
            className="create-dataset-form"
          >
            <ProForm.Group>
              <ProFormText
                name="name"
                label="数据集名称:"
                placeholder="限制50个字符以内（支持汉字、大小写英文、数字以及下划线）"
                width={450}
                required
                rules={[
                  {
                    required: true,
                    message: '请输入数据集名称'
                  }
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name={'type'}
                label="数据类型:"
                initialValue="图片"
                readonly
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name={'version'}
                label="数据集版本:"
                initialValue="V1"
                readonly
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormRadio.Group
                name="annotateType"
                required
                label="标注类型:"
                fieldProps={{
                  optionType: 'button'
                }}
                options={[
                  {
                    label: <DetectionRadio />,
                    value: '植物病虫害识别'
                  }
                ]}
                initialValue={'植物病虫害识别'}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormRadio.Group
                name="module"
                required
                label="标注模板:"
                options={[
                  {
                    label: (
                      <div>
                        矩形框标注 &nbsp;
                        <Tooltip
                          placement="right"
                          title="“矩形框”是垂直于⽔平线的矩形检测框，不提供旋转⻆度，一般情况下，矩形检测框的检测效果表现更好，且在选择算法种类上更丰富。"
                        >
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                    ),
                    value: '矩形框标注'
                  },
                  {
                    label: '自定义四边形标注',
                    value: '自定义四边形标注',
                    disabled: true
                  }
                ]}
                initialValue={'矩形框标注'}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormRadio.Group
                name="savePlace"
                label="保存位置:"
                options={[
                  {
                    label: '云服务器平台',
                    value: '云服务器平台'
                  }
                ]}
                initialValue={'云服务器平台'}
              />
            </ProForm.Group>
          </ProForm>
        </div>
      </PageContainer>
      <Divider type="vertical" className="h-auto" />
      <div style={{ marginTop: '30px', marginLeft: '10px' }}>
        <div style={{ marginBottom: '10px' }}>常见问题</div>
        <Collapse accordion items={items} style={{ minWidth: '350px' }} />
      </div>
    </div>
  )
}

export default NewDataset
