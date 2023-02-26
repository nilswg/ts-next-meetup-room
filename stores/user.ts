import type { RootStore } from '.'

export type UserStore = {
  userId: string
  setUserId: (userId: string) => void
}

export const createUserStore = (
  set: (f: (s: RootStore) => Partial<RootStore>) => void,
  get: () => RootStore
): UserStore => ({
  userId: 'Me',
  setUserId: (userId: string) => {
    set(() => ({ userId }))
  },
})
