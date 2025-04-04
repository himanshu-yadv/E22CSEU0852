"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./mode-toggle"

const navItems = [
  { name: "Feed", href: "/", icon: Home },
  { name: "Trending Posts", href: "/trending", icon: TrendingUp },
  { name: "Top Users", href: "/top-users", icon: Users },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/75 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <div className="absolute inset-1 rounded-full bg-white dark:bg-slate-900"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
          </div>
          <span className="text-xl font-bold tracking-tight">Pulse</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center",
              isActive
                ? "text-purple-600 dark:text-purple-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="mt-1 text-xs">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}

