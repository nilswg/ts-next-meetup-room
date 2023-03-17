// @ts-check
console.log('NODE_ENV: ', process.env['NODE_ENV'])

const PORT = process.env['NODE_ENV'] === 'production' ? 80 : 4001

const express = require('express')
const app = express()

const http = require('http')
const httpServer = http.createServer(app)

const { ExpressPeerServer } = require('peer')
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
