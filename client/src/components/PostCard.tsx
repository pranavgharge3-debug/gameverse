import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';

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
      className="card p-6 space-y-5 hover:border-purple-primary/30 transition-all"
    >
      {/* Author Header */}
      <div className="flex items-center gap-3">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.username}
            className="w-12 h-12 rounded-xl object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-primary to-purple-dark flex items-center justify-center font-bold text-white">
            {author.username[0]}
          </div>
        )}
        <div>
          <span className="font-bold">{author.username}</span>
          <div className="text-xs text-gray-400">Just now</div>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-300 leading-relaxed">{content}</p>

      {/* Media */}
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {mediaUrls.slice(0, 4).map((url, idx) => (
            <img key={idx} src={url} alt="Post media" className="rounded-xl w-full h-48 object-cover" />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        <button
          onClick={() => onLike(id)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-magenta-accent transition-colors"
        >
          <FiHeart size={18} />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-accent transition-colors">
          <FiMessageCircle size={18} />
          <span>Comment</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-primary transition-colors">
          <FiShare2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </motion.div>
  );
}
