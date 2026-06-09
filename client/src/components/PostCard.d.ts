interface PostCardProps {
    id: string;
    author: {
        username: string;
        avatarUrl?: string;
    };
    content: string;
    mediaUrls?: string[];
    likes: number;
    onLike: (postId: string) => void;
}
export declare function PostCard({ id, author, content, mediaUrls, likes, onLike }: PostCardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=PostCard.d.ts.map