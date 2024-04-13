import { getRoleMenus } from '@/services/role'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMenuStore = create<{
  menus: string[]
  fetchMenus: (username: string) => void
}>(
  // @ts-ignore
  persist(
    (set) => ({
      menus: [],

      fetchMenus: async (username: string) => {
        const { data: menuStr } = await getRoleMenus(username)
        set({ menus: menuStr.split(',') })
      }
    }),
    {
      name: 'menu-store' // 唯一名称
    }
  )
)
