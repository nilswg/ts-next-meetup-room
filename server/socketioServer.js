// @ts-check

const express = require('express')
const app = express()
const PORT = 4000

// https://socket.io/get-started/chat/
const http = require('http')
const httpServer = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(httpServer, {
  cors: {
    // http://localhost:3000/ 會報錯，後面的 "/"不用加
    origin: 'http://localhost:3000',
  },
})

app.get('/', (req, res) => {
  res.status(200).json({ health: 'ok' })
})

// 監聽任何用戶連線
// socket 是指連入的用戶端連線。
io.on('connection', (socket) => {
  console.log('新用戶連線...')

  socket.on('join-room', (roomId, peerId) => {
    // 讓用戶加入房間
    socket.join(roomId)
    console.log(`用戶 ${peerId} 加入房間 ${roomId.substring(6)}`)

    // 通知其他用戶有新用戶加入房間。
    socket.to(roomId).emit('user-connected', peerId)

    // 監聽用戶斷開連接事件
    socket.on('disconnect', () => {
      // 讓用戶離開房間
      socket.leave(roomId)
      console.log(`用戶 ${peerId} 離開房間 ${roomId.substring(6)}`)

      // 通知其他用戶有用戶離開房間
      socket.to(roomId).emit('user-disconnected', peerId)
    })
  })

  // 隱藏攝影機
  socket.on('hide-camera', (roomId, peerId) => {
    console.log(`用戶 ${peerId} 關閉攝影機`)
    socket.to(roomId).emit('user-off-stream', peerId)
  })

  // 開啟攝影機
  socket.on('show-camera', (roomId, peerId) => {
    console.log(`用戶 ${peerId} 開啟攝影機`)
    socket.to(roomId).emit('user-on-stream', peerId)

    // 希望別人打電話給我，好讓我把新的視訊給這些人
    socket.to(roomId).emit('user-connected', peerId)
  })

})

httpServer.listen(PORT, () => console.log(`listening on ${PORT}`))
