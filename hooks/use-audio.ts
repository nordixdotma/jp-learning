"use client"

import { useCallback, useRef } from "react"

// Text-to-speech for kana pronunciation
export function useAudio() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback((text: string, lang = "ja-JP") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.8 // Slower for learning
    utterance.pitch = 1

    // Try to find a Japanese voice
    const voices = window.speechSynthesis.getVoices()
    const japaneseVoice = voices.find((v) => v.lang.startsWith("ja"))
    if (japaneseVoice) {
      utterance.voice = japaneseVoice
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  return { speak, stop }
}
