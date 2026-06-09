interface Post {
    id: string;
    content: string;
    mediaUrls?: string[];
    likes: number;
    createdAt: string;
    author: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
}
interface FeedStore {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    addPost: (post: Post) => void;
    removePost: (postId: string) => void;
}
export declare const useFeedStore: import("zustand").UseBoundStore<import("zustand").StoreApi<FeedStore>>;
export {};
//# sourceMappingURL=feed.store.d.ts.map