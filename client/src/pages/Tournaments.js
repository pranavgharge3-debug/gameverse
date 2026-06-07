import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { tournamentAPI } from '../services/api.services';
export default function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [search, setSearch] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [game, setGame] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fetchTournaments = async (query = '') => {
        try {
            const list = await tournamentAPI.listTournaments(query);
            setTournaments(list);
        }
        catch (err) {
            console.error('Failed to fetch tournaments', err);
        }
    };
    useEffect(() => {
        fetchTournaments();
    }, []);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchTournaments(search);
    };
    const handleCreateTournament = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await tournamentAPI.createTournament(title, description, game, startDate, endDate);
            setTitle('');
            setDescription('');
            setGame('');
            setStartDate('');
            setEndDate('');
            fetchTournaments();
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to create tournament');
        }
        finally {
            setLoading(false);
        }
    };
    const handleJoinTournament = async (tournamentId) => {
        try {
            await tournamentAPI.joinTournament(tournamentId);
            alert('Registered for tournament successfully!');
            fetchTournaments();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Failed to register');
        }
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold", children: "Championships" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Join tournaments, win games, earn XP" })] }), _jsxs("form", { onSubmit: handleSearchSubmit, className: "flex gap-2 w-full sm:w-auto", children: [_jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), className: "px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", placeholder: "Search by game or title..." }), _jsx("button", { type: "submit", className: "btn-primary py-2 px-4 text-sm", children: "Search" })] })] }), _jsx("div", { className: "space-y-4", children: tournaments.length === 0 ? (_jsx("div", { className: "text-center py-12 text-gray-500 card glass", children: _jsx("p", { children: "No tournaments scheduled. Start one on the right!" }) })) : (tournaments.map((t) => (_jsxs("div", { className: "card glass p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-white/5", children: [_jsxs("div", { className: "space-y-2 max-w-md", children: [_jsx("span", { className: "inline-block px-2 py-0.5 bg-cyan-accent/20 border border-cyan-accent/30 rounded text-[10px] font-bold text-cyan-accent uppercase tracking-wider", children: t.game }), _jsx("h3", { className: "text-xl font-bold", children: t.title }), _jsx("p", { className: "text-gray-400 text-xs line-clamp-2 leading-relaxed", children: t.description }), _jsxs("div", { className: "text-[10px] text-gray-500 flex gap-4", children: [_jsxs("span", { children: ["Organized by: ", _jsx("strong", { className: "text-gray-300", children: t.organizer?.username })] }), _jsxs("span", { children: ["Starts: ", _jsx("strong", { className: "text-gray-300", children: new Date(t.startDate).toLocaleDateString() })] })] })] }), _jsxs("div", { className: "flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-white/5", children: [_jsxs("span", { className: "text-xs text-magenta-accent font-semibold mb-2", children: ["\uD83C\uDFC6 ", t.participants?.length || 0, " Registered"] }), _jsx("button", { onClick: () => handleJoinTournament(t.id), className: "btn-primary py-1.5 px-5 text-xs font-semibold shadow-md shadow-purple-primary/20", children: "Register" })] })] }, t.id)))) })] }), _jsxs("div", { className: "card glass p-8 space-y-6 self-start", children: [_jsx("h3", { className: "text-xl font-bold gradient-text", children: "Host Tournament" }), error && _jsx("p", { className: "text-red-400 text-sm", children: error }), _jsxs("form", { onSubmit: handleCreateTournament, className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "title", children: "Tournament Title" }), _jsx("input", { id: "title", type: "text", required: true, value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", placeholder: "e.g. Winter Valorant Cup" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "game", children: "Game Title" }), _jsx("input", { id: "game", type: "text", required: true, value: game, onChange: (e) => setGame(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", placeholder: "e.g. Valorant" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "desc", children: "Description" }), _jsx("textarea", { id: "desc", required: true, value: description, onChange: (e) => setDescription(e.target.value), className: "w-full h-20 p-3 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm resize-none", placeholder: "Rules, formats, and reward information..." })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "startDate", children: "Start Date" }), _jsx("input", { id: "startDate", type: "datetime-local", required: true, value: startDate, onChange: (e) => setStartDate(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "endDate", children: "End Date" }), _jsx("input", { id: "endDate", type: "datetime-local", required: true, value: endDate, onChange: (e) => setEndDate(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full btn-primary py-2.5 text-sm", children: loading ? 'Host Tournament...' : 'Host Tournament' })] })] })] }));
}
//# sourceMappingURL=Tournaments.js.map