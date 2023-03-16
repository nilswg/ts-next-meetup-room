import { removeStream } from '@/lib/stream'
import type { StoreGet, StoreSet } from '.'

export const removeScreenStream = (set: StoreSet, get: StoreGet) => () => {
  const screen = get().screens[0]
  removeStream(screen.stream)
  set((state) => ({
    screens: state.screens.map((e) =>
      e.type === 'user'
        ? {
            ...e,
            peerId: '',
            userId: '',
            stream: null,
            error: '',
            loading: false,
          }
        : e
    ),
  }))
}
