import api from './api';
export const authAPI = {
    register: async (email, username, password) => {
        const res = await api.post('/auth/register', { email, username, password });
        return res.data;
    },
    login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    },
    forgotPassword: async (email) => {
        return api.post('/auth/forgot-password', { email });
    },
    resetPassword: async (token, password) => {
        return api.post('/auth/reset-password', { token, password });
    },
};
export const userAPI = {
    getProfile: async () => {
        const res = await api.get('/users/me');
        return res.data;
    },
    updateProfile: async (data) => {
        const res = await api.put('/users/me', data);
        return res.data;
    },
    searchUsers: async (query) => {
        const res = await api.get('/users/search', { params: { q: query } });
        return res.data;
    },
};
export const postAPI = {
    getFeed: async () => {
        const res = await api.get('/posts');
        return res.data;
    },
    createPost: async (content, mediaUrls, tags) => {
        const res = await api.post('/posts', { content, mediaUrls, tags });
        return res.data;
    },
    likePost: async (postId) => {
        const res = await api.post(`/posts/${postId}/like`);
        return res.data;
    },
};
export const friendAPI = {
    getFriends: async () => {
        const res = await api.get('/friends/list');
        return res.data;
    },
    sendRequest: async (targetUserId) => {
        const res = await api.post('/friends/request', { targetUserId });
        return res.data;
    },
    listRequests: async () => {
        const res = await api.get('/friends/requests');
        return res.data;
    },
    acceptRequest: async (requestId) => {
        const res = await api.post(`/friends/request/${requestId}/accept`);
        return res.data;
    },
    rejectRequest: async (requestId) => {
        const res = await api.post(`/friends/request/${requestId}/reject`);
        return res.data;
    },
};
export const clanAPI = {
    listClans: async (search) => {
        const res = await api.get('/clans', { params: { search } });
        return res.data;
    },
    createClan: async (name, tag, description, visibility) => {
        const res = await api.post('/clans', { name, tag, description, visibility });
        return res.data;
    },
    joinClan: async (clanId) => {
        const res = await api.post('/clans/join', { clanId });
        return res.data;
    },
};
export const tournamentAPI = {
    listTournaments: async (search) => {
        const res = await api.get('/tournaments', { params: { search } });
        return res.data;
    },
    createTournament: async (title, description, game, startDate, endDate) => {
        const res = await api.post('/tournaments', { title, description, game, startDate, endDate });
        return res.data;
    },
    joinTournament: async (tournamentId) => {
        const res = await api.post('/tournaments/join', { tournamentId });
        return res.data;
    },
};
//# sourceMappingURL=api.services.js.map