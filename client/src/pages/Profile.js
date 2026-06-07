import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { userAPI } from '../services/api.services';
export default function Profile() {
    const { user, setUser } = useAuthStore();
    const [bio, setBio] = useState(user?.bio || '');
    const [favoriteGames, setFavoriteGames] = useState(user?.favoriteGames?.join(', ') || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const updatedUser = await userAPI.updateProfile({
                bio,
                favoriteGames: favoriteGames.split(',').map((g) => g.trim()).filter(Boolean),
                avatarUrl,
            });
            setUser(updatedUser);
            setSuccess(true);
        }
        catch (err) {
            console.error('Failed to update profile', err);
        }
        finally {
            setLoading(false);
        }
    };
    if (!user) {
        return _jsx("div", { className: "text-center py-12", children: "Loading Profile..." });
    }
    // Calculate XP progress bar
    const xpNextLevel = 1000;
    const xpPercent = Math.min(100, Math.floor(((user.xp || 0) / xpNextLevel) * 100));
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [_jsxs("div", { className: "card glass relative overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8 border-purple-primary/30", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-purple-primary/15 blur-3xl rounded-full" }), _jsx("div", { className: "absolute bottom-0 left-0 w-32 h-32 bg-cyan-accent/15 blur-3xl rounded-full" }), _jsxs("div", { className: "relative", children: [user.avatarUrl ? (_jsx("img", { src: user.avatarUrl, alt: user.username, className: "w-28 h-28 rounded-full border-4 border-purple-primary object-cover" })) : (_jsx("div", { className: "w-28 h-28 rounded-full bg-purple-primary/20 border-4 border-purple-primary flex items-center justify-center text-4xl font-bold", children: user.username[0].toUpperCase() })), _jsxs("span", { className: "absolute bottom-1 right-1 px-2.5 py-0.5 rounded-full bg-cyan-accent text-dark-bg text-xs font-bold border border-dark-bg", children: ["LVL ", user.level || 1] })] }), _jsxs("div", { className: "flex-grow space-y-4 text-center md:text-left", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold", children: user.username }), _jsx("p", { className: "text-purple-primary font-medium", children: user.rank || 'Rookie' })] }), _jsx("p", { className: "text-gray-300 max-w-md italic", children: user.bio || "No bio set yet. Tell other players about yourself!" }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between text-xs text-gray-400", children: [_jsxs("span", { children: ["XP: ", user.xp || 0, " / ", xpNextLevel] }), _jsxs("span", { children: [xpPercent, "%"] })] }), _jsx("div", { className: "w-full bg-white/10 h-2 rounded-full overflow-hidden", children: _jsx("div", { className: "bg-gradient-to-r from-purple-primary to-cyan-accent h-full", style: { width: `${xpPercent}%` } }) })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "card glass p-6 space-y-4", children: [_jsx("h3", { className: "text-lg font-bold text-magenta-accent uppercase tracking-wider", children: "Achievements" }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: (user.badges && user.badges.length > 0) ? (user.badges.map((badge, idx) => (_jsxs("div", { className: "flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5 text-center", children: [_jsx("span", { className: "text-2xl", children: "\uD83C\uDFC5" }), _jsx("span", { className: "text-[10px] mt-1 font-semibold", children: badge })] }, idx)))) : (_jsx("div", { className: "col-span-3 text-center py-6 text-xs text-gray-500", children: "Unlock badges by winning tournaments!" })) })] }), _jsxs("div", { className: "md:col-span-2 card glass p-8 space-y-6", children: [_jsx("h3", { className: "text-xl font-bold gradient-text", children: "Edit Gamer Identity" }), success && (_jsx("div", { className: "p-3 bg-green-500/20 border border-green-500/40 text-green-300 text-sm rounded-lg text-center", children: "Gamer Card updated successfully!" })), _jsxs("form", { onSubmit: handleUpdate, className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "avatarUrl", children: "Avatar Image URL" }), _jsx("input", { id: "avatarUrl", type: "url", value: avatarUrl, onChange: (e) => setAvatarUrl(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", placeholder: "https://example.com/avatar.jpg" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "bio", children: "Gamer Bio" }), _jsx("textarea", { id: "bio", value: bio, onChange: (e) => setBio(e.target.value), className: "w-full h-24 p-3 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm resize-none", placeholder: "Talk about your playstyle, gear or schedule..." })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "favoriteGames", children: "Favorite Games (comma-separated)" }), _jsx("input", { id: "favoriteGames", type: "text", value: favoriteGames, onChange: (e) => setFavoriteGames(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", placeholder: "Valorant, BGMI, League of Legends" })] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary py-2.5 w-full text-sm", children: loading ? 'Saving details...' : 'Update Profile' })] })] })] })] }));
}
//# sourceMappingURL=Profile.js.map