"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flame, Trophy, Clock, Target, Download, Upload, RotateCcw, Check } from "lucide-react"
import { type UserProgress, exportProgress, importProgress, resetProgress } from "@/lib/progress-store"
import { getAllKana, hiraganaData, katakanaData, numbersData, type KanaItem } from "@/lib/kana-data"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ProgressViewProps {
  progress: UserProgress
  masteredCount: number
  setProgress: (progress: UserProgress) => void
}

export function ProgressView({ progress, masteredCount, setProgress }: ProgressViewProps) {
  const [showImport, setShowImport] = useState(false)

  const totalKana = getAllKana().length
  const reviewedItems = Object.values(progress.items).filter((i) => i.reviewCount > 0).length

  const getTypeProgress = (items: KanaItem[]) => {
    const mastered = items.filter((i) => progress.items[i.id]?.mastered).length
    return {
      mastered,
      total: items.length,
      percentage: items.length > 0 ? (mastered / items.length) * 100 : 0,
    }
  }

  const hiraganaProgress = getTypeProgress(hiraganaData)
  const katakanaProgress = getTypeProgress(katakanaData)
  const numbersProgress = getTypeProgress(numbersData)

  const handleExport = () => {
    const data = exportProgress(progress)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "kanastarter-progress.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const imported = importProgress(text)
    if (imported) {
      setProgress(imported)
      setShowImport(false)
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetProgress()
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        <p className="text-muted-foreground">Track your learning journey</p>
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Study Time</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{progress.totalStudyMinutes}</p>
            <p className="text-xs text-muted-foreground">minutes total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Reviewed</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{reviewedItems}</p>
            <p className="text-xs text-muted-foreground">characters studied</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress by Type */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Progress by Type</h2>

        {progress.selectedGoals.includes("hiragana") && (
          <ProgressCard
            title="Hiragana"
            subtitle="ひらがな"
            progress={hiraganaProgress}
            items={hiraganaData}
            userProgress={progress}
          />
        )}

        {progress.selectedGoals.includes("katakana") && (
          <ProgressCard
            title="Katakana"
            subtitle="カタカナ"
            progress={katakanaProgress}
            items={katakanaData}
            userProgress={progress}
          />
        )}

        {progress.selectedGoals.includes("numbers") && (
          <ProgressCard
            title="Numbers"
            subtitle="数字"
            progress={numbersProgress}
            items={numbersData}
            userProgress={progress}
          />
        )}
      </div>

      {/* Data Management */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Data</h2>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2 rounded-2xl bg-transparent"
            onClick={handleExport}
          >
            <Download className="h-5 w-5" />
            <span className="text-sm">Export</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2 rounded-2xl relative bg-transparent"
            onClick={() => document.getElementById("import-file")?.click()}
          >
            <Upload className="h-5 w-5" />
            <span className="text-sm">Import</span>
            <input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImport} />
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All Progress
        </Button>
      </div>
    </div>
  )
}

interface ProgressCardProps {
  title: string
  subtitle: string
  progress: { mastered: number; total: number; percentage: number }
  items: KanaItem[]
  userProgress: UserProgress
}

function ProgressCard({ title, subtitle, progress, items, userProgress }: ProgressCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="p-4">
        <button className="w-full text-left" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {progress.mastered}/{progress.total}
              </p>
              <p className="text-xs text-muted-foreground">mastered</p>
            </div>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {items.map((item) => {
                const itemProgress = userProgress.items[item.id]
                const isMastered = itemProgress?.mastered
                const hasStudied = itemProgress?.reviewCount && itemProgress.reviewCount > 0

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-lg kana-display transition-colors",
                      isMastered
                        ? "bg-success/20 text-success"
                        : hasStudied
                          ? "bg-primary/10 text-foreground"
                          : "bg-muted text-muted-foreground",
                    )}
                    title={`${item.character} (${item.romaji})`}
                  >
                    {isMastered ? <Check className="h-4 w-4" /> : item.character}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
