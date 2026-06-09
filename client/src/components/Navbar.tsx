import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiCompass, FiBell, FiMessageSquare, FiUser, FiSettings } from 'react-icons/fi';

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
      className="glass fixed top-0 left-0 right-0 z-50 border-b border-purple-primary/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="gradient-text text-2xl font-bold">
          GamerVerse
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/" className="hover:text-purple-primary transition-colors">
            <FiHome size={20} />
          </Link>
          <Link to="/explore" className="hover:text-purple-primary transition-colors">
            <FiCompass size={20} />
          </Link>
          <Link to="/messages" className="hover:text-purple-primary transition-colors">
            <FiMessageSquare size={20} />
          </Link>
          <Link to="/notifications" className="hover:text-purple-primary transition-colors">
            <FiBell size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="hover:text-purple-primary transition-colors">
              <FiUser size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
