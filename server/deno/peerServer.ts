// @ts-check

console.log('DENO_ENV: ', Deno.env.get('DENO_ENV'))

const isProd = Deno.env.get('DENO_ENV') === 'production'
const PORT = isProd ? 80 : 4001
const BASE_URL = isProd ? process.env['DENO_BASE_URL'] : 'http://localhost:3000' // 後面的 "/"不用加

import express from './lib/express/express.min.ts'
import { ExpressPeerServer } from './lib/peer/peer.min.ts'
import { createServer } from 'https://deno.land/std@0.166.0/node/http.ts'

const app = express()
const httpServer = createServer(app)
const peerServer = ExpressPeerServer(httpServer)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', BASE_URL)
  next()
})

app.get('/', (req, res) => {
  res.status(200).json({ health: 'ok' })
})

app.use('/peerjs', peerServer)

peerServer.on('connection', (client) => {
  console.log(`使用者連線: Id: ${client.getId().slice(0, 10)}`)
})

peerServer.on('disconnect', (client) => {
  console.log(`使用者離線: Id: ${client.getId().slice(0, 10)}`)
})

httpServer.listen(PORT, () => console.log(`listening on ${PORT}`))
