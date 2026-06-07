import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
export default function Layout() {
    return (_jsxs("div", { className: "min-h-screen bg-dark-bg text-white font-sans selection:bg-purple-primary/30", children: [_jsx(Navbar, {}), _jsx("div", { className: "pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("main", { className: "w-full", children: _jsx(Outlet, {}) }) })] }));
}
//# sourceMappingURL=Layout.js.map