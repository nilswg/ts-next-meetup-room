// @ts-check

const express = require('express')
const app = express()
const PORT = 4001

const http = require('http')
const httpServer = http.createServer(app)

const { ExpressPeerServer } = require('peer')

app.get('/', (req, res) => {
  res.status(200).json({ health: 'ok' })
})

// connect to .../peerjs
app.use('/peerjs', ExpressPeerServer(httpServer))

httpServer.listen(PORT, () => console.log(`listening on ${PORT}`));