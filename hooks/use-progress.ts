"use client"

import { useState, useEffect, useCallback } from "react"
import {
  type UserProgress,
  type ItemProgress,
  loadProgress,
  saveProgress,
  updateStreak,
  calculateNextReview,
  initItemProgress,
  getDueItems,
  getMasteredCount,
  getWeakItems,
} from "@/lib/progress-store"
import { getAllKana } from "@/lib/kana-data"

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load progress on mount
  useEffect(() => {
    const loaded = loadProgress()
    setProgress(loaded)
    setIsLoading(false)
  }, [])

  // Save progress whenever it changes
  useEffect(() => {
    if (progress && !isLoading) {
      saveProgress(progress)
    }
  }, [progress, isLoading])

  const completeOnboarding = useCallback((goals: string[], dailyMinutes: number) => {
    setProgress((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        onboardingComplete: true,
        selectedGoals: goals as UserProgress["selectedGoals"],
        dailyGoalMinutes: dailyMinutes,
      }
    })
  }, [])

  const recordAnswer = useCallback((itemId: string, quality: number) => {
    setProgress((prev) => {
      if (!prev) return prev

      const itemProgress = prev.items[itemId] || initItemProgress(itemId)
      const updated = calculateNextReview(itemProgress, quality)

      return updateStreak({
        ...prev,
        items: {
          ...prev.items,
          [itemId]: updated,
        },
      })
    })
  }, [])

  const addStudyTime = useCallback((minutes: number) => {
    setProgress((prev) => {
      if (!prev) return prev
      return updateStreak({
        ...prev,
        totalStudyMinutes: prev.totalStudyMinutes + minutes,
      })
    })
  }, [])

  const getItemProgress = useCallback(
    (itemId: string): ItemProgress | null => {
      if (!progress) return null
      return progress.items[itemId] || null
    },
    [progress],
  )

  const dueItems = progress ? getDueItems(progress, getAllKana()) : []
  const masteredCount = progress ? getMasteredCount(progress) : 0
  const weakItems = progress ? getWeakItems(progress, getAllKana()) : []

  return {
    progress,
    isLoading,
    completeOnboarding,
    recordAnswer,
    addStudyTime,
    getItemProgress,
    dueItems,
    masteredCount,
    weakItems,
    setProgress,
  }
}
