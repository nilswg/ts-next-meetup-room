declare module 'tw-elements'

type PeerMetadata = {
  userId: string // 加入房間的用戶ID
  userPeerId: string // 加入房間的用戶 PeerID
  peerId: string // 設備的PeerID
  streamType: 'webcam' | 'screen' | 'none' // 鏡頭,螢幕,沒有
  video: boolean
  audio: boolean //
  single?: boolean // 使否為單向傳輸
  frameRate?: number
}

type DeviceIDs = {
  id: string
  groupId: string
}

type DeviceProps = {
  id: string
  groupId: string
  kind: MediaDeviceKind
  label: string
}

type WebcamProps = {
  type: 'user' | 'remote'
  peerId: string
  userId: string
  stream: MediaStream | null
  error: string
  loading: boolean
  video: boolean
  audio: boolean
}

type ScreenProps = {
  type: 'user' | 'remote'
  peerId: string
  userId: string
  stream: MediaStream | null
  error: string
  loading: boolean
  video: boolean
  audio: boolean
  frameRate: number
}

type EnterRoomProps = {
  myRoomId: string
  myUserId: string
  // answerStream: MediaStream | null
  // video: boolean
  // audio: boolean
}

type ResetWebcamProps = {
  myRoomId: string
  myUserId: string
  // newWebcamStream: MediaStream | null
  // video: boolean
  // audio: boolean
}

type ShareScreenProps = {
  myRoomId: string
  myUserId: string
  answerStream: MediaStream | null
  video: boolean
  audio: boolean
}

type StopShareScreenProps = {
  myRoomId: string
  myUserId: string
}

interface ServerToClientEvents {
  'user-connected': (remotePeerId: string, remoteData: PeerMetadata) => void
  'user-disconnected': (remotePeerId: string) => void
  'user-share-screen': (remoteScreenPeerId: string, remoteData: PeerMetadata) => void
  'user-stop-share-screen': (remoteScreenPeerId: string, remoteData: PeerMetadata) => void
  'user-reset-webcam': (remotePeerId: string, remoteData: PeerMetadata) => void
}

interface ClientToServerEvents {
  'join-room': (myRoomId: string, myPeerId: string, metadata: PeerMetadata) => void
  'share-screen': (myRoomId: string, myPeerId: string, metadata: PeerMetadata) => void
  'stop-share-screen': (myRoomId: string, myPeerId: string, metadata: PeerMetadata) => void
  'reset-webcam': (myRoomId: string, myPeerId: string, metadata: PeerMetadata) => void
}
