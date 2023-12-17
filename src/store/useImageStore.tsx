import type { DatasetImage } from '@/services/image'
import { create } from 'zustand'

type ImageStore = {
  allImages: DatasetImage[]
  annotatedImages: DatasetImage[]
  unAnnoImages: DatasetImage[]
  setAllImages: (images: DatasetImage[]) => void
  setAnnotatedImages: (images: DatasetImage[]) => void
  setunAnnoImages: (images: DatasetImage[]) => void
}

export const useImageStore = create<ImageStore>((set) => ({
  allImages: [],
  annotatedImages: [],
  unAnnoImages: [],
  setAllImages: (images: DatasetImage[]) => {
    set({ allImages: images })
  },
  setAnnotatedImages: (images: DatasetImage[]) => {
    set({ annotatedImages: images })
  },
  setunAnnoImages(images: DatasetImage[]) {
    set({ unAnnoImages: images })
  }
}))
