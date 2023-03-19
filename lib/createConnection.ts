import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { Peer } from 'peerjs'

const isProd = process.env['NODE_ENV'] === 'production'
console.log('isProd', isProd)

const SocketIOConfig = isProd ? 'https://nilswg-meetup-socketio.deno.dev' : 'http://localhost:4000'

const PeerConfig = isProd
  ? {
      config: {
        iceServers: [
          {
            url: 'stun:stun.l.google.com:19302',
          },
          {
            url: 'stun:stun1.l.google.com:19302',
          },
          {
            url: 'stun:stun2.l.google.com:19302',
          },
          {
            url: 'stun:stun3.l.google.com:19302',
          },
          {
            url: 'stun:stun4.l.google.com:19302',
          },
        ],
      },
    }
  : {
      host: 'localhost',
      port: 4001,
      path: 'peerjs',
    }

/**
 * 向服務端建立 socket 連線。
 */
export function createSocketIo(): Promise<{ socket: Socket }> {
  const socket = io(SocketIOConfig)
  return new Promise((resolve) => {
    socket.on('connect', () => resolve({ socket }))
  })
}

/**
 * 直接使用 npx peerjs --port=4001 創建伺服器
 */
export async function createPeer(): Promise<{ peer: Peer; peerId: string }> {
  const Peer = (await import('peerjs')).default
  const peer = new Peer(PeerConfig)
  return new Promise((resolve) => {
    peer.on('open', (peerId) => resolve({ peer, peerId }))
  })
}
