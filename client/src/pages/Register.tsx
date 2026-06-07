import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/auth.store';
import { authAPI } from '../services/api.services';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.register(email, username, password);
      setToken(data.token);
      setUser(data.user);
      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card glass max-w-md w-full p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Create Identity</h2>
          <p className="text-gray-400 text-sm">Join the GamerVerse social network</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="username">Gamer Username</label>
            <input
              id="username"
              type="text"
              required
              minLength={3}
              maxLength={32}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white"
              placeholder="e.g. Shroud"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white"
              placeholder="shroud@gmail.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-300" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white"
              placeholder="Min. 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 mt-2 flex items-center justify-center"
          >
            {loading ? 'Creating Identity...' : 'Join GamerVerse'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="text-purple-primary hover:underline font-semibold">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
