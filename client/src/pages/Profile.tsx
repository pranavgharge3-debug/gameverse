import React, { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { userAPI } from '../services/api.services';
import { FiEdit3, FiTrophy, FiStar, FiShield, FiZap, FiTarget } from 'react-icons/fi';

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

  const xpNextLevel = 1000;
  const xpPercent = Math.min(100, Math.floor(((user.xp || 0) / xpNextLevel) * 100));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Profile Header */}
      <div className="card relative overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-purple-primary/30 via-purple-primary/10 to-cyan-accent/30" />
        
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-32 h-32 rounded-2xl border-4 border-dark-card object-cover shadow-2xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-primary to-purple-dark border-4 border-dark-card flex items-center justify-center text-4xl font-bold shadow-2xl">
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-accent to-purple-primary flex items-center justify-center border-4 border-dark-card">
                <span className="text-white font-bold text-sm">L{user.level || 1}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow pt-4 md:pt-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                {user.isVerified && (
                  <div className="w-6 h-6 rounded-full bg-cyan-accent flex items-center justify-center">
                    <FiShield size={14} className="text-dark-card" />
                  </div>
                )}
              </div>
              <p className="text-purple-primary font-semibold mb-2">{user.rank || 'Rookie'}</p>
              <p className="text-gray-400 max-w-2xl">{user.bio || "No bio set yet. Tell other players about yourself!"}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4 md:pt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-accent">{user.xp || 0}</div>
                <div className="text-xs text-gray-400">XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-primary">{user.level || 1}</div>
                <div className="text-xs text-gray-400">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-magenta-accent">{user.badges?.length || 0}</div>
                <div className="text-xs text-gray-400">Badges</div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Level Progress</span>
              <span className="text-purple-primary font-semibold">{xpPercent}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-primary to-cyan-accent transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 text-right">{user.xp || 0} / {xpNextLevel} XP</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Achievements */}
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <FiTrophy size={20} className="text-yellow-500" />
            <h3 className="text-lg font-bold">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(user.badges && user.badges.length > 0) ? (
              user.badges.map((badge, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:border-purple-primary/30 transition-all">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-xs font-semibold">{badge}</div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-gray-400">
                <FiStar size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Unlock badges by winning tournaments!</p>
              </div>
            )}
          </div>

          {/* Favorite Games */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FiZap size={20} className="text-purple-primary" />
              <h3 className="text-lg font-bold">Favorite Games</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(user.favoriteGames && user.favoriteGames.length > 0) ? (
                user.favoriteGames.map((game, idx) => (
                  <span key={idx} className="badge badge-purple">{game}</span>
                ))
              ) : (
                <p className="text-sm text-gray-400">No games added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="lg:col-span-2 card p-8 space-y-6">
          <div className="flex items-center gap-2">
            <FiEdit3 size={20} className="text-cyan-accent" />
            <h3 className="text-xl font-bold">Edit Profile</h3>
          </div>

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-4 rounded-xl text-sm text-center">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2" htmlFor="avatarUrl">
                <FiTarget size={16} />
                Avatar URL
              </label>
              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2" htmlFor="bio">
                <FiEdit3 size={16} />
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-32 resize-none"
                placeholder="Tell other gamers about your playstyle, achievements, and goals..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2" htmlFor="favoriteGames">
                <FiZap size={16} />
                Favorite Games
              </label>
              <input
                id="favoriteGames"
                type="text"
                value={favoriteGames}
                onChange={(e) => setFavoriteGames(e.target.value)}
                placeholder="Valorant, CS2, League of Legends"
              />
              <p className="text-xs text-gray-500">Separate games with commas</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-4 w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiEdit3 size={18} />
                  Update Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
