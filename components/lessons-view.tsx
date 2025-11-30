"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, Lock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getLessonsByType, type KanaType, type LessonGroup } from "@/lib/kana-data"
import type { UserProgress } from "@/lib/progress-store"

interface LessonsViewProps {
  progress: UserProgress
  onStartLesson: (lessonId: string) => void
}

export function LessonsView({ progress, onStartLesson }: LessonsViewProps) {
  const renderLessonsByType = (type: KanaType, title: string) => {
    const lessons = getLessonsByType(type)
    if (!progress.selectedGoals.includes(type)) return null

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const completedItems = lesson.items.filter((item) => progress.items[item.id]?.mastered).length
            const lessonProgress = (completedItems / lesson.items.length) * 100
            const isComplete = completedItems === lesson.items.length
            const isLocked =
              index > 0 &&
              !lessons[index - 1].items.every(
                (item) => progress.items[item.id]?.reviewCount && progress.items[item.id].reviewCount > 0,
              )

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={lessonProgress}
                isComplete={isComplete}
                isLocked={isLocked}
                completedItems={completedItems}
                onClick={() => !isLocked && onStartLesson(lesson.id)}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Lessons</h1>
        <p className="text-muted-foreground">Master each group before moving to the next</p>
      </div>

      {renderLessonsByType("hiragana", "Hiragana ひらがな")}
      {renderLessonsByType("katakana", "Katakana カタカナ")}
      {renderLessonsByType("numbers", "Numbers 数字")}
    </div>
  )
}

interface LessonCardProps {
  lesson: LessonGroup
  progress: number
  isComplete: boolean
  isLocked: boolean
  completedItems: number
  onClick: () => void
}

function LessonCard({ lesson, progress, isComplete, isLocked, completedItems, onClick }: LessonCardProps) {
  return (
    <Card
      className={cn(
        "transition-all",
        isLocked ? "opacity-60" : "cursor-pointer hover:shadow-md",
        isComplete && "border-success/50 bg-success/5",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl kana-display",
              isComplete ? "bg-success/20" : isLocked ? "bg-muted" : "bg-primary/10",
            )}
          >
            {isLocked ? (
              <Lock className="h-6 w-6 text-muted-foreground" />
            ) : isComplete ? (
              <Check className="h-6 w-6 text-success" />
            ) : (
              lesson.items[0]?.character || "?"
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{lesson.name}</h3>
              {isComplete && (
                <Badge variant="secondary" className="bg-success/20 text-success shrink-0">
                  Complete
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>

            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {completedItems}/{lesson.items.length}
              </span>
            </div>
          </div>

          {!isLocked && !isComplete && <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />}
        </div>
      </CardContent>
    </Card>
  )
}
