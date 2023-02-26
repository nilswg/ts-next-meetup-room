import { create } from 'zustand'
import { createStreamStore, type StreamStore } from './stream'
import { createUserStore, type UserStore } from './user'
import { createSocketPeerStore, type SocketPeerStore } from './socketPeer'
import { createUserCameraStore, type UserCamera } from './userCamera'

export type RootStore = StreamStore & UserStore & SocketPeerStore & UserCamera

export const useStores = create<RootStore>((set, get, api) => ({
  ...createStreamStore(set, get),
  ...createUserStore(set, get),
  ...createSocketPeerStore(set, get),
  ...createUserCameraStore(set, get),
}))
