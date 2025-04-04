"use client"

import { useEffect, useState } from "react"
import { fetchFeed, type Post } from "@/lib/api"
import { PostCard } from "@/components/post-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadPosts = async (pageNum = 1, refresh = false) => {
    if (refresh) {
      setRefreshing(true)
    } else if (pageNum === 1) {
      setLoading(true)
    }

    try {
      const newPosts = await fetchFeed(pageNum)

      if (refresh || pageNum === 1) {
        setPosts(newPosts)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }

      setHasMore(newPosts.length === 10)
    } catch (error) {
      console.error("Failed to fetch feed:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadPosts()

    // Set up polling for new posts every 30 seconds
    const interval = setInterval(() => {
      loadPosts(1, true)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPosts(nextPage)
  }

  const handleRefresh = () => {
    loadPosts(1, true)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading your feed...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Your Feed</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button onClick={handleLoadMore} variant="outline" className="w-full sm:w-auto">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

