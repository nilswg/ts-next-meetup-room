import { create } from 'zustand'
import { createStreamStore, type StreamStore } from '@/stores/userStream'
import { createSocketPeerStore, type SocketPeerStore } from '@/stores/socketPeer'

/**
 * 透過 Sub-Store 集合為 Store
 */
export type Store = StreamStore & SocketPeerStore

export const useStores = create<Store>((set, get, api) => ({
  ...createStreamStore(set, get),
  ...createSocketPeerStore(set, get),
}))

export type StoreSet = (f: (state: Store) => Partial<Store>) => void

export type StoreGet = () => Store

/**
 * 提供給拆分的Store使用，使其保有TypeScript的型態檢查功能
 */
export type CreateStore<T> = (set: StoreSet, get: StoreGet) => T
