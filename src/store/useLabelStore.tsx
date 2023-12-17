import { DatasetLabel } from '@/services/label'
import { create } from 'zustand'

export const useLabelStore = create<{
  datasetLabels: DatasetLabel[]
  setDatasetLabels: (datasetLabels: DatasetLabel[]) => void
}>((set) => ({
  datasetLabels: [],

  setDatasetLabels: (datasetLabels: DatasetLabel[]) => {
    set({ datasetLabels })
  }
}))
