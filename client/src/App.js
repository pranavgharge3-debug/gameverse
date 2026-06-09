import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Clans from './pages/Clans';
import Tournaments from './pages/Tournaments';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './layouts/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsxs(Route, { element: _jsx(ProtectedRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { path: "/feed", element: _jsx(Feed, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/clans", element: _jsx(Clans, {}) }), _jsx(Route, { path: "/tournaments", element: _jsx(Tournaments, {}) }), _jsx(Route, { path: "/messages", element: _jsx(Chat, {}) }), _jsx(Route, { path: "/notifications", element: _jsx(Notifications, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminDashboard, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
//# sourceMappingURL=App.js.map