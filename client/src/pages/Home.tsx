import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <span className="inline-block px-4 py-1.5 rounded-full border border-purple-primary/30 bg-purple-primary/10 text-xs font-semibold uppercase tracking-wider text-cyan-accent">
          Welcome to the GamerVerse
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Connect. Compete. <span className="gradient-text">Conquer.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          The ultimate gaming social platform where gamers connect, build communities, participate in tournaments, and showcase their skills.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <Link to="/register" className="btn-primary py-3 px-8 shadow-lg shadow-purple-primary/40 text-lg">
          Join the Verse
        </Link>
        <Link to="/login" className="btn-secondary py-3 px-8 text-lg">
          Sign In
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12"
      >
        <div className="card glass text-left space-y-2 p-6">
          <div className="text-purple-primary font-bold text-lg">⚡ Social Feed</div>
          <p className="text-gray-400 text-sm">Share screenshots, clips, and strategies with standard likes and discussions.</p>
        </div>
        <div className="card glass text-left space-y-2 p-6">
          <div className="text-cyan-accent font-bold text-lg">🛡️ Clans System</div>
          <p className="text-gray-400 text-sm">Form or join clans, complete achievements, and chat with team members in real-time.</p>
        </div>
        <div className="card glass text-left space-y-2 p-6">
          <div className="text-magenta-accent font-bold text-lg">🏆 Tournaments</div>
          <p className="text-gray-400 text-sm">Compete in single/team matches, trace brackets, and climb to the top of leaderboards.</p>
        </div>
      </motion.div>
    </div>
  );
}
