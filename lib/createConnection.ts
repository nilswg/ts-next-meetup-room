import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { Peer } from 'peerjs'

/**
 * 向服務端建立 socket 連線。
 */
export function createSocketIo(): Promise<{ socket: Socket }> {
  const socket = io('http://localhost:4000')
  return new Promise((resolve) => {
    socket.on('connect', () => resolve({ socket }))
  })
}

/**
 * 直接使用 npx peerjs --port=4001 創建伺服器
 */
export async function createPeer(): Promise<{ peer: Peer; peerId: string }> {
  const Peer = (await import('peerjs')).default
  const peer = new Peer('', {
    host: 'localhost',
    port: 4001,
    path: '/peerjs',
  })
  return new Promise((resolve) => {
    peer.on('open', (peerId) => resolve({ peer, peerId }))
  })
}
