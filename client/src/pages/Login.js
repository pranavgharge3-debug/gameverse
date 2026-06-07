import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/auth.store';
import { authAPI } from '../services/api.services';
export default function Login() {
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
            const data = await authAPI.login(email, password);
            setToken(data.token);
            setUser(data.user);
            navigate('/feed');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
        finally {
            setLoading(false);
        }
    };
    const handleGoogleLogin = () => {
        // Redirect to backend Google Auth route
        window.location.href = '/api/auth/google';
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-[70vh]", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "card glass max-w-md w-full p-8 space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("h2", { className: "text-3xl font-bold", children: "Welcome Back" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Enter your credentials to enter the Arena" })] }), error && (_jsx("div", { className: "bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-lg text-sm text-center", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "email", children: "Email Address" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white", placeholder: "gamer@verse.com" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full btn-primary py-2.5 mt-2 flex items-center justify-center", children: loading ? 'Entering...' : 'Login' })] }), _jsxs("div", { className: "relative flex py-2 items-center text-gray-500", children: [_jsx("div", { className: "flex-grow border-t border-white/10" }), _jsx("span", { className: "flex-shrink mx-4 text-xs font-semibold uppercase", children: "Or" }), _jsx("div", { className: "flex-grow border-t border-white/10" })] }), _jsxs("button", { onClick: handleGoogleLogin, type: "button", className: "w-full btn-secondary border border-white/20 hover:bg-white/5 py-2.5 flex items-center justify-center gap-2", children: [_jsx("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: _jsx("path", { fill: "currentColor", d: "M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.4 0-6.159-2.759-6.159-6.159s2.759-6.159 6.159-6.159c1.55 0 2.961.575 4.045 1.522l3.12-3.12C19.3 2.115 15.935 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 11.24-4.57 11.24-11.24 0-.768-.078-1.5-.22-2.185h-11.02z" }) }), "Sign in with Google"] }), _jsxs("p", { className: "text-center text-sm text-gray-400", children: ["New user?", ' ', _jsx(Link, { to: "/register", className: "text-purple-primary hover:underline font-semibold", children: "Register Account" })] })] }) }));
}
//# sourceMappingURL=Login.js.map