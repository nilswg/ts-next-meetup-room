import Peer from 'peerjs'
import { StoreGet, StoreSet } from '@/stores/socketPeer'
import { PeerMetadata } from '@/stores/socketPeer'
import { screenHandlers } from '@/stores/socketPeer/screenHandlers'
import { webcamHandlers } from '@/stores/socketPeer/webcamHandlers'

export const socketHandlers = (
  get: StoreGet,
  set: StoreSet,
  peer: Peer,
  myPeerId: string,
  myUserId: string,
  answerStream: MediaStream | null
) => {
  return {
    userConnected: (remotePeerId: string, remoteData: PeerMetadata) => {
      console.log(`[通知] 用戶 ${remotePeerId} 已加入房間`)

      const myMetadata: { metadata: PeerMetadata } = {
        metadata: {
          streamType: 'webcam',
          userId: myUserId,
          peerId: myPeerId,
          audio: remoteData.audio,
          video: remoteData.video,
        },
      }

      if (!answerStream) {
        console.error('[ERROR] userStream is invalid')
        return
      }

      // 主動聯繫別人，並接收對方的來電
      const call = peer.call(remotePeerId, answerStream, myMetadata)

      // 播放對方視訊
      const { onStream, onClose, onError } = webcamHandlers(get, set, call, remoteData)
      call.on('stream', onStream).on('close', onClose).on('error', onError)

      const { myScreenPeer, screen } = get()
      const myScreenStream = screen.stream
      console.log('目前我有螢幕分享...', { myScreenPeer, myScreenStream })
      if (myScreenPeer && !!myScreenStream) {
        const myScreenMetadata: { metadata: PeerMetadata } = {
          metadata: {
            userId: myUserId,
            peerId: myPeerId,
            audio: remoteData.audio,
            video: remoteData.video,
            streamType: 'screen',
            single: true,
          },
        }

        // 單向
        const call = myScreenPeer.call(remotePeerId, myScreenStream, myScreenMetadata)
      }
    },
    userDisconnected: (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 已退出房間`)

      // 如果此用戶存在則關閉來電
      const call = get().peerMap.get(remotePeerId)
      if (!call) return
      else {
        call.close()
      }
      // 如果此用戶存在畫面的連線，關閉此連線。
      const screen = get().peerScreenMap.get(remotePeerId)
      if (!screen?.call) return
      else {
        console.log('關閉畫面', screen.screenPeerId)
        screen.call.close()
      }
    },
    userShareScreen: (remoteScreenPeerId: string, remoteData: PeerMetadata) => {
      console.log(`[通知] 收到分享畫面 ${remoteScreenPeerId} `)
      console.log('remoteData', remoteData)

      const myMetadata: { metadata: PeerMetadata } = {
        metadata: {
          userId: myUserId,
          peerId: myPeerId,
          audio: remoteData.audio,
          video: remoteData.video,
          streamType: 'none',
        },
      }

      // 單向對方視訊播放
      if (remoteData.streamType === 'screen') {
        // 主動聯繫別人，並接收對方的來電(但我沒有畫面)
        const fakeStream = createMediaStreamFake()
        const call = peer.call(remoteScreenPeerId, fakeStream, myMetadata)

        // 播放對方螢幕畫面
        const { onStream, onClose, onError } = screenHandlers(get, set, call, remoteData)
        call.on('stream', onStream).on('close', onClose).on('error', onError)
      }
    },
    userStopShareScreen: (remoteScreenPeerId: string, remoteData: PeerMetadata) => {
      console.log(`[通知] 分享畫面已停止 ${remoteScreenPeerId} `)
      console.log('remoteData', remoteData)

      const remotePeerId = remoteData.peerId

      get().peerScreenMap.delete(remotePeerId)

      set(() => ({
        remoteScreen: {
          peerId: '',
          userId: '',
          stream: null,
          loading: false,
          error: '',
          video: true,
          audio: false,
          frameRate: 30,
        },
      }))
      // // 如果此用戶存在畫面的連線，關閉此連線。
      // const screen = get().peerScreenMap.get(remotePeerId)
      // if (!screen?.call) return
      // else {
      //   console.log('關閉畫面', screen.screenPeerId)
      //   screen.call.close()
      // }
    },
    userResetWebcam:(remotePeerId: string, remoteData: PeerMetadata)=>{
      console.log(`[通知] 用戶 ${remotePeerId} 重置視訊鏡頭`)

      // 取得先前的 peerId。
      const prePeerId = remoteData.peerId;
      const peerMap =  get().peerMap;
      const preCall = peerMap.get(prePeerId);

      if (preCall) {
        peerMap.delete(prePeerId)
        preCall.close()
      }

      const myMetadata: { metadata: PeerMetadata } = {
        metadata: {
          streamType: 'webcam',
          userId: myUserId,
          peerId: myPeerId,
          audio: remoteData.audio,
          video: remoteData.video,
        },
      }

      if (!answerStream) {
        console.error('[ERROR] userStream is invalid')
        return
      }

      // 主動聯繫別人，並接收對方的來電
      const call = peer.call(remotePeerId, answerStream, myMetadata)

      // 播放對方視訊
      const { onStream, onClose, onError } = webcamHandlers(get, set, call, remoteData)
      call.on('stream', onStream).on('close', onClose).on('error', onError)
    }
  }
}

const createMediaStreamFake = () => {
  return new MediaStream([createEmptyAudioTrack(), createEmptyVideoTrack({ width: 0, height: 0 })])
}

const createEmptyAudioTrack = () => {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const dst = oscillator.connect(ctx.createMediaStreamDestination())
  oscillator.start()
  const track = (dst as AudioNode & { stream: any }).stream.getAudioTracks()[0]
  return Object.assign(track, { enabled: false })
}

const createEmptyVideoTrack = ({ width, height }: any) => {
  const canvas = Object.assign(document.createElement('canvas'), {
    width,
    height,
  })
  const my2d = canvas.getContext('2d')
  if (!my2d) {
    alert('not support canvas 2d')
    return
  }
  my2d.fillRect(0, 0, width, height)
  const stream = canvas.captureStream()
  const track = stream.getVideoTracks()[0]

  return Object.assign(track, { enabled: false })
}
