import Image from "next/image"
import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { User } from "@/lib/api"

interface UserCardProps {
  user: User
  rank: number
}

export function UserCard({ user, rank }: UserCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative h-24 w-full bg-gradient-to-r from-purple-400 to-pink-500">
          <div className="absolute -bottom-10 left-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white dark:border-slate-900">
            <Image
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-purple-600 dark:bg-slate-800 dark:text-purple-400">
            #{rank}
          </div>
        </div>

        <div className="mt-12 p-4">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>

          <div className="mt-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">{user.postCount} posts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

