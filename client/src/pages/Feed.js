import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
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
            }
            catch (err) {
                console.error('Failed to load feed', err);
            }
        };
        fetchFeed();
    }, [setPosts]);
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim())
            return;
        setLoading(true);
        setError('');
        try {
            const newPost = await postAPI.createPost(content);
            addPost(newPost);
            setContent('');
        }
        catch (err) {
            setError('Failed to publish post');
        }
        finally {
            setLoading(false);
        }
    };
    const handleLike = async (postId) => {
        try {
            await postAPI.likePost(postId);
            // Update local state directly
            const updatedFeed = posts.map((post) => post.id === postId ? { ...post, likes: post.likes + 1 } : post);
            setPosts(updatedFeed);
        }
        catch (err) {
            console.error('Failed to like post', err);
        }
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "card glass p-6 space-y-4", children: [_jsx("h3", { className: "text-xl font-bold gradient-text", children: "Share a Moment" }), error && _jsx("p", { className: "text-red-400 text-sm", children: error }), _jsxs("form", { onSubmit: handlePostSubmit, className: "space-y-4", children: [_jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), className: "w-full h-24 p-3 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white resize-none text-sm placeholder:text-gray-500", placeholder: "What's on your mind? Share game results, news or clips...", required: true }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loading || !content.trim(), className: "btn-primary py-2 px-6 text-sm", children: loading ? 'Posting...' : 'Publish' }) })] })] }), _jsx("div", { className: "space-y-4", children: posts.length === 0 ? (_jsx("div", { className: "text-center py-12 text-gray-500 card glass", children: _jsx("p", { children: "No posts in the timeline yet. Be the first to post!" }) })) : (posts.map((post) => (_jsx(PostCard, { id: post.id, author: post.author, content: post.content, mediaUrls: post.mediaUrls, likes: post.likes, onLike: handleLike }, post.id)))) })] }), _jsxs("div", { className: "hidden lg:block space-y-6", children: [_jsxs("div", { className: "card glass p-6 space-y-4", children: [_jsx("h4", { className: "text-md font-bold text-cyan-accent uppercase tracking-wider", children: "Active Gamers" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold", children: "N" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "Ninja" }), _jsx("div", { className: "text-xs text-gray-400", children: "Rank: Grandmaster" })] })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-purple-primary/20 flex items-center justify-center font-bold", children: "S" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "Shroud" }), _jsx("div", { className: "text-xs text-gray-400", children: "Rank: Legendary" })] })] })] })] }), _jsxs("div", { className: "card glass p-6 space-y-4", children: [_jsx("h4", { className: "text-md font-bold text-magenta-accent uppercase tracking-wider", children: "Rules of the Verse" }), _jsxs("ul", { className: "text-xs text-gray-400 list-disc list-inside space-y-2", children: [_jsx("li", { children: "Keep chat competitive but polite." }), _jsx("li", { children: "No external cheats or hacks links." }), _jsx("li", { children: "Have fun and share clips!" })] })] })] })] }));
}
//# sourceMappingURL=Feed.js.map