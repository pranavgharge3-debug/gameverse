import { motion } from 'framer-motion';

interface PostCardProps {
  id: string;
  author: { username: string; avatarUrl?: string };
  content: string;
  mediaUrls?: string[];
  likes: number;
  onLike: (postId: string) => void;
}

export function PostCard({ id, author, content, mediaUrls, likes, onLike }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card space-y-4"
    >
      <div className="flex items-center gap-3">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.username}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-purple-primary/20 flex items-center justify-center">
            {author.username[0]}
          </div>
        )}
        <span className="font-semibold">{author.username}</span>
      </div>

      <p className="text-gray-300">{content}</p>

      {mediaUrls && mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {mediaUrls.slice(0, 4).map((url, idx) => (
            <img key={idx} src={url} alt="Post media" className="rounded-lg w-full h-40 object-cover" />
          ))}
        </div>
      )}

      <button
        onClick={() => onLike(id)}
        className="btn-primary text-sm w-full"
      >
        ❤️ Like ({likes})
      </button>
    </motion.div>
  );
}
