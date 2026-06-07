import { useState } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Notifications</h2>
          <p className="text-gray-400 text-sm">Stay updated with your activities</p>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs text-purple-primary hover:underline font-semibold"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 card glass">
            <p>Your inbox is empty!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`card glass p-5 flex justify-between items-center border-l-4 ${
                n.read ? 'border-white/5 opacity-70' : 'border-purple-primary'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-accent">
                    {n.title}
                  </span>
                  <span className="text-[9px] text-gray-500">• {n.time}</span>
                </div>
                <p className="text-sm text-gray-200">{n.body}</p>
              </div>

              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="btn-secondary py-1 px-3 text-[10px] font-bold"
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
