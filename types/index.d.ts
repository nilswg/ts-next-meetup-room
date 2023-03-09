declare module "tw-elements"

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

type ScreenProps = {
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
  answerStream: MediaStream | null
  video: boolean
  audio: boolean
}

type ResetWebcamProps = {
  myRoomId: string
  myUserId: string
  newWebcamStream: MediaStream | null
  video: boolean
  audio: boolean
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
  'stop-user-share-screen': (remoteScreenPeerId: string, remoteData: PeerMetadata) => void
  'user-reset-webcam': (remotePeerId: string, remoteData: PeerMetadata) => void
}

interface ClientToServerEvents {
  'join-room': (myRoomId: string, myPeerId: string, metadata: PeerMetadata) => void
  'share-screen': (myRoomId: string, myPeerId: string, metadata: PeerMetadata) => void
  'stop-share-screen': (myRoomId: string, myPeerId: string, metadata: PeerMetadata) => void
  'reset-webcam': (myRoomId: string, myPeerId: string, metadata: PeerMetadata) => void
}
