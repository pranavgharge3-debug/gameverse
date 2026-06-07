import React, { useEffect, useState } from 'react';
import { tournamentAPI } from '../services/api.services';

interface Tournament {
  id: string;
  title: string;
  description: string;
  game: string;
  startDate: string;
  endDate: string;
  organizer: { username: string };
  participants: any[];
}

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [game, setGame] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTournaments = async (query = '') => {
    try {
      const list = await tournamentAPI.listTournaments(query);
      setTournaments(list);
    } catch (err) {
      console.error('Failed to fetch tournaments', err);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTournaments(search);
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await tournamentAPI.createTournament(title, description, game, startDate, endDate);
      setTitle('');
      setDescription('');
      setGame('');
      setStartDate('');
      setEndDate('');
      fetchTournaments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      await tournamentAPI.joinTournament(tournamentId);
      alert('Registered for tournament successfully!');
      fetchTournaments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Tournament Directory Column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">Championships</h2>
            <p className="text-gray-400 text-sm">Join tournaments, win games, earn XP</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
              placeholder="Search by game or title..."
            />
            <button type="submit" className="btn-primary py-2 px-4 text-sm">
              Search
            </button>
          </form>
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          {tournaments.length === 0 ? (
            <div className="text-center py-12 text-gray-500 card glass">
              <p>No tournaments scheduled. Start one on the right!</p>
            </div>
          ) : (
            tournaments.map((t) => (
              <div key={t.id} className="card glass p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-white/5">
                <div className="space-y-2 max-w-md">
                  <span className="inline-block px-2 py-0.5 bg-cyan-accent/20 border border-cyan-accent/30 rounded text-[10px] font-bold text-cyan-accent uppercase tracking-wider">
                    {t.game}
                  </span>
                  <h3 className="text-xl font-bold">{t.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                  <div className="text-[10px] text-gray-500 flex gap-4">
                    <span>Organized by: <strong className="text-gray-300">{t.organizer?.username}</strong></span>
                    <span>Starts: <strong className="text-gray-300">{new Date(t.startDate).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-white/5">
                  <span className="text-xs text-magenta-accent font-semibold mb-2">
                    🏆 {t.participants?.length || 0} Registered
                  </span>
                  <button
                    onClick={() => handleJoinTournament(t.id)}
                    className="btn-primary py-1.5 px-5 text-xs font-semibold shadow-md shadow-purple-primary/20"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Creation Widget */}
      <div className="card glass p-8 space-y-6 self-start">
        <h3 className="text-xl font-bold gradient-text">Host Tournament</h3>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <form onSubmit={handleCreateTournament} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="title">Tournament Title</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
              placeholder="e.g. Winter Valorant Cup"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="game">Game Title</label>
            <input
              id="game"
              type="text"
              required
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
              placeholder="e.g. Valorant"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="desc">Description</label>
            <textarea
              id="desc"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 p-3 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm resize-none"
              placeholder="Rules, formats, and reward information..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="datetime-local"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="datetime-local"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 text-sm"
          >
            {loading ? 'Host Tournament...' : 'Host Tournament'}
          </button>
        </form>
      </div>
    </div>
  );
}
