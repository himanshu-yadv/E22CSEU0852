// Types for our data
export interface User {
  id: number
  name: string
  username: string
  postCount: number
  avatar: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
  commentCount: number
  timestamp: string
  image: string
  user?: User
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

// Mock data generator functions
function generateRandomImage(width = 600, height = 400, seed?: number): string {
  const seedParam = seed ? `&seed=${seed}` : ""
  return `/placeholder.svg?height=${height}&width=${width}${seedParam}`
}

function generateRandomAvatar(userId: number): string {
  return `/placeholder.svg?height=100&width=100&seed=${userId}`
}

// Generate mock users
export function generateUsers(count = 10): User[] {
  const names = [
    "Alex Morgan",
    "Jordan Smith",
    "Taylor Reed",
    "Casey Jones",
    "Riley Johnson",
    "Quinn Williams",
    "Avery Davis",
    "Morgan Brown",
    "Dakota Wilson",
    "Skyler Anderson",
    "Jamie Thomas",
    "Reese Martin",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    username: names[i % names.length].toLowerCase().replace(" ", "_"),
    postCount: Math.floor(Math.random() * 50) + 5,
    avatar: generateRandomAvatar(i + 1),
  }))
}

// Generate mock posts
export function generatePosts(count = 20, users: User[]): Post[] {
  const titles = [
    "Discovered an amazing new coffee shop today!",
    "Just finished this incredible book - highly recommend",
    "My thoughts on the latest tech trends",
    "Beautiful sunset at the beach today",
    "New workout routine that's changing my life",
    "Recipe: My grandmother's secret pasta sauce",
    "Travel diary: Hidden gems in Barcelona",
    "Why mindfulness matters in our busy lives",
    "Review of the latest smartphone release",
    "My home office setup for maximum productivity",
  ]

  const bodies = [
    "I can't believe I hadn't found this place sooner. The atmosphere is perfect for working, and their specialty drinks are out of this world!",
    "This book completely changed my perspective. The character development was masterful, and the plot twists kept me guessing until the very end.",
    "With AI advancing so rapidly, I think we're going to see major disruptions in these industries within the next year.",
    "There's something magical about watching the sun dip below the horizon, painting the sky in vibrant colors.",
    "I've been following this routine for just two weeks, and I'm already seeing significant improvements in my strength and energy levels.",
    "The secret is in how long you simmer the tomatoes and which herbs you add at which stage of cooking.",
    "Skip the tourist traps and check out these local favorites that offer authentic experiences.",
    "In our constantly connected world, taking time to disconnect and be present has become more important than ever.",
    "The camera improvements alone make this upgrade worthwhile, but there are several other features that really stand out.",
    "I've found that the right setup can dramatically increase productivity and reduce end-of-day fatigue.",
  ]

  const now = new Date()

  return Array.from({ length: count }, (_, i) => {
    const userId = (i % users.length) + 1
    const postDate = new Date(now)
    postDate.setHours(now.getHours() - i * 2)

    return {
      id: i + 1,
      userId,
      title: titles[i % titles.length],
      body: bodies[i % bodies.length],
      commentCount: Math.floor(Math.random() * 50),
      timestamp: postDate.toISOString(),
      image: generateRandomImage(600, 400, i),
      user: users.find((user) => user.id === userId),
    }
  })
}

// API functions
export async function fetchTopUsers(): Promise<User[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = generateUsers(10)
      // Sort by post count and take top 5
      const topUsers = [...users].sort((a, b) => b.postCount - a.postCount).slice(0, 5)
      resolve(topUsers)
    }, 800)
  })
}

export async function fetchTrendingPosts(): Promise<Post[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = generateUsers(10)
      const posts = generatePosts(20, users)
      // Sort by comment count to get trending posts
      const trendingPosts = [...posts].sort((a, b) => b.commentCount - a.commentCount)
      resolve(trendingPosts)
    }, 800)
  })
}

export async function fetchFeed(page = 1, limit = 10): Promise<Post[]> {
  // Simulate API call with pagination
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = generateUsers(10)
      const allPosts = generatePosts(50, users)
      // Sort by timestamp (newest first) and paginate
      const sortedPosts = [...allPosts].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      const paginatedPosts = sortedPosts.slice((page - 1) * limit, page * limit)
      resolve(paginatedPosts)
    }, 800)
  })
}

