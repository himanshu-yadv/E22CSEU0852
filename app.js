const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const SOCIAL_MEDIA_API_BASE_URL = 'http://20.244.56.144/evaluation-service';

// Replace this with your actual token
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMionsiZXhwIjozNzQzODI0LCJpYXQiOjE3NDM3NDM1MjQsIm1lc3MiOiIkFmZm9yZG11ZCI6Imp0aSI6Ijg5MTIxNWI4LTY5MjAtNDIwNi04NTBjLTg2MTUxYzhlMGE1ZCIisInY1Ii6ImUyMmNzZXUwODUyQGJlb51dHQzWR1LmluInOsImVtYWlsIjoiZTIyY3NIdT4AYmVubmVodC51ZHuaW4iLCJuYW1lIjoiYWltW5zaHUgeWFkYXlLCJybo2sTm8iOiJlMjJjc2VlMjBqM1IsImFjY2V0cnVlZGoiJydeNWIkoicLjbGlibnRJRCIi6Ijg5MTIxNWI4LTY5MjAtNDIwNi04NTBjLTg2MTUxYzhlMGE1ZCIisImNsawWudFNlY3Jl';

// Middleware
app.use(express.json());
app.use(cors());

// Cache for efficiency
const cache = {
  users: { data: null, timestamp: 0 },
  posts: { data: {}, timestamp: {} },
  comments: { data: {}, timestamp: {} }
};

const CACHE_TTL = 60000; // 1 minute cache TTL

// Utility functions
const isCacheValid = (type, id = null) => {
  const now = Date.now();
  if (id) {
    return cache[type].data[id] && (now - cache[type].timestamp[id] < CACHE_TTL);
  }
  return cache[type].data && (now - cache[type].timestamp < CACHE_TTL);
};

const updateCache = (type, data, id = null) => {
  const now = Date.now();
  if (id) {
    cache[type].data[id] = data;
    cache[type].timestamp[id] = now;
  } else {
    cache[type].data = data;
    cache[type].timestamp = now;
  }
};

// Fetch users
const fetchUsers = async () => {
  if (isCacheValid('users')) {
    return cache.users.data;
  }

  try {
    const response = await axios.get(`${SOCIAL_MEDIA_API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    updateCache('users', response.data.users);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Fetch posts for a user
const fetchPosts = async (userId) => {
  if (isCacheValid('posts', userId)) {
    return cache.posts.data[userId];
  }

  try {
    const response = await axios.get(`${SOCIAL_MEDIA_API_BASE_URL}/users/${userId}/posts`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    updateCache('posts', response.data.posts || [], userId);
    return response.data.posts || [];
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw new Error(`Failed to fetch posts for user ${userId}`);
  }
};

// Fetch comments for a post
const fetchComments = async (postId) => {
  if (isCacheValid('comments', postId)) {
    return cache.comments.data[postId];
  }

  try {
    const response = await axios.get(`${SOCIAL_MEDIA_API_BASE_URL}/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });
    updateCache('comments', response.data.comments || [], postId);
    return response.data.comments || [];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw new Error(`Failed to fetch comments for post ${postId}`);
  }
};

// Fetch all posts
const fetchAllPosts = async () => {
  const users = await fetchUsers();
  const allPosts = [];

  const fetchPromises = Object.keys(users).map(async (userId) => {
    try {
      const userPosts = await fetchPosts(userId);
      allPosts.push(...userPosts);
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
    }
  });

  await Promise.all(fetchPromises);
  return allPosts;
};

// Count posts per user
const countPosts = (users, posts) => {
  const postCounts = {};
  for (const userId in users) {
    postCounts[userId] = 0;
  }

  for (const post of posts) {
    if (postCounts[post.userId] !== undefined) {
      postCounts[post.userId]++;
    }
  }

  return postCounts;
};

// Count comments per post
const countComments = async (posts) => {
  const commentCounts = {};

  const fetchPromises = posts.map(async (post) => {
    try {
      const comments = await fetchComments(post.id);
      commentCounts[post.id] = comments.length;
    } catch (error) {
      console.error(`Error fetching comments for post ${post.id}:`, error);
    }
  });

  await Promise.all(fetchPromises);
  return commentCounts;
};

// API Endpoints

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await fetchUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top 5 users with the most posts
app.get('/users/top', async (req, res) => {
  try {
    const users = await fetchUsers();
    const allPosts = await fetchAllPosts();

    const postCounts = countPosts(users, allPosts);

    const sortedUsers = Object.keys(postCounts)
      .map(userId => ({
        id: userId,
        name: users[userId],
        postCount: postCounts[userId]
      }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);

    res.json({ topUsers: sortedUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top/latest posts
app.get('/posts', async (req, res) => {
  try {
    const type = req.query.type || 'popular';
    const allPosts = await fetchAllPosts();

    if (type === 'latest') {
      const latestPosts = [...allPosts]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

      res.json({ latestPosts });
    } else {
      const commentCounts = await countComments(allPosts);

      const popularPosts = [...allPosts]
        .map(post => ({
          ...post,
          commentCount: commentCounts[post.id] || 0
        }))
        .sort((a, b) => b.commentCount - a.commentCount);

      res.json({ popularPosts });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
