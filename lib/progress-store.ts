// Progress tracking with localStorage persistence and spaced repetition

import type { KanaItem, KanaType } from "./kana-data"

export interface ItemProgress {
  itemId: string
  ease: number // Multiplier for interval (starts at 2.5)
  interval: number // Days until next review
  reviewCount: number
  correctCount: number
  lastReviewed: string | null // ISO8601
  nextReview: string | null // ISO8601
  mastered: boolean
}

export interface UserProgress {
  onboardingComplete: boolean
  selectedGoals: KanaType[]
  dailyGoalMinutes: number
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
  totalStudyMinutes: number
  items: Record<string, ItemProgress>
}

const STORAGE_KEY = "kanastarter_progress"

const defaultProgress: UserProgress = {
  onboardingComplete: false,
  selectedGoals: [],
  dailyGoalMinutes: 5,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalStudyMinutes: 0,
  items: {},
}

// Initialize item progress
export function initItemProgress(itemId: string): ItemProgress {
  return {
    itemId,
    ease: 2.5,
    interval: 0,
    reviewCount: 0,
    correctCount: 0,
    lastReviewed: null,
    nextReview: null,
    mastered: false,
  }
}

// SM-2 based algorithm for spaced repetition
export function calculateNextReview(
  progress: ItemProgress,
  quality: number, // 0-5 scale: 0=complete fail, 5=perfect
): ItemProgress {
  const now = new Date()
  let { ease, interval, reviewCount, correctCount } = progress

  reviewCount++

  if (quality >= 3) {
    correctCount++

    if (interval === 0) {
      interval = 1
    } else if (interval === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * ease)
    }

    // Adjust ease based on quality
    ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  } else {
    // Reset on failure
    interval = 0
    ease = Math.max(1.3, ease - 0.2)
  }

  const nextReview = new Date(now)
  nextReview.setDate(nextReview.getDate() + interval)

  // Mark as mastered if reviewed 5+ times with 80%+ accuracy
  const accuracy = correctCount / reviewCount
  const mastered = reviewCount >= 5 && accuracy >= 0.8

  return {
    ...progress,
    ease,
    interval,
    reviewCount,
    correctCount,
    lastReviewed: now.toISOString(),
    nextReview: nextReview.toISOString(),
    mastered,
  }
}

// Load progress from localStorage
export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error("Failed to load progress:", e)
  }
  return defaultProgress
}

// Save progress to localStorage
export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.error("Failed to save progress:", e)
  }
}

// Update streak based on study activity
export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toDateString()
  const lastStudy = progress.lastStudyDate ? new Date(progress.lastStudyDate).toDateString() : null

  if (lastStudy === today) {
    return progress
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  let currentStreak = progress.currentStreak

  if (lastStudy === yesterday.toDateString()) {
    currentStreak++
  } else if (lastStudy !== today) {
    currentStreak = 1
  }

  return {
    ...progress,
    currentStreak,
    longestStreak: Math.max(progress.longestStreak, currentStreak),
    lastStudyDate: new Date().toISOString(),
  }
}

// Get items due for review
export function getDueItems(progress: UserProgress, items: KanaItem[]): KanaItem[] {
  const now = new Date()

  return items.filter((item) => {
    const itemProgress = progress.items[item.id]
    if (!itemProgress || !itemProgress.nextReview) return true
    return new Date(itemProgress.nextReview) <= now
  })
}

// Get mastered items count
export function getMasteredCount(progress: UserProgress): number {
  return Object.values(progress.items).filter((p) => p.mastered).length
}

// Get weak items (low accuracy or frequently missed)
export function getWeakItems(progress: UserProgress, items: KanaItem[]): KanaItem[] {
  return items.filter((item) => {
    const itemProgress = progress.items[item.id]
    if (!itemProgress || itemProgress.reviewCount < 2) return false
    const accuracy = itemProgress.correctCount / itemProgress.reviewCount
    return accuracy < 0.7
  })
}

// Export progress as JSON
export function exportProgress(progress: UserProgress): string {
  return JSON.stringify(progress, null, 2)
}

// Import progress from JSON
export function importProgress(json: string): UserProgress | null {
  try {
    const parsed = JSON.parse(json)
    return { ...defaultProgress, ...parsed }
  } catch {
    return null
  }
}

// Reset all progress
export function resetProgress(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
