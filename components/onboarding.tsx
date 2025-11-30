"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ChevronRight, Clock, Target, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { KanaType } from "@/lib/kana-data"

interface OnboardingProps {
  onComplete: (goals: KanaType[], dailyMinutes: number) => void
}

const goals = [
  { id: "hiragana" as KanaType, label: "Hiragana", description: "Basic Japanese script", character: "あ" },
  { id: "katakana" as KanaType, label: "Katakana", description: "Script for foreign words", character: "ア" },
  { id: "numbers" as KanaType, label: "Numbers", description: "Count in Japanese", character: "一" },
]

const timeOptions = [
  { minutes: 5, label: "5 min", description: "Quick daily practice" },
  { minutes: 10, label: "10 min", description: "Balanced learning" },
  { minutes: 15, label: "15 min", description: "Deeper immersion" },
  { minutes: 20, label: "20+ min", description: "Intensive study" },
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [selectedGoals, setSelectedGoals] = useState<KanaType[]>(["hiragana"])
  const [dailyMinutes, setDailyMinutes] = useState(10)

  const toggleGoal = (id: KanaType) => {
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))
  }

  const handleComplete = () => {
    onComplete(selectedGoals, dailyMinutes)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-primary" : "w-2 bg-muted",
                i < step && "bg-primary/50",
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome to <span className="kana-display">かな</span>Starter
                </h1>
                <p className="text-muted-foreground">What would you like to learn?</p>
              </div>

              <div className="grid gap-3">
                {goals.map((goal) => (
                  <Card
                    key={goal.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedGoals.includes(goal.id) && "ring-2 ring-primary bg-primary/5",
                    )}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                        <span className="text-2xl kana-display">{goal.character}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{goal.label}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          selectedGoals.includes(goal.id) ? "bg-primary border-primary" : "border-muted-foreground/30",
                        )}
                      >
                        {selectedGoals.includes(goal.id) && <Check className="h-4 w-4 text-primary-foreground" />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full rounded-2xl"
                onClick={() => setStep(1)}
                disabled={selectedGoals.length === 0}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Daily Goal</h2>
                <p className="text-muted-foreground">How much time can you dedicate each day?</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {timeOptions.map((option) => (
                  <Card
                    key={option.minutes}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      dailyMinutes === option.minutes && "ring-2 ring-primary bg-primary/5",
                    )}
                    onClick={() => setDailyMinutes(option.minutes)}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 rounded-2xl bg-transparent"
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button size="lg" className="flex-1 rounded-2xl" onClick={() => setStep(2)}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">You're All Set!</h2>
                <p className="text-muted-foreground">Let's start your Japanese learning journey</p>
              </div>

              <Card className="bg-secondary/50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Your Goals</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedGoals.map((g) => goals.find((goal) => goal.id === g)?.label).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Daily Target</p>
                      <p className="text-sm text-muted-foreground">{dailyMinutes} minutes per day</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Tip: Consistency beats intensity. Short daily practice builds lasting memory!
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 rounded-2xl bg-transparent"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-2xl bg-success hover:bg-success/90"
                  onClick={handleComplete}
                >
                  Start Learning
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
