import Peer, { MediaConnection } from 'peerjs'
import { StoreGet, StoreSet } from '@/stores/socketPeer'
import { screenHandlers } from '@/stores/socketPeer/screenHandlers'
import { webcamHandlers } from '@/stores/socketPeer/webcamHandlers'
import createFakeStream from '@/lib/createFakeStream'
import { createPeer } from '@/lib/createConnection'

export const socketHandlers = (
  get: StoreGet,
  set: StoreSet,
  roomId: string,
  userId: string,
  userPeerId: string,
  webcamPeer: Peer,
  webcamPeerId: string
) => {
  return {
    userConnected: (remotePeerId: string, remoteData: PeerMetadata) => {
      console.log(`[通知] 用戶 ${remotePeerId} 已加入房間`)

      const answerStream = get().webcams[0].stream

      const myMetadata: { metadata: PeerMetadata } = {
        metadata: {
          userId,
          userPeerId,
          peerId: webcamPeerId,
          streamType: 'webcam',
          video: remoteData.video,
          audio: remoteData.audio,
        },
      }

      if (!answerStream) {
        console.error('[ERROR] userStream is invalid')
        return
      }

      // 主動聯繫別人，並接收對方的來電
      const call = webcamPeer.call(remotePeerId, answerStream, myMetadata)

      // 播放對方視訊
      const { onStream, onClose, onError } = webcamHandlers(get, set, call, remoteData)
      call.on('stream', onStream).on('close', onClose).on('error', onError)

      const { myScreenPeer, myScreenPeerId, screens } = get()
      const screen = screens[0]
      const socket = get().socket!

      if (myScreenPeerId && myScreenPeer) {
        console.log('目前正在分享螢幕, ScreenPeerId:', myScreenPeerId)

        // 所有連線設置完成(Socket.io 與 Peerjs 皆建立連線)後，發起
        socket.emit('share-screen', roomId, userPeerId, {
          userId: userId,
          userPeerId: userPeerId,
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
    },
    userDisconnected: (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 已退出房間`)

      // 如果此用戶存在視訊連線，則關閉視訊。
      closeRemoteWebcam(get, set, remotePeerId)

      // 如果此用戶存在畫面連線，則關閉畫面。
      closeRemoteScreen(get, set, remotePeerId)
    },
    userShareScreen: async (remotePeerId: string, remoteData: PeerMetadata) => {
      console.log(`[通知] 用戶 ${remotePeerId} 分享畫面`)
      console.log('remoteData', remoteData)

      // 接受方可能沒有分享畫面。
      if (!get().myScreenPeer) {
        try {
          const { peer: myScreenPeer, peerId: myScreenPeerId } = await createPeer()
          set(() => ({ myScreenPeer, myScreenPeerId }))
        } catch (error) {
          throw error
        }
      }

      // 單向對方視訊播放
      if (remoteData.streamType === 'screen' && remoteData.single === true) {
        const myMetadata: { metadata: PeerMetadata } = {
          metadata: {
            userId,
            userPeerId,
            peerId: get().myScreenPeerId, // 相當於 '' 空字串
            streamType: 'none',
            video: remoteData.video,
            audio: remoteData.audio,
          },
        }

        // 主動聯繫別人，並接收對方的來電(但我沒有畫面)
        const fakeStream = createFakeStream()
        const call = get().myScreenPeer!.call(remoteData.peerId, fakeStream, myMetadata)

        // 播放對方螢幕畫面
        const { onStream, onClose, onError } = screenHandlers(get, set, call, remoteData)
        call.on('stream', onStream).on('close', onClose).on('error', onError)
      }
    },
    userStopShareScreen: (remotePeerId: string, remoteData: PeerMetadata) => {
      console.log(`[通知] 用戶 ${remotePeerId} 停止分享畫面`)

      // 如果此用戶存在畫面的連線，關閉此連線。
      closeRemoteScreen(get, set, remotePeerId)
    },
    userResetWebcam: (remotePeerId: string, remoteData: PeerMetadata) => {
      console.log(`[通知] 用戶 ${remotePeerId} 重置視訊鏡頭`)

      const answerStream = get().webcams[0].stream

      // 如果此用戶存在視訊連線，則關閉視訊。
      closeRemoteWebcam(get, set, remotePeerId)

      const myMetadata: { metadata: PeerMetadata } = {
        metadata: {
          userId,
          userPeerId,
          peerId: webcamPeerId,
          streamType: 'webcam',
          video: remoteData.video,
          audio: remoteData.audio,
        },
      }

      if (!answerStream) {
        console.error('[ERROR] userStream is invalid')
        return
      }

      // 主動聯繫別人，並接收對方的來電
      console.log('重新聯繫該已重置視訊的用戶', remotePeerId)
      const newWebcamPeerId = remoteData.peerId
      const call = webcamPeer.call(newWebcamPeerId, answerStream, myMetadata)

      // 播放對方視訊
      const { onStream, onClose, onError } = webcamHandlers(get, set, call, remoteData)
      call.on('stream', onStream).on('close', onClose).on('error', onError)
    },
  }
}

function closeRemoteWebcam(get: StoreGet, set: StoreSet, remoteUserPeerId: string) {
  console.log('[Socket] 關閉用戶視訊串流', remoteUserPeerId)
  const webcam = get().peerWebcamMap.get(remoteUserPeerId)
  if (!webcam) return
  webcam.call.close()
}

function closeRemoteScreen(get: StoreGet, set: StoreSet, remoteUserPeerId: string) {
  console.log('[Socket] 關閉用戶畫面串流', remoteUserPeerId)
  const screen = get().peerScreenMap.get(remoteUserPeerId)
  if (!screen) return
  screen.call.close()
}
