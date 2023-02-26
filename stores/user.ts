import type { CreateStore } from '.'

export type UserStore = {
  userId: string
  setUserId: (userId: string) => void
}

export const createUserStore: CreateStore<UserStore> = (set, get) => ({
  userId: 'Me',
  setUserId: (userId: string) => {
    set(() => ({ userId }))
  },
})
