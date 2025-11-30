"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eraser, RotateCcw, Check, ChevronLeft, ChevronRight, Volume2 } from "lucide-react"
import type { KanaItem } from "@/lib/kana-data"
import { useAudio } from "@/hooks/use-audio"
import { cn } from "@/lib/utils"

interface HandwritingCanvasProps {
  items: KanaItem[]
  onComplete?: () => void
  onExit?: () => void
}

export function HandwritingCanvas({ items, onComplete, onExit }: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [strokeCount, setStrokeCount] = useState(0)
  const [showGuide, setShowGuide] = useState(true)
  const { speak } = useAudio()

  const currentItem = items[currentIndex]

  // Setup canvas with proper sizing
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const size = Math.min(rect.width, rect.height, 300)

    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = 8
    }
  }, [])

  useEffect(() => {
    setupCanvas()
    window.addEventListener("resize", setupCanvas)
    return () => window.removeEventListener("resize", setupCanvas)
  }, [setupCanvas])

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    let clientX: number
    let clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = "var(--foreground)"
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setStrokeCount((prev) => prev + 1)
    }
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.clearRect(0, 0, canvas!.width / dpr, canvas!.height / dpr)
    setStrokeCount(0)
  }

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
      clearCanvas()
    } else {
      onComplete?.()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      clearCanvas()
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onExit} className="rounded-xl">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Exit
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {items.length}
        </span>
        <Button variant="ghost" size="icon" onClick={() => speak(currentItem.character)} className="rounded-full">
          <Volume2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* Character reference */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Write this character:</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-6xl kana-display text-foreground">{currentItem.character}</span>
            <span className="text-2xl font-semibold text-primary">{currentItem.romaji}</span>
          </div>
          {currentItem.strokeCount && (
            <p className="text-xs text-muted-foreground mt-2">
              {currentItem.strokeCount} strokes • You: {strokeCount}
            </p>
          )}
        </div>

        {/* Canvas */}
        <Card className="w-full max-w-[320px] aspect-square relative overflow-hidden">
          <CardContent className="p-0 h-full" ref={containerRef}>
            {/* Guide overlay */}
            {showGuide && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                <span className="text-[200px] kana-display text-foreground">{currentItem.character}</span>
              </div>
            )}

            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-2 border-dashed border-muted opacity-50">
                <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-muted" />
                <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-muted" />
              </div>
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-full touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className={cn("rounded-xl bg-transparent", showGuide && "bg-primary/10")}
          >
            {showGuide ? "Hide Guide" : "Show Guide"}
          </Button>
          <Button variant="outline" size="icon" onClick={clearCanvas} className="rounded-xl bg-transparent">
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={clearCanvas} className="rounded-xl bg-transparent">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 rounded-2xl bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button size="lg" onClick={handleNext} className="flex-1 rounded-2xl">
            {currentIndex === items.length - 1 ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Done
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
