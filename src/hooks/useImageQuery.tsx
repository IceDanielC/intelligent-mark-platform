import { useParams } from 'react-router-dom'
import {
  annotatedImagesFromDataset,
  imagesFromDataset,
  unAnnotatedImagesFromDataset
} from '@/services/image'
import { useQuery, useQueryClient } from 'react-query'
import { useImageStore } from '@/store/useImageStore'

const useImageQuery = () => {
  const { dataset, version } = useParams()
  const {
    allImages,
    annotatedImages,
    unAnnoImages,
    setAllImages,
    setAnnotatedImages,
    setunAnnoImages
  } = useImageStore()
  const queryClient = useQueryClient()

  useQuery({
    queryKey: ['/dataset/images', dataset, version, '1'],
    queryFn: () =>
      imagesFromDataset(
        localStorage.getItem('user/info') as string,
        dataset as string,
        version as string
      ).then((res) => res.data),
    onSuccess(data) {
      setAllImages(data)
    }
  })

  useQuery({
    queryKey: ['/dataset/images', dataset, version, '2'],
    queryFn: () =>
      annotatedImagesFromDataset(
        localStorage.getItem('user/info') as string,
        dataset as string,
        version as string
      ).then((res) => res.data),
    onSuccess(data) {
      setAnnotatedImages(data)
    }
  })

  useQuery({
    queryKey: ['/dataset/images', dataset, version, '3'],
    queryFn: () =>
      unAnnotatedImagesFromDataset(
        localStorage.getItem('user/info') as string,
        dataset as string,
        version as string
      ).then((res) => res.data),
    onSuccess(data) {
      setunAnnoImages(data)
    }
  })

  return {
    allImages,
    annotatedImages,
    unAnnoImages,
    queryClient
  }
}

export default useImageQuery
