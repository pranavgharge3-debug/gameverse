import React, { useEffect, useState } from 'react';
import { useFeedStore } from '../stores/feed.store';
import { PostCard } from '../components/PostCard';
import { postAPI } from '../services/api.services';

export default function Feed() {
  const { posts, setPosts, addPost } = useFeedStore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await postAPI.getFeed();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load feed', err);
      }
    };
    fetchFeed();
  }, [setPosts]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    try {
      const newPost = await postAPI.createPost(content);
      addPost(newPost);
      setContent('');
    } catch (err) {
      setError('Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await postAPI.likePost(postId);
      // Update local state directly
      const updatedFeed = posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      setPosts(updatedFeed);
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Feed Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Create Post Card */}
        <div className="card glass p-6 space-y-4">
          <h3 className="text-xl font-bold gradient-text">Share a Moment</h3>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-24 p-3 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white resize-none text-sm placeholder:text-gray-500"
              placeholder="What's on your mind? Share game results, news or clips..."
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="btn-primary py-2 px-6 text-sm"
              >
                {loading ? 'Posting...' : 'Publish'}
              </button>
            </div>
          </form>
        </div>

        {/* Timeline Posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 card glass">
              <p>No posts in the timeline yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                author={post.author}
                content={post.content}
                mediaUrls={post.mediaUrls}
                likes={post.likes}
                onLike={handleLike}
              />
            ))
          )}
        </div>
      </div>

      {/* Sidebar Widgets Column */}
      <div className="hidden lg:block space-y-6">
        <div className="card glass p-6 space-y-4">
          <h4 className="text-md font-bold text-cyan-accent uppercase tracking-wider">Active Gamers</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold">N</div>
              <div>
                <div className="font-semibold">Ninja</div>
                <div className="text-xs text-gray-400">Rank: Grandmaster</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold">S</div>
              <div>
                <div className="font-semibold">Shroud</div>
                <div className="text-xs text-gray-400">Rank: Legendary</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card glass p-6 space-y-4">
          <h4 className="text-md font-bold text-magenta-accent uppercase tracking-wider">Rules of the Verse</h4>
          <ul className="text-xs text-gray-400 list-disc list-inside space-y-2">
            <li>Keep chat competitive but polite.</li>
            <li>No external cheats or hacks links.</li>
            <li>Have fun and share clips!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
