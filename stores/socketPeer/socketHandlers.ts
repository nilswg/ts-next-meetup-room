import Peer from 'peerjs'
import { StoreGet, StoreSet } from '@/stores'
import { PeerMetadata } from '@/stores/socketPeer'
import { peerHandlers } from './peerHandlers'

export const socketHandlers = (get: StoreGet, set: StoreSet, peer: Peer, myUserId:string) => {
  return {
    userConnected: (remotePeerId: string, remoteData: PeerMetadata) => {
      console.log(`[通知] 用戶 ${remotePeerId} 已加入房間`)

      const { userStream } = get()
      if (!userStream) {
        console.error('[ERROR] userStream is invalid')
        return
      }

      const userMetadata = {
        metadata: {
          userId: myUserId,
          audio: get().audio,
          video: get().video,
        },
      }

      // 主動聯繫別人，並接收對方的來電
      const call = peer.call(remotePeerId, userStream, userMetadata)

      // 播放對方視訊
      const { onStream, onClose, onError } = peerHandlers(
        get,
        set,
        call,
        remoteData
      )
      call.on('stream', onStream).on('close', onClose).on('error', onError)
    },
    userDisconnected: (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 已退出房間`)

      // 如果此用戶存在則關閉來電
      const call = get().peerMap.get(remotePeerId)
      if (!call) return
      else {
        call.close()
      }
    },
  }
}
