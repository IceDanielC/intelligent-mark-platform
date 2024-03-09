import { Dataset, getDatasetsByUser } from '@/services/dataset'
import { Cascader, Empty } from 'antd'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

const prehandleDataset = (originDataset: Dataset[] | undefined) => {
  const seen: { [index in string]: any } = {}
  return originDataset
    ?.map((dataset) => {
      const datasetName = dataset.name
      return {
        label: datasetName,
        value: datasetName,
        children: originDataset
          .filter((dataset) => dataset.name === datasetName)
          .map((dataset) => ({
            label: dataset.version,
            value: dataset.version
          }))
      }
    })
    .filter((option) => {
      if (seen.hasOwnProperty(option.label)) return false
      else {
        seen[option.label] = 1
        return true
      }
    })
}

export default () => {
  const navigator = useNavigate()
  const username = localStorage.getItem('user/info')
  const { data: datasets } = useQuery({
    queryKey: ['/dataset/user', username],
    queryFn: () => getDatasetsByUser(username as string).then((res) => res.data)
  })
  const options = prehandleDataset(datasets)

  const handleSelect = (value: any[]) => {
    if (window.location.pathname.includes('high-precision-detection')) {
      navigator(
        `/manage/high-precision-detection/detail/${value[0]}/${value[1]}`
      )
    } else {
      navigator(`/manage/auto-annotate/detail/${value[0]}/${value[1]}`)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center relative top-[25%]">
        <Empty description="数据集选择" />
        <Cascader
          options={options}
          onChange={handleSelect}
          placeholder="请选择数据集"
          className="mt-6"
        />
      </div>
    </>
  )
}
