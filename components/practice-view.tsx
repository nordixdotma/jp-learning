"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Clock, Target, Brain, Volume2, Check, X, PenTool } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserProgress } from "@/lib/progress-store"
import { getAllKana, type KanaItem } from "@/lib/kana-data"
import { useAudio } from "@/hooks/use-audio"
import { motion, AnimatePresence } from "framer-motion"
import { HandwritingCanvas } from "./handwriting-canvas"

interface PracticeViewProps {
  progress: UserProgress
  dueItems: KanaItem[]
  weakItems: KanaItem[]
  onRecordAnswer: (itemId: string, quality: number) => void
}

type PracticeMode = "flashcards" | "quiz" | "listening" | "writing"

export function PracticeView({ progress, dueItems, weakItems, onRecordAnswer }: PracticeViewProps) {
  const [mode, setMode] = useState<PracticeMode | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionItems, setSessionItems] = useState<KanaItem[]>([])
  const [sessionResults, setSessionResults] = useState<Record<string, boolean>>({})
  const { speak } = useAudio()

  const startPractice = (selectedMode: PracticeMode, items?: KanaItem[]) => {
    const practiceItems =
      items || dueItems.length > 0
        ? dueItems.slice(0, 10)
        : getAllKana()
            .filter((k) => progress.selectedGoals.includes(k.type))
            .slice(0, 10)

    setSessionItems(practiceItems.sort(() => Math.random() - 0.5))
    setMode(selectedMode)
    setCurrentIndex(0)
    setShowAnswer(false)
    setSessionResults({})
  }

  const handleAnswer = (correct: boolean) => {
    const currentItem = sessionItems[currentIndex]
    onRecordAnswer(currentItem.id, correct ? 5 : 1)
    setSessionResults((prev) => ({ ...prev, [currentItem.id]: correct }))

    setTimeout(() => {
      if (currentIndex < sessionItems.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowAnswer(false)
      } else {
        setMode(null)
      }
    }, 500)
  }

  const quizOptions = useMemo(() => {
    if ((mode !== "quiz" && mode !== "listening") || sessionItems.length === 0) return []
    const currentItem = sessionItems[currentIndex]
    const allItems = getAllKana().filter((k) => k.type === currentItem.type)
    const otherItems = allItems.filter((i) => i.id !== currentItem.id)
    const shuffled = [...otherItems].sort(() => Math.random() - 0.5).slice(0, 3)
    return [currentItem, ...shuffled].sort(() => Math.random() - 0.5)
  }, [mode, currentIndex, sessionItems])

  if (mode === "writing" && sessionItems.length > 0) {
    return <HandwritingCanvas items={sessionItems} onComplete={() => setMode(null)} onExit={() => setMode(null)} />
  }

  if (mode && sessionItems.length > 0 && mode !== "writing") {
    const currentItem = sessionItems[currentIndex]
    const sessionProgress = ((currentIndex + 1) / sessionItems.length) * 100

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-4 p-4 border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => setMode(null)} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${sessionProgress}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1}/{sessionItems.length}
          </span>
        </header>

        {/* Practice Content */}
        <main className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {mode === "flashcards" && (
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-sm space-y-6"
              >
                <Card className="aspect-square cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
                  <CardContent className="h-full flex flex-col items-center justify-center">
                    <span className="text-8xl kana-display text-foreground mb-4">{currentItem.character}</span>
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <span className="text-3xl font-bold text-primary">{currentItem.romaji}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            speak(currentItem.character)
                          }}
                        >
                          <Volume2 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {showAnswer && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 rounded-2xl border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={() => handleAnswer(false)}
                    >
                      <X className="mr-2 h-5 w-5" />
                      Again
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 rounded-2xl bg-success hover:bg-success/90"
                      onClick={() => handleAnswer(true)}
                    >
                      <Check className="mr-2 h-5 w-5" />
                      Got it
                    </Button>
                  </motion.div>
                )}

                {!showAnswer && <p className="text-center text-muted-foreground">Tap the card to reveal the answer</p>}
              </motion.div>
            )}

            {mode === "quiz" && (
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-sm space-y-6"
              >
                <p className="text-center text-muted-foreground">What is this character?</p>

                <Card className="aspect-square max-w-[200px] mx-auto">
                  <CardContent className="h-full flex items-center justify-center">
                    <button onClick={() => speak(currentItem.character)}>
                      <span className="text-7xl kana-display text-foreground">{currentItem.character}</span>
                    </button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  {quizOptions.map((option) => {
                    const answered = currentItem.id in sessionResults
                    const isCorrect = option.id === currentItem.id
                    const wasSelected = sessionResults[currentItem.id] !== undefined

                    return (
                      <Button
                        key={option.id}
                        variant="outline"
                        size="lg"
                        disabled={answered}
                        className={cn(
                          "h-16 text-xl font-bold rounded-2xl",
                          answered && isCorrect && "bg-success/20 border-success",
                          answered && !isCorrect && wasSelected && "bg-destructive/20 border-destructive",
                        )}
                        onClick={() => handleAnswer(option.id === currentItem.id)}
                      >
                        {option.romaji}
                      </Button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {mode === "listening" && (
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-sm space-y-6"
              >
                <p className="text-center text-muted-foreground">Listen and identify</p>

                <Card className="aspect-square max-w-[200px] mx-auto">
                  <CardContent className="h-full flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-24 w-24 rounded-full"
                      onClick={() => speak(currentItem.character)}
                    >
                      <Volume2 className="h-12 w-12" />
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  {quizOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      size="lg"
                      className="h-20 text-3xl kana-display rounded-2xl bg-transparent"
                      onClick={() => handleAnswer(option.id === currentItem.id)}
                    >
                      {option.character}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Practice</h1>
        <p className="text-muted-foreground">Strengthen your memory with different exercises</p>
      </div>

      {/* Due for Review */}
      {dueItems.length > 0 && (
        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Due for Review</p>
                  <p className="text-sm text-muted-foreground">{dueItems.length} items need review</p>
                </div>
              </div>
              <Button size="sm" className="rounded-xl" onClick={() => startPractice("flashcards", dueItems)}>
                Start
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice Modes */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Practice Modes</h2>

        <div className="grid gap-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => startPractice("flashcards")}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shuffle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Flashcards</h3>
                <p className="text-sm text-muted-foreground">Classic flip cards with self-assessment</p>
              </div>
              <Badge variant="secondary">Popular</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => startPractice("quiz")}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Multiple Choice</h3>
                <p className="text-sm text-muted-foreground">Test your recognition with 4 options</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => startPractice("listening")}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
                <Volume2 className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Listening</h3>
                <p className="text-sm text-muted-foreground">Hear the sound, pick the character</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => startPractice("writing")}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Writing Practice</h3>
                <p className="text-sm text-muted-foreground">Practice drawing characters by hand</p>
              </div>
              <Badge variant="secondary">New</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weak Items */}
      {weakItems.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Needs More Practice</h2>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Characters you often miss</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {weakItems.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"
                  >
                    <span className="text-lg kana-display">{item.character}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl bg-transparent"
                onClick={() => startPractice("flashcards", weakItems)}
              >
                Practice Weak Items
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
