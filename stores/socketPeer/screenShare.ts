import { createPeer } from '@/lib/createConnection'
import { MediaConnection } from 'peerjs'
import type { StoreGet, StoreSet } from '.'
import { createScreenStream } from './createScreenStream'

export const screenShare = (set: StoreSet, get: StoreGet) => async (props: ShareScreenProps) => {
  const socket = get().socket!
  const myUserPeerId = get().myUserPeerId!
  const { myRoomId, myUserId } = props

  set(() => ({ shareScreenLoading: true }))
  const screenStream = await createScreenStream(set, get)()
  const screen = get().screens[0]

  // 建立新的 Peer 連線，專門用來分享畫面
  const { peer: myScreenPeer, peerId: myScreenPeerId } = await createPeer()
  set(() => ({ myScreenPeer, myScreenPeerId, shareScreenLoading: false }))

  // 所有連線設置完成(Socketio 與 Peerjs 皆建立連線)後，發起
  socket.emit('share-screen', myRoomId, myUserPeerId, {
    userId: myUserId,
    userPeerId: myUserPeerId,
    peerId: myScreenPeerId,
    streamType: 'screen',
    video: screen.video,
    audio: screen.audio,
    single: true,
  })

  // 監聽別人對我的來電 (當我分享畫面時，別人向我請求分享畫面串流)
  myScreenPeer.on('call', (call: MediaConnection) => {
    const metadata: PeerMetadata = call.metadata
    console.log('[通知] 其他用戶向我請求畫面', { metadata, call })

    // 被動回應此來電
    if (screenStream) {
      call.answer(screenStream)
    }

    // 因為是單向的，不播放對方畫面
    // if (metadata.streamType === 'screen' && !metadata.single) {
    //   const { onStream, onClose, onError } = screenHandlers(get, set, call, call.metadata)
    //   call.on('stream', onStream).on('close', onClose).on('error', onError)
    // }
  })
}
