import type { StoreGet, StoreSet } from ".";

export const stopScreenShare = (set: StoreSet, get: StoreGet) => (props: StopShareScreenProps) => {
  const socket = get().socket!
  const { myScreenPeer, myScreenPeerId, myUserPeerId } = get()
  const { myRoomId, myUserId } = props

  // 清除連線。
  myScreenPeer?.disconnect()
  set(() => ({ myScreenPeer: null, myScreenPeerId: '' }))

  // 更新狀態
  set((state) => ({
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

  // 將所有與分享畫面有關的連線設置清空
  socket.emit('stop-share-screen', myRoomId, myUserPeerId, {
    userId: myUserId,
    userPeerId: myUserPeerId,
    peerId: myScreenPeerId,
    streamType: 'screen',
    video: false,
    audio: false,
    single: true,
  })
}
