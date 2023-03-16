import { MediaConnection } from 'peerjs'
import { StoreGet, StoreSet } from '@/stores/socketPeer'

export const screenHandlers = (get: StoreGet, set: StoreSet, call: MediaConnection, data: PeerMetadata) => {
  return {
    onStream: (remoteStream: MediaStream) => {
      const peerScreenMap = get().peerScreenMap
      const userPeerId = data.userPeerId
      const screenPeerId = data.peerId

      if (!peerScreenMap.has(userPeerId)) {
        console.log('建立他人畫面')
        console.log('建立peerScreenMap', { userPeerId, screenPeerId })
        peerScreenMap.set(userPeerId, { screenPeerId, call })

        // screen
        set((state) => ({
          screens: [
            ...state.screens,
            {
              type: 'remote',
              peerId: data.peerId,
              userId: data.userId,
              stream: remoteStream,
              error: '',
              loading: false,
              video: data.video,
              audio: data.audio,
              frameRate: data.frameRate ?? 30,
            },
          ],
        }))
      }
    },
    onClose: () => {
      closeRemoteScreen(get, set, data.userPeerId)
    },
    onError: (error: Error) => {
      closeRemoteScreen(get, set, data.userPeerId)
    },
  }
}

function closeRemoteScreen(get: StoreGet, set: StoreSet, remoteUserPeerId: string) {
  console.log('關閉用戶畫面串流', remoteUserPeerId)
  const screen = get().peerScreenMap.get(remoteUserPeerId)
  if (!screen) return

  const { myScreenPeer, myScreenPeerId, myUserPeerId } = get()

  // 清除連線
  myScreenPeer?.disconnect()
  set(() => ({ myScreenPeer: null, myScreenPeerId: '' }))

  // 更新狀態
  get().peerScreenMap.delete(remoteUserPeerId)
  set((state) => ({
    screens: state.screens.filter((e) => e.peerId !== screen.screenPeerId),
  }))
}
