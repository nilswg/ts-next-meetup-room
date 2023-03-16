import { createPeer } from "@/lib/createConnection";
import { MediaConnection } from "peerjs";
import type { StoreGet, StoreSet } from ".";

export const screenShare = (set: StoreSet, get: StoreGet) => async (props: ShareScreenProps) => {
  const socket = get().socket!
  const myUserPeerId = get().myUserPeerId!
  const { myRoomId, myUserId, answerStream, video, audio } = props

  // 建立新的 Peer 連線，專門用來分享畫面
  const { peer: myScreenPeer, peerId: myScreenPeerId } = await createPeer()
  set(() => ({ myScreenPeer, myScreenPeerId }))

  // 所有連線設置完成(Socketio 與 Peerjs 皆建立連線)後，發起
  socket.emit('share-screen', myRoomId, myUserPeerId, {
    userId: myUserId,
    userPeerId: myUserPeerId,
    peerId: myScreenPeerId,
    streamType: 'screen',
    video: video,
    audio: audio,
    single: true,
  })

  // 監聽別人對我的來電 (當我分享畫面時，別人向我請求分享畫面串流)
  myScreenPeer.on('call', (call: MediaConnection) => {
    const metadata: PeerMetadata = call.metadata
    console.log('[通知] 其他用戶向我請求畫面', { metadata, call })

    // 被動回應此來電
    if (answerStream) {
      call.answer(answerStream)
    }

    // 因為是單向的，不播放對方畫面
    // if (metadata.streamType === 'screen' && !metadata.single) {
    //   const { onStream, onClose, onError } = screenHandlers(get, set, call, call.metadata)
    //   call.on('stream', onStream).on('close', onClose).on('error', onError)
    // }
  })
}