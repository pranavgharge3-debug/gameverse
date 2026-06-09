import { create } from 'zustand';
export const useFeedStore = create((set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
    addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
    removePost: (postId) => set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) })),
}));
//# sourceMappingURL=feed.store.js.map