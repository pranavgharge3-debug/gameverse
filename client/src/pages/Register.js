import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authAPI.register(email, username, password);
            setToken(data.token);
            setUser(data.user);
            navigate('/feed');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to register account');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-[70vh]", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "card glass max-w-md w-full p-8 space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("h2", { className: "text-3xl font-bold", children: "Create Identity" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Join the GamerVerse social network" })] }), error && (_jsx("div", { className: "bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-lg text-sm text-center", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "username", children: "Gamer Username" }), _jsx("input", { id: "username", type: "text", required: true, minLength: 3, maxLength: 32, value: username, onChange: (e) => setUsername(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white", placeholder: "e.g. Shroud" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "email", children: "Email Address" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white", placeholder: "shroud@gmail.com" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white", placeholder: "Min. 8 characters" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full btn-primary py-2.5 mt-2 flex items-center justify-center", children: loading ? 'Creating Identity...' : 'Join GamerVerse' })] }), _jsxs("p", { className: "text-center text-sm text-gray-400", children: ["Already registered?", ' ', _jsx(Link, { to: "/login", className: "text-purple-primary hover:underline font-semibold", children: "Log In" })] })] }) }));
}
//# sourceMappingURL=Register.js.map