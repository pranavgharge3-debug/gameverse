import api from './api';
import { User } from '../stores/auth.store';

export const authAPI = {
  register: async (email: string, username: string, password: string) => {
    const res = await api.post<{ user: User; token: string }>('/auth/register', { email, username, password });
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
    return res.data;
  },
  forgotPassword: async (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (token: string, password: string) => {
    return api.post('/auth/reset-password', { token, password });
  },
};

export const userAPI = {
  getProfile: async () => {
    const res = await api.get<User>('/users/me');
    return res.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const res = await api.put<User>('/users/me', data);
    return res.data;
  },
  searchUsers: async (query: string) => {
    const res = await api.get('/users/search', { params: { q: query } });
    return res.data;
  },
};

export const postAPI = {
  getFeed: async () => {
    const res = await api.get('/posts');
    return res.data;
  },
  createPost: async (content: string, mediaUrls?: string[], tags?: string[]) => {
    const res = await api.post('/posts', { content, mediaUrls, tags });
    return res.data;
  },
  likePost: async (postId: string) => {
    const res = await api.post(`/posts/${postId}/like`);
    return res.data;
  },
};

export const friendAPI = {
  getFriends: async () => {
    const res = await api.get('/friends/list');
    return res.data;
  },
  sendRequest: async (targetUserId: string) => {
    const res = await api.post('/friends/request', { targetUserId });
    return res.data;
  },
  listRequests: async () => {
    const res = await api.get('/friends/requests');
    return res.data;
  },
  acceptRequest: async (requestId: string) => {
    const res = await api.post(`/friends/request/${requestId}/accept`);
    return res.data;
  },
  rejectRequest: async (requestId: string) => {
    const res = await api.post(`/friends/request/${requestId}/reject`);
    return res.data;
  },
};

export const clanAPI = {
  listClans: async (search?: string) => {
    const res = await api.get('/clans', { params: { search } });
    return res.data;
  },
  createClan: async (name: string, tag: string, description: string, visibility?: 'PUBLIC' | 'PRIVATE') => {
    const res = await api.post('/clans', { name, tag, description, visibility });
    return res.data;
  },
  joinClan: async (clanId: string) => {
    const res = await api.post('/clans/join', { clanId });
    return res.data;
  },
};

export const tournamentAPI = {
  listTournaments: async (search?: string) => {
    const res = await api.get('/tournaments', { params: { search } });
    return res.data;
  },
  createTournament: async (title: string, description: string, game: string, startDate: string, endDate: string) => {
    const res = await api.post('/tournaments', { title, description, game, startDate, endDate });
    return res.data;
  },
  joinTournament: async (tournamentId: string) => {
    const res = await api.post('/tournaments/join', { tournamentId });
    return res.data;
  },
};

export const messageAPI = {
  sendMessage: async (recipientId?: string, clanId?: string, content: string, mediaUrls?: string[]) => {
    const res = await api.post('/messages', { recipientId, clanId, content, mediaUrls });
    return res.data;
  },
  getMessages: async (recipientId?: string, clanId?: string, limit?: number, offset?: number) => {
    const res = await api.get('/messages', {
      params: { recipientId, clanId, limit, offset },
    });
    return res.data;
  },
  markAsRead: async (messageId: string) => {
    const res = await api.patch(`/messages/${messageId}/read`);
    return res.data;
  },
  getConversations: async () => {
    const res = await api.get('/messages/conversations');
    return res.data;
  },
  getClanConversations: async () => {
    const res = await api.get('/messages/conversations/clans');
    return res.data;
  },
};
