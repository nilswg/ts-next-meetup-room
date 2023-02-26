import { create } from 'zustand'
import { createStreamStore, type StreamStore } from './stream'
import { createUserStore, type UserStore } from './user'
import { createSocketPeerStore, type SocketPeerStore } from './socketPeer'
import { createUserCameraStore, type UserCamera } from './userCamera'

/**
 * 透過 Sub-Store 集合為 Store
 */
type Store = StreamStore & UserStore & SocketPeerStore & UserCamera

export const useStores = create<Store>((set, get, api) => ({
  ...createStreamStore(set, get),
  ...createUserStore(set, get),
  ...createSocketPeerStore(set, get),
  ...createUserCameraStore(set, get),
}))

/**
 * 提供給拆分的Store使用，使其保有TypeScript的型態檢查功能
 */
export type CreateStore<T> = (
  set: (f: (state: Store) => Partial<Store>) => void,
  get: () => Store
) => T
