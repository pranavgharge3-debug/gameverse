import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { clanAPI } from '../services/api.services';
export default function Clans() {
    const [clans, setClans] = useState([]);
    const [search, setSearch] = useState('');
    const [name, setName] = useState('');
    const [tag, setTag] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const fetchClans = async (query = '') => {
        try {
            const list = await clanAPI.listClans(query);
            setClans(list);
        }
        catch (err) {
            console.error('Failed to load clans', err);
        }
    };
    useEffect(() => {
        fetchClans();
    }, []);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchClans(search);
    };
    const handleCreateClan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await clanAPI.createClan(name, tag, description, visibility);
            setName('');
            setTag('');
            setDescription('');
            fetchClans();
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to create clan');
        }
        finally {
            setLoading(false);
        }
    };
    const handleJoinClan = async (clanId) => {
        try {
            await clanAPI.joinClan(clanId);
            alert('Successfully joined clan!');
            fetchClans();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Failed to join clan');
        }
    };
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold", children: "Clan Directories" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Find and align with top gaming teams" })] }), _jsxs("form", { onSubmit: handleSearchSubmit, className: "flex gap-2 w-full sm:w-auto", children: [_jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), className: "px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", placeholder: "Search by name or tag..." }), _jsx("button", { type: "submit", className: "btn-primary py-2 px-4 text-sm", children: "Search" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: clans.length === 0 ? (_jsx("div", { className: "col-span-2 text-center py-12 text-gray-500 card glass", children: _jsx("p", { children: "No clans found matching your search." }) })) : (clans.map((clan) => (_jsxs("div", { className: "card glass p-6 flex flex-col justify-between border-white/5 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "px-2 py-0.5 bg-purple-primary/20 border border-purple-primary/30 rounded text-xs font-bold text-purple-primary", children: ["[", clan.tag.toUpperCase(), "]"] }), _jsx("span", { className: "text-[10px] text-gray-400 uppercase tracking-wider", children: clan.visibility })] }), _jsx("h3", { className: "text-xl font-bold", children: clan.name }), _jsx("p", { className: "text-gray-400 text-xs line-clamp-3 leading-relaxed", children: clan.description })] }), _jsxs("div", { className: "flex justify-between items-center pt-2", children: [_jsxs("span", { className: "text-xs text-cyan-accent font-semibold", children: ["\uD83D\uDEE1\uFE0F ", clan.members?.length || 0, " Members"] }), _jsx("button", { onClick: () => handleJoinClan(clan.id), className: "btn-secondary py-1 px-4 text-xs font-semibold", children: "Join Clan" })] })] }, clan.id)))) })] }), _jsxs("div", { className: "card glass p-8 space-y-6 self-start", children: [_jsx("h3", { className: "text-xl font-bold gradient-text", children: "Create Clan" }), error && _jsx("p", { className: "text-red-400 text-sm", children: error }), _jsxs("form", { onSubmit: handleCreateClan, className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "name", children: "Clan Name" }), _jsx("input", { id: "name", type: "text", required: true, value: name, onChange: (e) => setName(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", placeholder: "e.g. Sentinels" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "tag", children: "Clan Tag (3-4 characters)" }), _jsx("input", { id: "tag", type: "text", required: true, maxLength: 4, value: tag, onChange: (e) => setTag(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", placeholder: "e.g. SEN" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "desc", children: "Description" }), _jsx("textarea", { id: "desc", required: true, value: description, onChange: (e) => setDescription(e.target.value), className: "w-full h-24 p-3 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm resize-none", placeholder: "What is the objective of this clan?" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-semibold text-gray-300", htmlFor: "visibility", children: "Visibility" }), _jsxs("select", { id: "visibility", value: visibility, onChange: (e) => setVisibility(e.target.value), className: "w-full px-4 py-2 bg-dark-bg/60 border border-white/10 rounded-lg focus:outline-none focus:border-purple-primary text-white text-sm", children: [_jsx("option", { value: "PUBLIC", children: "Public" }), _jsx("option", { value: "PRIVATE", children: "Private (Invite only)" })] })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full btn-primary py-2.5 text-sm", children: loading ? 'Creating Clan...' : 'Create Clan' })] })] })] }));
}
//# sourceMappingURL=Clans.js.map