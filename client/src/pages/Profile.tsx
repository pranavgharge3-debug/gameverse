import React, { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { userAPI } from '../services/api.services';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [bio, setBio] = useState(user?.bio || '');
  const [favoriteGames, setFavoriteGames] = useState(user?.favoriteGames?.join(', ') || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
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
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12">Loading Profile...</div>;
  }

  // Calculate XP progress bar
  const xpNextLevel = 1000;
  const xpPercent = Math.min(100, Math.floor(((user.xp || 0) / xpNextLevel) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Gamer Profile Card */}
      <div className="card glass relative overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8 border-purple-primary/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-primary/15 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-accent/15 blur-3xl rounded-full"></div>

        {/* Avatar Display */}
        <div className="relative">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-28 h-28 rounded-full border-4 border-purple-primary object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-purple-primary/20 border-4 border-purple-primary flex items-center justify-center text-4xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-1 right-1 px-2.5 py-0.5 rounded-full bg-cyan-accent text-dark-bg text-xs font-bold border border-dark-bg">
            LVL {user.level || 1}
          </span>
        </div>

        {/* Quick Details */}
        <div className="flex-grow space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-bold">{user.username}</h2>
            <p className="text-purple-primary font-medium">{user.rank || 'Rookie'}</p>
          </div>

          <p className="text-gray-300 max-w-md italic">
            {user.bio || "No bio set yet. Tell other players about yourself!"}
          </p>

          {/* XP Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>XP: {user.xp || 0} / {xpNextLevel}</span>
              <span>{xpPercent}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-primary to-cyan-accent h-full"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Edit Info and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Achievements/Badges */}
        <div className="card glass p-6 space-y-4">
          <h3 className="text-lg font-bold text-magenta-accent uppercase tracking-wider">Achievements</h3>
          <div className="grid grid-cols-3 gap-4">
            {(user.badges && user.badges.length > 0) ? (
              user.badges.map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                  <span className="text-2xl">🏅</span>
                  <span className="text-[10px] mt-1 font-semibold">{badge}</span>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-xs text-gray-500">
                Unlock badges by winning tournaments!
              </div>
            )}
          </div>
        </div>

        {/* Profile Editing form */}
        <div className="md:col-span-2 card glass p-8 space-y-6">
          <h3 className="text-xl font-bold gradient-text">Edit Gamer Identity</h3>
          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/40 text-green-300 text-sm rounded-lg text-center">
              Gamer Card updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-300" htmlFor="avatarUrl">Avatar Image URL</label>
              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-300" htmlFor="bio">Gamer Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-24 p-3 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm resize-none"
                placeholder="Talk about your playstyle, gear or schedule..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-300" htmlFor="favoriteGames">Favorite Games (comma-separated)</label>
              <input
                id="favoriteGames"
                type="text"
                value={favoriteGames}
                onChange={(e) => setFavoriteGames(e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
                placeholder="Valorant, BGMI, League of Legends"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 w-full text-sm"
            >
              {loading ? 'Saving details...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
