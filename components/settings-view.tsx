"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon, Sun, Monitor, Clock, Info } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import type { UserProgress } from "@/lib/progress-store"
import { cn } from "@/lib/utils"

interface SettingsViewProps {
  progress: UserProgress
  onUpdateGoals: (goals: string[]) => void
  onUpdateDailyMinutes: (minutes: number) => void
}

export function SettingsView({ progress, onUpdateGoals, onUpdateDailyMinutes }: SettingsViewProps) {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: "light" as const, label: "Light", icon: Sun },
    { id: "dark" as const, label: "Dark", icon: Moon },
    { id: "system" as const, label: "System", icon: Monitor },
  ]

  const goals = [
    { id: "hiragana", label: "Hiragana", character: "あ" },
    { id: "katakana", label: "Katakana", character: "ア" },
    { id: "numbers", label: "Numbers", character: "一" },
  ]

  const timeOptions = [5, 10, 15, 20]

  const toggleGoal = (goalId: string) => {
    const current = progress.selectedGoals as string[]
    if (current.includes(goalId)) {
      if (current.length > 1) {
        onUpdateGoals(current.filter((g) => g !== goalId))
      }
    } else {
      onUpdateGoals([...current, goalId])
    }
  }

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Customize your learning experience</p>
      </div>

      {/* Theme */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Theme</h2>
        <Card>
          <CardContent className="p-2">
            <div className="flex gap-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-colors",
                    theme === t.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Learning Goals</h2>
        <Card>
          <CardContent className="p-4 space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <span className="text-lg kana-display">{goal.character}</span>
                  </div>
                  <Label htmlFor={goal.id} className="font-medium">
                    {goal.label}
                  </Label>
                </div>
                <Switch
                  id={goal.id}
                  checked={progress.selectedGoals.includes(goal.id as never)}
                  onCheckedChange={() => toggleGoal(goal.id)}
                  disabled={progress.selectedGoals.includes(goal.id as never) && progress.selectedGoals.length === 1}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Daily Goal */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Daily Goal</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Minutes per day</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((minutes) => (
                <Button
                  key={minutes}
                  variant={progress.dailyGoalMinutes === minutes ? "default" : "outline"}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => onUpdateDailyMinutes(minutes)}
                >
                  {minutes}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">About</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-foreground">
                  <strong>KanaStarter</strong> is a free, open-source app designed to help you learn Japanese hiragana,
                  katakana, and numbers.
                </p>
                <p className="text-sm text-muted-foreground">
                  Built with spaced repetition and active recall for effective learning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
