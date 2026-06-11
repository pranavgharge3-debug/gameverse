import React, { useEffect, useState } from 'react';
import { useFeedStore } from '../stores/feed.store';
import { PostCard } from '../components/PostCard';
import { postAPI } from '../services/api.services';
import { FiSend, FiUsers, FiShield, FiTrendingUp } from 'react-icons/fi';

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
      const updatedFeed = posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      setPosts(updatedFeed);
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-8">
      {/* Feed Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Create Post Card */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-primary to-purple-dark flex items-center justify-center">
              <span className="text-lg font-bold text-white">GV</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Share Your Moment</h3>
              <p className="text-sm text-gray-400">What's on your mind?</p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 resize-none text-sm placeholder-gray-500"
              placeholder="Share your gameplay highlights, tournament results, or gaming news..."
              required
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  📷
                </button>
                <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  🎮
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="btn-primary py-3 px-6 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Publish
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Timeline Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-4">🎮</div>
              <p className="text-gray-400">No posts yet. Be the first to share!</p>
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
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <FiUsers size={20} className="text-cyan-accent" />
            <h4 className="text-lg font-bold">Active Gamers</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-primary to-purple-dark flex items-center justify-center font-bold text-white">
                N
              </div>
              <div className="flex-grow">
                <div className="font-semibold">Ninja</div>
                <div className="text-xs text-cyan-accent">Grandmaster</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-magenta-accent to-purple-primary flex items-center justify-center font-bold text-white">
                S
              </div>
              <div className="flex-grow">
                <div className="font-semibold">Shroud</div>
                <div className="text-xs text-purple-primary">Legendary</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <FiTrendingUp size={20} className="text-magenta-accent" />
            <h4 className="text-lg font-bold">Trending Now</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="text-sm font-semibold">Valorant Champions</div>
              <div className="text-xs text-gray-400 mt-1">12.5K viewers</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="text-sm font-semibold">CS2 Major</div>
              <div className="text-xs text-gray-400 mt-1">8.2K viewers</div>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <FiShield size={20} className="text-yellow-500" />
            <h4 className="text-lg font-bold">Verse Rules</h4>
          </div>
          <ul className="text-sm text-gray-400 space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-purple-primary mt-1">•</span>
              <span>Keep chat competitive but respectful</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-primary mt-1">•</span>
              <span>No cheats or hacks allowed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-primary mt-1">•</span>
              <span>Share clips and have fun!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
