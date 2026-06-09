export interface User {
    id: string;
    email: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
    favoriteGames?: string[];
    rank?: string;
    level?: number;
    xp?: number;
    badges?: string[];
    role?: string;
}
interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    logout: () => void;
    hydrate: () => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthStore>>;
export {};
//# sourceMappingURL=auth.store.d.ts.map