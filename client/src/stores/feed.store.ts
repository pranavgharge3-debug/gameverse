import { create } from 'zustand';

interface Post {
  id: string;
  content: string;
  mediaUrls?: string[];
  likes: number;
  createdAt: string;
  author: { id: string; username: string; avatarUrl?: string };
}

interface FeedStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  removePost: (postId: string) => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  removePost: (postId) => set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) })),
}));
