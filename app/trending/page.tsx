"use client"

import { useEffect, useState } from "react"
import { fetchTrendingPosts, type Post } from "@/lib/api"
import { PostCard } from "@/components/post-card"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function TrendingPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrendingPosts = async () => {
      try {
        const trendingPosts = await fetchTrendingPosts()
        setPosts(trendingPosts)
      } catch (error) {
        console.error("Failed to fetch trending posts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrendingPosts()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">Discovering trending posts...</p>
      </div>
    )
  }

  // Find the maximum comment count
  const maxCommentCount = Math.max(...posts.map((post) => post.commentCount))

  // Filter posts with the maximum comment count
  const topTrendingPosts = posts.filter((post) => post.commentCount === maxCommentCount)
  const otherTrendingPosts = posts.filter((post) => post.commentCount !== maxCommentCount)

  return (
    <div className="space-y-8 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trending Posts</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Discover the most discussed content right now</p>
      </div>

      {topTrendingPosts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Most Commented</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topTrendingPosts.map((post) => (
              <PostCard key={post.id} post={post} featured={true} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Also Trending</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherTrendingPosts.slice(0, 6).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

