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

  socket.on('join-room', (roomId, userPeerId, metadata) => {
    // 讓用戶加入房間
    socket.join(roomId)
    console.log(`用戶 ${userPeerId.slice(0, 10)} 加入房間 ${roomId.slice(0, 6)}`)
    console.log('用戶資料: ', { metadata })

    // 通知其他用戶有新用戶加入房間。
    socket.to(roomId).emit('user-connected', userPeerId, metadata)

    // 監聽用戶斷開連接事件
    socket.on('disconnect', () => {
      // 讓用戶離開房間
      socket.leave(roomId)
      console.log(`用戶 ${userPeerId.slice(0, 10)} 離開房間 ${roomId.slice(0, 6)}`)

      // 通知其他用戶有用戶離開房間
      socket.to(roomId).emit('user-disconnected', userPeerId)
    })

    // 重新啟動攝影機
    socket.on('reset-webcam', (roomId, userPeerId, metadata) => {
      console.log(`用戶 ${userPeerId.slice(0, 10)} 重置鏡頭於房間 ${roomId.slice(0, 6)}`)
      console.log('用戶資料: ', { metadata })

      // 通知其他用戶有用戶重新啟動攝影機。
      socket.to(roomId).emit('user-reset-webcam', userPeerId, metadata)
    })

    // 監聽用戶分享畫面
    socket.on('share-screen', (roomId, userPeerId, metadata) => {
      console.log(`用戶 ${userPeerId.slice(0, 10)} 分享畫面於房間 ${roomId.slice(0, 6)}`)
      console.log('用戶資料: ', { metadata })

      // 通知其他用戶有用戶分享畫面。
      socket.to(roomId).emit('user-share-screen', userPeerId, metadata)
    })

    // 監聽用戶分享畫面
    socket.on('stop-share-screen', (roomId, userPeerId, metadata) => {
      console.log(`用戶 ${userPeerId.slice(0, 10)} 停止分享畫面於房間 ${roomId.slice(0, 6)}`)
      console.log('用戶資料: ', { metadata })

      // 通知其他用戶有用戶分享畫面。
      socket.to(roomId).emit('user-stop-share-screen', userPeerId, metadata)
    })
  })
})

httpServer.listen(PORT, () => console.log(`listening on ${PORT}`))
