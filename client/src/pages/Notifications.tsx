import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiUserPlus, FiHeart, FiMessageCircle, FiTrophy } from 'react-icons/fi';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'FRIEND_REQUEST', title: 'Friend Request', body: 'Ninja sent you a friend request.', read: false, time: '2 hours ago' },
    { id: '2', type: 'LIKE', title: 'New Like', body: 'Shroud liked your post about Valorant strategies.', read: true, time: '1 day ago' },
    { id: '3', type: 'COMMENT', title: 'New Comment', body: 'Pokimane commented on your clip: "Insane reflexes!"', read: true, time: '2 days ago' },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST':
        return <FiUserPlus size={20} className="text-cyan-accent" />;
      case 'LIKE':
        return <FiHeart size={20} className="text-magenta-accent" />;
      case 'COMMENT':
        return <FiMessageCircle size={20} className="text-purple-primary" />;
      default:
        return <FiBell size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-400">Stay updated with your activities</p>
        </div>
        <button
          onClick={markAllRead}
          className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
        >
          <FiCheck size={16} />
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="card p-12 text-center">
            <FiBell size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
            <p className="text-gray-400">Your inbox is empty!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`card p-5 flex items-start gap-4 transition-all ${
                n.read ? 'opacity-60' : 'border-l-4 border-purple-primary'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                {getIcon(n.type)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{n.title}</span>
                  <span className="text-xs text-gray-500">• {n.time}</span>
                </div>
                <p className="text-sm text-gray-400">{n.body}</p>
              </div>

              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="btn-secondary py-2 px-4 text-xs flex-shrink-0"
                >
                  Mark Read
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
