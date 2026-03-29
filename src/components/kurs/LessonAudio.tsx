'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonAudioProps {
  content: Record<string, unknown>
}

export default function LessonAudio({ content }: LessonAudioProps) {
  const audioUrl = content.audioUrl as string
  const transcript = content.transcript as string | undefined

  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onDuration = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) audioRef.current.pause()
    else audioRef.current.play()
    setPlaying(!playing)
  }

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="bg-gradient-to-br from-primary to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={toggle}
            className="h-14 w-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </button>
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const t = Number(e.target.value)
                setCurrentTime(t)
                if (audioRef.current) audioRef.current.currentTime = t
              }}
              className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <div className="flex justify-between text-xs mt-1 opacity-70">
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 opacity-70" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => {
                const v = Number(e.target.value)
                setVolume(v)
                if (audioRef.current) audioRef.current.volume = v
              }}
              className="w-16 h-1 bg-white/30 rounded appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {transcript && (
        <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">Transkript</h4>
          <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
    </div>
  )
}
