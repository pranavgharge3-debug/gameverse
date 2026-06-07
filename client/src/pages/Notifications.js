import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const markRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold", children: "Notifications" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Stay updated with your activities" })] }), _jsx("button", { onClick: markAllRead, className: "text-xs text-purple-primary hover:underline font-semibold", children: "Mark all as read" })] }), _jsx("div", { className: "space-y-4", children: notifications.length === 0 ? (_jsx("div", { className: "text-center py-12 text-gray-500 card glass", children: _jsx("p", { children: "Your inbox is empty!" }) })) : (notifications.map((n) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, className: `card glass p-5 flex justify-between items-center border-l-4 ${n.read ? 'border-white/5 opacity-70' : 'border-purple-primary'}`, children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-cyan-accent", children: n.title }), _jsxs("span", { className: "text-[9px] text-gray-500", children: ["\u2022 ", n.time] })] }), _jsx("p", { className: "text-sm text-gray-200", children: n.body })] }), !n.read && (_jsx("button", { onClick: () => markRead(n.id), className: "btn-secondary py-1 px-3 text-[10px] font-bold", children: "Mark Read" }))] }, n.id)))) })] }));
}
//# sourceMappingURL=Notifications.js.map