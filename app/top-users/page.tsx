"use client"

import { useEffect, useState } from "react"
import { fetchTopUsers, type User } from "@/lib/api"
import { UserCard } from "@/components/user-card"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function TopUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTopUsers = async () => {
      try {
        const topUsers = await fetchTopUsers()
        setUsers(topUsers)
      } catch (error) {
        console.error("Failed to fetch top users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTopUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">Finding top content creators...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Top Users</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">The most active content creators on our platform</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {users.map((user, index) => (
          <UserCard key={user.id} user={user} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

