import React, { useEffect, useState } from 'react';
import { clanAPI } from '../services/api.services';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Clan Directory Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">Clan Directories</h2>
            <p className="text-gray-400 text-sm">Find and align with top gaming teams</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
              placeholder="Search by name or tag..."
            />
            <button type="submit" className="btn-primary py-2 px-4 text-sm">
              Search
            </button>
          </form>
        </div>

        {/* Clan List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clans.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-500 card glass">
              <p>No clans found matching your search.</p>
            </div>
          ) : (
            clans.map((clan) => (
              <div key={clan.id} className="card glass p-6 flex flex-col justify-between border-white/5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-purple-primary/20 border border-purple-primary/30 rounded text-xs font-bold text-purple-primary">
                      [{clan.tag.toUpperCase()}]
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {clan.visibility}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{clan.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">
                    {clan.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-cyan-accent font-semibold">
                    🛡️ {clan.members?.length || 0} Members
                  </span>
                  <button
                    onClick={() => handleJoinClan(clan.id)}
                    className="btn-secondary py-1 px-4 text-xs font-semibold"
                  >
                    Join Clan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Creation Widget */}
      <div className="card glass p-8 space-y-6 self-start">
        <h3 className="text-xl font-bold gradient-text">Create Clan</h3>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <form onSubmit={handleCreateClan} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="name">Clan Name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
              placeholder="e.g. Sentinels"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="tag">Clan Tag (3-4 characters)</label>
            <input
              id="tag"
              type="text"
              required
              maxLength={4}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
              placeholder="e.g. SEN"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="desc">Description</label>
            <textarea
              id="desc"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 p-3 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm resize-none"
              placeholder="What is the objective of this clan?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="visibility">Visibility</label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private (Invite only)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 text-sm"
          >
            {loading ? 'Creating Clan...' : 'Create Clan'}
          </button>
        </form>
      </div>
    </div>
  );
}
