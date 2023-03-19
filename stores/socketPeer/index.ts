import { setStreamAudio, setStreamVideo } from '@/lib/stream'
import type { MediaConnection, Peer } from 'peerjs'
import type { Socket } from 'socket.io-client'
import { create } from 'zustand'
import { createScreenStream } from './createScreenStream'
import { enterMeetupRoom } from './enterMeetupRoom'
import { handleWebcamStream } from './handleWebcamStream'
import { leaveMeetupRoom } from './leaveMeetupRoom'
import { removeScreenStream } from './removeScreenStream'
import { removeWebcamStream } from './removeWebcamStream'
import { resetWebcam } from './resetWebcam'
import { screenShare } from './screenShare'
import { stopScreenShare } from './stopScreenShare'

export type Store = {
  enterRoomLoading: boolean
  shareScreenLoading: boolean
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  myUserId: string
  myUserPeerId: string
  myWebcamPeer: Peer | null
  myWebcamPeerId: string
  myScreenPeer: Peer | null
  myScreenPeerId: string
  webcams: WebcamProps[]
  screens: ScreenProps[]
  peerWebcamMap: Map<string, { webcamPeerId: string; call: MediaConnection }>
  peerScreenMap: Map<string, { screenPeerId: string; call: MediaConnection }>
}

type Actions = {
  handleWebcamStream: (getWebcamStream: Promise<MediaStream>) => Promise<MediaStream>
  removeWebcamStream: () => void
  enterMeetupRoom: (props: EnterRoomProps) => Promise<void>
  leaveMeetupRoom: () => void
  resetWebcam: (props: ResetWebcamProps) => void
  screenShare: (props: ShareScreenProps) => void
  stopScreenShare: (props: StopShareScreenProps) => void
  createScreenStream: () => Promise<MediaStream>
  removeScreenStream: () => void
  setWebcamVideo: (video: boolean) => void
  setWebcamAudio: (audio: boolean) => void
  setRemoteVideo: (remotePeerId: string, nextState: boolean) => void
  setRemoteAudio: (remotePeerId: string, nextState: boolean) => void
}

export type StoreSet = (f: (state: Store) => Partial<Store>) => void

export type StoreGet = () => Store

/**
 * 提供給拆分的Store使用，使其保有TypeScript的型態檢查功能
 */
export type CreateStore<T> = (set: (f: (state: Store) => Partial<Store>) => void, get: () => Store) => T

export const useSocketPeerStore = create<Store & Actions>((set, get) => ({
  enterRoomLoading: false,
  shareScreenLoading: false,
  socket: null,
  myUserId: '',
  myUserPeerId: '',
  myWebcamPeer: null,
  myWebcamPeerId: '',
  myScreenPeer: null,
  myScreenPeerId: '',
  peerWebcamMap: new Map(),
  peerScreenMap: new Map(),
  webcams: [
    {
      type: 'user',
      peerId: '',
      userId: '',
      stream: null,
      error: '',
      loading: false,
      video: true,
      audio: false,
    },
  ],
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
  handleWebcamStream: handleWebcamStream(set, get),
  removeWebcamStream: removeWebcamStream(set, get),
  enterMeetupRoom: enterMeetupRoom(set, get),
  leaveMeetupRoom: leaveMeetupRoom(set, get),
  resetWebcam: resetWebcam(set, get),
  screenShare: screenShare(set, get),
  stopScreenShare: stopScreenShare(set, get),
  createScreenStream: createScreenStream(set, get),
  removeScreenStream: removeScreenStream(set, get),
  setWebcamVideo: (nextState: boolean) => {
    const webcam = get().webcams[0]
    setStreamVideo(webcam.stream, nextState)
    set((state) => ({
      webcams: state.webcams.map((e) => (e.type === 'user' ? { ...e, video: nextState } : e)),
    }))
  },
  setWebcamAudio: (nextState: boolean) => {
    const webcam = get().webcams[0]
    setStreamAudio(webcam.stream, nextState)
    set((state) => ({
      webcams: state.webcams.map((e) => (e.type === 'user' ? { ...e, audio: nextState } : e)),
    }))
  },
  setRemoteVideo: (remotePeerId: string, nextState: boolean) => {
    const remote = get().webcams.filter((s) => s.peerId === remotePeerId)[0]
    if (!remote?.stream) {
      alert('remote stream notfound')
      return
    }
    remote.stream.getVideoTracks().forEach((t) => (t.enabled = nextState))
  },
  setRemoteAudio: (remotePeerId: string, nextState: boolean) => {
    const remote = get().webcams.filter((s) => s.peerId === remotePeerId)[0]
    if (!remote?.stream) {
      alert('remote stream notfound')
      return
    }
    remote.stream.getAudioTracks().forEach((t) => (t.enabled = nextState))
  },
}))
