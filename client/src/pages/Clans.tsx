import React, { useEffect, useState } from 'react';
import { clanAPI } from '../services/api.services';
import { FiSearch, FiUsers, FiShield, FiPlus, FiLock, FiGlobe } from 'react-icons/fi';

interface Clan {
  id: string;
  name: string;
  tag: string;
  description: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  members: any[];
}

export default function Clans() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchClans = async (query = '') => {
    try {
      const list = await clanAPI.listClans(query);
      setClans(list);
    } catch (err) {
      console.error('Failed to load clans', err);
    }
  };

  useEffect(() => {
    fetchClans();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClans(search);
  };

  const handleCreateClan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await clanAPI.createClan(name, tag, description, visibility);
      setName('');
      setTag('');
      setDescription('');
      fetchClans();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create clan');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClan = async (clanId: string) => {
    try {
      await clanAPI.joinClan(clanId);
      alert('Successfully joined clan!');
      fetchClans();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to join clan');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Esports Clans</h1>
        <p className="text-gray-400">Find your team and dominate the competition</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clan Directory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="flex-grow relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3"
                placeholder="Search clans by name or tag..."
              />
            </div>
            <button type="submit" className="btn-primary px-6">
              Search
            </button>
          </form>

          {/* Clan Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clans.length === 0 ? (
              <div className="col-span-2 card p-12 text-center">
                <div className="text-5xl mb-4">🛡️</div>
                <p className="text-gray-400">No clans found. Be the first to create one!</p>
              </div>
            ) : (
              clans.map((clan) => (
                <div key={clan.id} className="card p-6 space-y-4 hover:border-purple-primary/30 transition-all">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-primary to-purple-dark flex items-center justify-center font-bold text-white">
                        {clan.tag.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{clan.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          {clan.visibility === 'PRIVATE' ? (
                            <span className="flex items-center gap-1 text-gray-400">
                              <FiLock size={14} />
                              Private
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-cyan-accent">
                              <FiGlobe size={14} />
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm line-clamp-2">{clan.description}</p>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiUsers size={16} />
                      <span>{clan.members?.length || 0} Members</span>
                    </div>
                    <button
                      onClick={() => handleJoinClan(clan.id)}
                      className="btn-secondary py-2 px-4 text-sm"
                    >
                      Join Clan
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Clan Form */}
        <div className="card p-6 space-y-6 h-fit sticky top-24">
          <div className="flex items-center gap-2">
            <FiPlus size={20} className="text-purple-primary" />
            <h3 className="text-xl font-bold">Create Clan</h3>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateClan} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300" htmlFor="name">Clan Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sentinels"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300" htmlFor="tag">Clan Tag (3-4 chars)</label>
              <input
                id="tag"
                type="text"
                required
                maxLength={4}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. SEN"
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300" htmlFor="desc">Description</label>
              <textarea
                id="desc"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-24 resize-none"
                placeholder="What is your clan's mission?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300" htmlFor="visibility">Visibility</label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
              >
                <option value="PUBLIC">Public - Anyone can join</option>
                <option value="PRIVATE">Private - Invite only</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FiShield size={18} />
                  Create Clan
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
