"use client"

import { useState, useCallback } from "react"
import { useProgress } from "@/hooks/use-progress"
import { lessonGroups } from "@/lib/kana-data"
import { Onboarding } from "@/components/onboarding"
import { Navigation } from "@/components/navigation"
import { HomeView } from "@/components/home-view"
import { LessonsView } from "@/components/lessons-view"
import { PracticeView } from "@/components/practice-view"
import { ProgressView } from "@/components/progress-view"
import { SettingsView } from "@/components/settings-view"
import { LessonSession } from "@/components/lesson-session"
import type { KanaType } from "@/lib/kana-data"

export default function KanaStarterApp() {
  const { progress, isLoading, completeOnboarding, recordAnswer, dueItems, masteredCount, weakItems, setProgress } =
    useProgress()

  const [currentView, setCurrentView] = useState("home")
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  const handleStartLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId)
  }, [])

  const handleLessonComplete = useCallback(
    (results: Record<string, number>) => {
      Object.entries(results).forEach(([itemId, quality]) => {
        recordAnswer(itemId, quality)
      })
      setActiveLessonId(null)
    },
    [recordAnswer],
  )

  const handleUpdateGoals = useCallback(
    (goals: string[]) => {
      if (!progress) return
      setProgress({
        ...progress,
        selectedGoals: goals as KanaType[],
      })
    },
    [progress, setProgress],
  )

  const handleUpdateDailyMinutes = useCallback(
    (minutes: number) => {
      if (!progress) return
      setProgress({
        ...progress,
        dailyGoalMinutes: minutes,
      })
    },
    [progress, setProgress],
  )

  // Loading state
  if (isLoading || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
            <span className="text-3xl kana-display">あ</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Onboarding flow
  if (!progress.onboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />
  }

  // Active lesson session
  if (activeLessonId) {
    const lesson = lessonGroups.find((l) => l.id === activeLessonId)
    if (lesson) {
      return <LessonSession lesson={lesson} onComplete={handleLessonComplete} onExit={() => setActiveLessonId(null)} />
    }
  }

  // Main app view
  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />

      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {currentView === "home" && (
            <HomeView
              progress={progress}
              masteredCount={masteredCount}
              dueItemsCount={dueItems.length}
              onNavigate={setCurrentView}
              onStartLesson={handleStartLesson}
            />
          )}

          {currentView === "lessons" && <LessonsView progress={progress} onStartLesson={handleStartLesson} />}

          {currentView === "practice" && (
            <PracticeView progress={progress} dueItems={dueItems} weakItems={weakItems} onRecordAnswer={recordAnswer} />
          )}

          {currentView === "progress" && (
            <ProgressView progress={progress} masteredCount={masteredCount} setProgress={setProgress} />
          )}

          {currentView === "settings" && (
            <SettingsView
              progress={progress}
              onUpdateGoals={handleUpdateGoals}
              onUpdateDailyMinutes={handleUpdateDailyMinutes}
            />
          )}
        </div>
      </main>
    </div>
  )
}
