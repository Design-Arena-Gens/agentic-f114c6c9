'use client'

import { useState, useEffect } from 'react'

const aiTools = [
  {
    category: 'Research',
    icon: '🔍',
    tools: ['Socialsonic']
  },
  {
    category: 'Script Writing',
    icon: '✍️',
    tools: ['Poppy AI', 'Subscribr']
  },
  {
    category: 'AI Voice',
    icon: '🎙️',
    tools: ['Eleven Labs', 'Play.ht']
  },
  {
    category: 'AI Avatars',
    icon: '👤',
    tools: ['Heygen', 'Synthesia']
  },
  {
    category: 'AI Video',
    icon: '🎬',
    tools: ['Kling AI', 'Veo3']
  },
  {
    category: 'Image Upscaler',
    icon: '📸',
    tools: ['Topaz', 'Magnific']
  },
  {
    category: 'Image Gen',
    icon: '🎨',
    tools: ['Recraft', 'Ideogram']
  },
  {
    category: 'Music Gen',
    icon: '🎵',
    tools: ['Suno AI', 'Aiva']
  },
  {
    category: 'Video Editing',
    icon: '✂️',
    tools: ['Captions', 'InVideo']
  }
]

export default function Home() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<number>(0)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      const englishVoice = availableVoices.findIndex(voice =>
        voice.lang.startsWith('en') && voice.name.includes('Google')
      )
      if (englishVoice !== -1) {
        setSelectedVoice(englishVoice)
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const generateScript = () => {
    let script = "Welcome to the comprehensive AI Tools Guide for content creators. "

    aiTools.forEach(category => {
      script += `For ${category.category}, we recommend ${category.tools.join(' and ')}. `
    })

    script += "These powerful AI tools will revolutionize your content creation workflow, saving you time and enhancing quality. "
    script += "Start exploring these tools today and unlock your creative potential!"

    return script
  }

  const speak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(generateScript())

      if (voices.length > 0 && voices[selectedVoice]) {
        utterance.voice = voices[selectedVoice]
      }

      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎯 AI Tools Voice Guide</h1>
        <p>Discover the best AI tools for content creation</p>
      </div>

      <div className="status">
        <div className={`status-text ${isSpeaking ? 'speaking' : ''}`}>
          {isSpeaking ? (isPaused ? '⏸️ Paused' : '🔊 Speaking...') : '🔇 Ready'}
        </div>
      </div>

      <div className="controls">
        <button
          className="btn btn-primary"
          onClick={speak}
          disabled={isSpeaking && !isPaused}
        >
          {isSpeaking ? '🔄 Restart' : '▶️ Play Voice Guide'}
        </button>

        {isSpeaking && !isPaused && (
          <button className="btn btn-secondary" onClick={pause}>
            ⏸️ Pause
          </button>
        )}

        {isPaused && (
          <button className="btn btn-secondary" onClick={resume}>
            ▶️ Resume
          </button>
        )}

        {isSpeaking && (
          <button className="btn btn-secondary" onClick={stop}>
            ⏹️ Stop
          </button>
        )}
      </div>

      <div className="audio-controls">
        <div className="volume-control">
          <label>🗣️ Voice:</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(Number(e.target.value))}
            disabled={isSpeaking}
          >
            {voices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="volume-control">
          <label>⚡ Speed: {rate.toFixed(1)}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            disabled={isSpeaking}
          />
        </div>

        <div className="volume-control">
          <label>🎚️ Volume: {Math.round(volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="tools-grid">
        {aiTools.map((category, index) => (
          <div key={index} className="tool-card">
            <h2>
              <span>{category.icon}</span>
              {category.category}
            </h2>
            <ul>
              {category.tools.map((tool, toolIndex) => (
                <li key={toolIndex}>✨ {tool}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
