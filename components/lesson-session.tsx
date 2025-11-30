"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, ChevronRight, Volume2, Check, XIcon, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LessonGroup, KanaItem } from "@/lib/kana-data"
import { useAudio } from "@/hooks/use-audio"
import { Flashcard } from "./flashcard"

type SessionPhase = "intro" | "learn" | "quiz" | "complete"

interface LessonSessionProps {
  lesson: LessonGroup
  onComplete: (results: Record<string, number>) => void
  onExit: () => void
}

export function LessonSession({ lesson, onComplete, onExit }: LessonSessionProps) {
  const [phase, setPhase] = useState<SessionPhase>("intro")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<Record<string, number>>({})
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({})
  const { speak } = useAudio()

  const totalSteps = lesson.items.length * 2 // Learn + Quiz for each
  const currentStep =
    phase === "learn" ? currentIndex + 1 : phase === "quiz" ? lesson.items.length + currentIndex + 1 : 0
  const progress = (currentStep / totalSteps) * 100

  // Generate quiz options
  const quizOptions = useMemo(() => {
    if (phase !== "quiz") return []
    const currentItem = lesson.items[currentIndex]
    const otherItems = lesson.items.filter((i) => i.id !== currentItem.id)
    const shuffled = [...otherItems].sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [currentItem, ...shuffled].sort(() => Math.random() - 0.5)
    return options
  }, [phase, currentIndex, lesson.items])

  const handleLearnNext = () => {
    if (currentIndex < lesson.items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setPhase("quiz")
      setCurrentIndex(0)
    }
  }

  const handleQuizAnswer = (selectedItem: KanaItem) => {
    const currentItem = lesson.items[currentIndex]
    const isCorrect = selectedItem.id === currentItem.id

    setQuizAnswers((prev) => ({ ...prev, [currentIndex]: isCorrect }))
    setResults((prev) => ({
      ...prev,
      [currentItem.id]: isCorrect ? 5 : 1, // 5 = perfect, 1 = fail in SM-2
    }))

    setTimeout(() => {
      if (currentIndex < lesson.items.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setPhase("complete")
      }
    }, 1000)
  }

  const correctCount = Object.values(quizAnswers).filter(Boolean).length
  const accuracy = lesson.items.length > 0 ? (correctCount / lesson.items.length) * 100 : 0

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onExit} className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-sm text-muted-foreground">
          {currentStep}/{totalSteps}
        </span>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="text-4xl kana-display">{lesson.items[0]?.character}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{lesson.name}</h1>
              <p className="text-muted-foreground mb-8">{lesson.description}</p>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {lesson.items.map((item) => (
                  <div key={item.id} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="text-xl kana-display">{item.character}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="rounded-2xl" onClick={() => setPhase("learn")}>
                Start Learning
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {phase === "learn" && (
            <motion.div
              key={`learn-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col items-center justify-center max-w-sm mx-auto"
            >
              <p className="text-sm text-muted-foreground mb-4">Learn this character</p>
              <Flashcard item={lesson.items[currentIndex]} />
              <Button size="lg" className="mt-8 rounded-2xl w-full max-w-xs" onClick={handleLearnNext}>
                {currentIndex < lesson.items.length - 1 ? "Next" : "Start Quiz"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {phase === "quiz" && (
            <motion.div
              key={`quiz-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col items-center justify-center max-w-sm mx-auto"
            >
              <p className="text-sm text-muted-foreground mb-2">What is this character?</p>

              <Card className="w-full aspect-square max-w-[200px] mb-8">
                <CardContent className="h-full flex items-center justify-center">
                  <button onClick={() => speak(lesson.items[currentIndex].character)} className="text-center">
                    <span className="text-7xl kana-display text-foreground">
                      {lesson.items[currentIndex].character}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
                      <Volume2 className="h-4 w-4" /> Tap to hear
                    </p>
                  </button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3 w-full">
                {quizOptions.map((option) => {
                  const answered = currentIndex in quizAnswers
                  const isCorrect = option.id === lesson.items[currentIndex].id
                  const wasSelected = answered && quizAnswers[currentIndex] === isCorrect

                  return (
                    <Button
                      key={option.id}
                      variant="outline"
                      size="lg"
                      disabled={answered}
                      className={cn(
                        "h-16 text-xl font-bold rounded-2xl transition-all",
                        answered && isCorrect && "bg-success/20 border-success text-success",
                        answered &&
                          !isCorrect &&
                          wasSelected &&
                          "bg-destructive/20 border-destructive text-destructive",
                      )}
                      onClick={() => handleQuizAnswer(option)}
                    >
                      {option.romaji}
                      {answered && isCorrect && <Check className="ml-2 h-5 w-5" />}
                      {answered && !isCorrect && wasSelected && <XIcon className="ml-2 h-5 w-5" />}
                    </Button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6"
              >
                <Sparkles className="h-12 w-12 text-success" />
              </motion.div>

              <h1 className="text-2xl font-bold text-foreground mb-2">Lesson Complete!</h1>
              <p className="text-muted-foreground mb-6">You finished {lesson.name}</p>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {correctCount}/{lesson.items.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-foreground">{Math.round(accuracy)}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </CardContent>
                </Card>
              </div>

              <Button size="lg" className="rounded-2xl w-full" onClick={() => onComplete(results)}>
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
