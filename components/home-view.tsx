"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, BookOpen, Target, Trophy, ChevronRight } from "lucide-react"
import type { UserProgress } from "@/lib/progress-store"
import { getAllKana, getLessonsByType } from "@/lib/kana-data"

interface HomeViewProps {
  progress: UserProgress
  masteredCount: number
  dueItemsCount: number
  onNavigate: (view: string) => void
  onStartLesson: (lessonId: string) => void
}

export function HomeView({ progress, masteredCount, dueItemsCount, onNavigate, onStartLesson }: HomeViewProps) {
  const totalKana = getAllKana().length
  const overallProgress = totalKana > 0 ? (masteredCount / totalKana) * 100 : 0

  // Get next recommended lesson
  const getNextLesson = () => {
    for (const goal of progress.selectedGoals) {
      const lessons = getLessonsByType(goal)
      for (const lesson of lessons) {
        const lessonProgress = lesson.items.filter((item) => progress.items[item.id]?.mastered).length
        if (lessonProgress < lesson.items.length) {
          return lesson
        }
      }
    }
    return null
  }

  const nextLesson = getNextLesson()

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Ready to continue your Japanese journey?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-accent/20 to-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Streak</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{progress.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Best: {progress.longestStreak} days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Mastered</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{masteredCount}</p>
            <p className="text-xs text-muted-foreground">of {totalKana} characters</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Due for Review */}
      {dueItemsCount > 0 && (
        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Review Time!</p>
                  <p className="text-sm text-muted-foreground">{dueItemsCount} items ready for review</p>
                </div>
              </div>
              <Button size="sm" className="rounded-xl" onClick={() => onNavigate("practice")}>
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Learning */}
      {nextLesson && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <button
              onClick={() => onStartLesson(nextLesson.id)}
              className="w-full p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl kana-display">{nextLesson.items[0]?.character || "?"}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-primary font-medium uppercase tracking-wide">Continue Learning</p>
                <p className="font-semibold text-foreground">{nextLesson.name}</p>
                <p className="text-sm text-muted-foreground">{nextLesson.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-auto py-4 flex-col gap-2 rounded-2xl bg-transparent"
          onClick={() => onNavigate("lessons")}
        >
          <BookOpen className="h-6 w-6" />
          <span>All Lessons</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-4 flex-col gap-2 rounded-2xl bg-transparent"
          onClick={() => onNavigate("practice")}
        >
          <Target className="h-6 w-6" />
          <span>Practice</span>
        </Button>
      </div>
    </div>
  )
}
