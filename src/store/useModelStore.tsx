import type { Model } from '@/services/model'
import { create } from 'zustand'

export const useModelStore = create<{
  models: Model[]
  setModels: (models: Model[]) => void
}>((set) => ({
  models: [],

  setModels: (models: Model[]) => {
    set({ models })
  }
}))
