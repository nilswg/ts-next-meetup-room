import { StoreGet, StoreSet } from '.'

export const leaveMeeupRoom = (set: StoreSet, get: StoreGet) => () => {
  // 關閉建立的連線。
  get().socket?.close()
  get().myWebcamPeer?.disconnect()
  get().myScreenPeer?.disconnect()

  // 清除個人連線參數
  set((state) => ({
    //
    socket: null,
    myUserPeerId: '',
    // webcam
    myWebcamPeer: null,
    myWebcamPeerId: '',
    peerWebcamMap: new Map(),
    webcams: state.webcams.filter((e) => e.type !== 'remote'),
    // screen
    myScreenPeer: null,
    myScreenPeerId: '',
    peerScreenMap: new Map(),
    screens: [
      {
        type: 'user',
        peerId: '',
        userId: '',
        stream: null,
        loading: false,
        error: '',
        video: true,
        audio: false,
        frameRate: 30,
      },
    ],
  }))
}
