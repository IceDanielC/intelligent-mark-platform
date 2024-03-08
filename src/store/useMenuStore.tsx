import { getRoleMenus } from '@/services/role'
import { create } from 'zustand'

export const useMenuStore = create<{
  menus: string[]
  fetchMenus: () => void
}>((set) => ({
  menus: [],

  fetchMenus: async () => {
    const { data: menuStr } = await getRoleMenus(
      localStorage.getItem('user/info') ?? ''
    )
    set({ menus: menuStr.split(',') })
  }
}))
