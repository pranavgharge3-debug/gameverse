import React, { useEffect, useState } from 'react';
import { tournamentAPI } from '../services/api.services';
import { FiSearch, FiTrophy, FiCalendar, FiUsers, FiPlay, FiPlus } from 'react-icons/fi';

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
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tournaments</h1>
        <p className="text-gray-400">Compete for glory and climb the leaderboards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tournament Directory */}
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
                placeholder="Search tournaments by game or title..."
              />
            </div>
            <button type="submit" className="btn-primary px-6">
              Search
            </button>
          </form>

          {/* Tournament List */}
          <div className="space-y-6">
            {tournaments.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <p className="text-gray-400">No tournaments scheduled. Host one to get started!</p>
              </div>
            ) : (
              tournaments.map((t) => (
                <div key={t.id} className="card p-6 space-y-4 hover:border-purple-primary/30 transition-all">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-magenta-accent to-purple-primary flex items-center justify-center">
                        <FiTrophy size={24} className="text-white" />
                      </div>
                      <div>
                        <span className="badge badge-cyan mb-2">{t.game}</span>
                        <h3 className="text-xl font-bold">{t.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm line-clamp-2">{t.description}</p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <FiUsers size={16} />
                      <span>{t.participants?.length || 0} Registered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar size={16} />
                      <span>{new Date(t.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Organizer: <span className="text-white font-semibold">{t.organizer?.username}</span></span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleJoinTournament(t.id)}
                      className="btn-primary py-3 w-full flex items-center justify-center gap-2"
                    >
                      <FiPlay size={18} />
                      Register Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Tournament Form */}
        <div className="card p-6 space-y-6 h-fit sticky top-24">
          <div className="flex items-center gap-2">
            <FiPlus size={20} className="text-magenta-accent" />
            <h3 className="text-xl font-bold">Host Tournament</h3>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateTournament} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300" htmlFor="title">Tournament Title</label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Valorant Cup"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300" htmlFor="game">Game</label>
              <input
                id="game"
                type="text"
                required
                value={game}
                onChange={(e) => setGame(e.target.value)}
                placeholder="e.g. Valorant"
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
                placeholder="Rules, format, and prizes..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300" htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300" htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                type="datetime-local"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Hosting...
                </>
              ) : (
                <>
                  <FiTrophy size={18} />
                  Host Tournament
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
