import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/auth.store';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiCompass, FiBell, FiMessageSquare, FiUser } from 'react-icons/fi';
export function Navbar() {
    const { logout, user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    if (!isAuthenticated)
        return null;
    return (_jsx(motion.nav, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "glass fixed top-0 left-0 right-0 z-50 border-b border-purple-primary/20", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-3 flex items-center justify-between", children: [_jsx(Link, { to: "/", className: "gradient-text text-2xl font-bold", children: "GamerVerse" }), _jsxs("div", { className: "flex items-center gap-8", children: [_jsx(Link, { to: "/", className: "hover:text-purple-primary transition-colors", children: _jsx(FiHome, { size: 20 }) }), _jsx(Link, { to: "/explore", className: "hover:text-purple-primary transition-colors", children: _jsx(FiCompass, { size: 20 }) }), _jsx(Link, { to: "/messages", className: "hover:text-purple-primary transition-colors", children: _jsx(FiMessageSquare, { size: 20 }) }), _jsx(Link, { to: "/notifications", className: "hover:text-purple-primary transition-colors", children: _jsx(FiBell, { size: 20 }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Link, { to: "/profile", className: "hover:text-purple-primary transition-colors", children: _jsx(FiUser, { size: 20 }) }), _jsx("button", { onClick: handleLogout, className: "text-red-400 hover:text-red-300 transition-colors", children: _jsx(FiLogOut, { size: 20 }) })] })] })] }) }));
}
//# sourceMappingURL=Navbar.js.map