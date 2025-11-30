"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { KanaItem } from "@/lib/kana-data"
import { useAudio } from "@/hooks/use-audio"

interface FlashcardProps {
  item: KanaItem
  showRomaji?: boolean
  onFlip?: () => void
  className?: string
}

export function Flashcard({ item, showRomaji = false, onFlip, className }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(showRomaji)
  const { speak } = useAudio()

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    onFlip?.()
  }

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation()
    speak(item.character)
  }

  return (
    <div className={cn("perspective-1000", className)}>
      <motion.div
        className="relative w-full aspect-[4/3] cursor-pointer preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
        onClick={handleFlip}
      >
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden">
          <CardContent className="h-full flex flex-col items-center justify-center p-6">
            <span className="text-7xl md:text-8xl kana-display font-medium text-foreground">{item.character}</span>
            <p className="text-sm text-muted-foreground mt-4">Tap to reveal</p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-primary/5">
          <CardContent className="h-full flex flex-col items-center justify-center p-6">
            <span className="text-5xl md:text-6xl kana-display font-medium text-foreground mb-2">{item.character}</span>
            <span className="text-3xl md:text-4xl font-bold text-primary">{item.romaji}</span>
            <Button variant="ghost" size="icon" className="mt-4 rounded-full" onClick={handleSpeak}>
              <Volume2 className="h-6 w-6" />
              <span className="sr-only">Play pronunciation</span>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls below card */}
      <div className="flex justify-center gap-2 mt-4">
        <Button variant="outline" size="sm" className="rounded-xl bg-transparent" onClick={handleSpeak}>
          <Volume2 className="h-4 w-4 mr-2" />
          Listen
        </Button>
        <Button variant="outline" size="sm" className="rounded-xl bg-transparent" onClick={handleFlip}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Flip
        </Button>
      </div>
    </div>
  )
}
