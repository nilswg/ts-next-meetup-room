// @ts-check

import { PeerServer } from './lib/peer/peer.min.ts'

console.log('DENO_ENV: ', Deno.env.get('DENO_ENV'))

const PORT = Deno.env.get('DENO_ENV') === 'production' ? 80 : 4001

const peerServer = PeerServer({
  port: PORT,
  path: '/peerjs',
})

peerServer.on('connection', (client) => {
  console.log(`使用者連線: Id: ${client.getId().slice(0, 10)}`)
})

peerServer.on('disconnect', (client) => {
  console.log(`使用者離線: Id: ${client.getId().slice(0, 10)}`)
})

console.log(`listening on ${PORT}`)
