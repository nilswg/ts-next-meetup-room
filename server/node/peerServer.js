// @ts-check
console.log('NODE_ENV: ', process.env['NODE_ENV'])

const isProd = process.env['NODE_ENV'] === 'production';
const PORT = isProd ? 80 : 4001

const express = require('express')
const http = require('http')
const { ExpressPeerServer } = require('peer')

const app = express()
const httpServer = http.createServer(app)
const peerServer = ExpressPeerServer(httpServer)

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
