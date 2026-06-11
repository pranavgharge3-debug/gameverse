import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiCompass, FiBell, FiMessageSquare, FiUser, FiTrophy, FiUsers } from 'react-icons/fi';

export function Navbar() {
  const { logout, user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-dark-card/80 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-primary to-purple-dark flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-primary/30 transition-all duration-300">
            <span className="text-white font-bold text-lg">GV</span>
          </div>
          <span className="gradient-text-purple text-xl font-bold tracking-tight">GamerVerse</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <NavLink to="/" icon={<FiHome size={20} />} label="Home" />
          <NavLink to="/feed" icon={<FiCompass size={20} />} label="Feed" />
          <NavLink to="/clans" icon={<FiUsers size={20} />} label="Clans" />
          <NavLink to="/tournaments" icon={<FiTrophy size={20} />} label="Tournaments" />
          <NavLink to="/chat" icon={<FiMessageSquare size={20} />} label="Chat" />
          <NavLink to="/notifications" icon={<FiBell size={20} />} label="Notifications" />
          
          <div className="w-px h-8 bg-white/10 mx-2" />
          
          <NavLink to="/profile" icon={<FiUser size={20} />} label="Profile" />
          <button
            onClick={handleLogout}
            className="p-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="relative group flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-primary/20 to-cyan-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </Link>
  );
}
