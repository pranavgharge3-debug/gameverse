import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
    },
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },
    hydrate: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            set({
                token,
                user: JSON.parse(user),
                isAuthenticated: true,
            });
        }
    },
}));
//# sourceMappingURL=auth.store.js.map