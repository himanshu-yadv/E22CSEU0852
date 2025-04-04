import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Heart, Share2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Post } from "@/lib/api"

interface PostCardProps {
  post: Post
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${featured ? "border-purple-200 dark:border-purple-900" : ""}`}
    >
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={600}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {featured && (
          <div className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
            Trending
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user?.avatar} alt={post.user?.name} />
            <AvatarFallback>{post.user?.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo}</p>
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold leading-tight">{post.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{post.body}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4 text-slate-500" />
          <span className="text-xs text-slate-600 dark:text-slate-400">{post.commentCount} comments</span>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

