import useClient from '@/hooks/useClient'
import { useDevicesStore } from '@/stores/devices'
import { useSockerPeerStore } from '@/stores/socketPeer'
import { useRef } from 'react'

function UserAudioSpeaker() {
  const { audioIds } = useDevicesStore()
  const {
    webcams,
  } = useSockerPeerStore()

  const { stream } = webcams[0]

  const ref = useRef<HTMLAudioElement | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const srcMusic = useRef<MediaElementAudioSourceNode | null>(null)
  const srcStream = useRef<MediaStreamAudioSourceNode | null>(null)

  // 將音訊播放設備切換為指定的設備
  useClient(() => {
    if (stream && ref.current) {
      // 創建一個 AudioContext 和 MediaElementAudioSourceNode 來處理音訊
      // AudioContext 是 Web Audio API 的核心，它提供了一個音頻處理環境
      if (!audioCtx?.current) {
        audioCtx.current = new AudioContext()
      }

      // source 一個可被加工、操作或輸出的音訊來源，如麥克風、媒體流或是預先載入
      // 的音訊檔案等。此處能替換成其他聲音來源，例如視訊的串流等
      if (!srcMusic.current) {
        srcMusic.current = audioCtx.current.createMediaElementSource(ref.current)
      }
      if (!srcStream.current) {
        srcStream.current = audioCtx.current.createMediaStreamSource(stream)
      }

      // 強制轉型成MyAudioContext類型，解決在TypeScript中，setSinkId方法不存在的問題。
      if ('setSinkId' in AudioContext.prototype) {
        audioCtx.current.setSinkId(audioIds.id)
      }

      srcMusic.current.connect(audioCtx.current.destination)
      srcStream.current.connect(audioCtx.current.destination)
      ref.current.play()
    }

    return () => {}
  }, [audioIds])

  return (
    <>
      <h1>音效</h1>
      <audio ref={ref} controls autoPlay={true}>
        <source src="/mp3/music.mp3" type="audio/mpeg" />
      </audio>
    </>
  )
}

export default UserAudioSpeaker
