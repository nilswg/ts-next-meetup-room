import type { StoreGet, StoreSet } from '.'
import { setStreamAudio, setStreamVideo } from '@/lib/stream'
import { Application, Graphics, Text, TextStyle } from 'pixi.js'

export const createWebcamStream =
  (set: StoreSet, get: StoreGet) =>
  (constraints: MediaStreamConstraints): Promise<MediaStream> => {
    set((state) => ({
      webcams: state.webcams.map((e) => (e.type === 'user' ? { ...e, loading: true, error: '' } : e)),
    }))
    return new Promise((resolve, reject) => {
      const webcam = get().webcams[0]

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (constraints.video === false) {
            const track = getCanvasVideoTrack(get().myUserId)

            // add the video track to an existing MediaStream
            stream.addTrack(track)

            const tracks = stream.getTracks()
            console.log('tracks', { tracks })
          }

          // 根據使用者使用設定，選擇是否呈現畫面、是否靜音
          setStreamVideo(stream, webcam.video)
          setStreamAudio(stream, webcam.audio)
          set((state) => ({
            webcams: state.webcams.map((e) => (e.type === 'user' ? { ...e, stream } : e)),
          }))
          resolve(stream)
        })
        .catch((error) => {
          set((state) => ({
            webcams: state.webcams.map((e) =>
              e.type === 'user' ? { ...e, error: error?.message ?? 'get webcam media failed' } : e
            ),
          }))
          reject(error)
        })
        .finally(() => {
          set((state) => ({
            webcams: state.webcams.map((e) => (e.type === 'user' ? { ...e, loading: false } : e)),
          }))
        })
    })
  }

function getCanvasVideoTrack(myUserId: string) {
  // draw with pixi.js
  const width = 1920
  const height = 1080
  var app = new Application({ width, height, backgroundColor: 'rgb(36 36 36)' })

  const g = new Graphics()
  g.lineStyle(20, 'rgb(200 200 200)', 1);
  g.beginFill('rgb(2 132 199)', 1)
  g.drawCircle(width / 2, height / 2, 380)
  g.endFill()
  app.stage.addChild(g)

  const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 200,
    fontWeight: 'bold',
    fill: ['rgb(220 220 220)', 'rgb(190 190 190)'], // gradient
    stroke: '#4a1850',
    strokeThickness: 2,
    dropShadow: true,
    dropShadowColor: 'rgb(23 23 23)',
    dropShadowBlur: 2,
    dropShadowAngle: Math.PI / 10,
    dropShadowDistance: 10,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round',
  })
  const text = new Text(myUserId.slice(0,3).toUpperCase(), style)
  text.x = width / 2
  text.y = height / 2
  text.anchor.set(0.5, 0.5)
  app.stage.addChild(text)

  // 使用 PIXI Application 會自動創建一個 View，即是 Canvas
  const canvas = app.view as HTMLCanvasElement

  // 從 Canvas 獲得 MediaStream
  const canvasStream = canvas.captureStream(30) // 30 FPS

  const videoTrack = canvasStream.getVideoTracks()[0]

  return Object.assign(videoTrack, {
    // noFlip 用於通知 Video Box 不要反轉畫面。
    noFlip: true,
    enabled: false,
  })
}
