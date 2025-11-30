"use client"

import { Home, BookOpen, PenTool, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentView: string
  onNavigate: (view: string) => void
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "lessons", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: PenTool },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  return (
    <>
      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm md:hidden safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[64px]",
                currentView === item.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={currentView === item.id ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
        <div className="p-6">
          <h1 className="text-xl font-bold text-foreground">
            <span className="kana-display">かな</span>Starter
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Learn Japanese Kana</p>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    currentView === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                  aria-current={currentView === item.id ? "page" : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">Made with care for learners</p>
        </div>
      </aside>
    </>
  )
}
