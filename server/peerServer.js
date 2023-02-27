// @ts-check

const express = require('express')
const app = express()
const PORT = 4001

const http = require('http')
const httpServer = http.createServer(app)

const { ExpressPeerServer } = require('peer')
const PeerServer = ExpressPeerServer(httpServer)

app.get('/', (req, res) => {
  res.status(200).json({ health: 'ok' })
})

// connect to .../peerjs
app.use('/peerjs', PeerServer)

PeerServer.on('connection', (client) => {
  console.log(`使用者連線
  {
    Id: ${client.getId()},
    Token: ${client.getToken()}
  }`)
})

PeerServer.on('disconnect', (client) => {
  console.log(`使用者離線
  {
    Id: ${client.getId()},
    Token: ${client.getToken()}
  }`)
})

httpServer.listen(PORT, () => console.log(`listening on ${PORT}`))
