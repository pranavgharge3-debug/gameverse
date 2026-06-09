import { User } from '../stores/auth.store';
export declare const authAPI: {
    register: (email: string, username: string, password: string) => Promise<{
        user: User;
        token: string;
    }>;
    login: (email: string, password: string) => Promise<{
        user: User;
        token: string;
    }>;
    forgotPassword: (email: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    resetPassword: (token: string, password: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export declare const userAPI: {
    getProfile: () => Promise<User>;
    updateProfile: (data: Partial<User>) => Promise<User>;
    searchUsers: (query: string) => Promise<any>;
};
export declare const postAPI: {
    getFeed: () => Promise<any>;
    createPost: (content: string, mediaUrls?: string[], tags?: string[]) => Promise<any>;
    likePost: (postId: string) => Promise<any>;
};
export declare const friendAPI: {
    getFriends: () => Promise<any>;
    sendRequest: (targetUserId: string) => Promise<any>;
    listRequests: () => Promise<any>;
    acceptRequest: (requestId: string) => Promise<any>;
    rejectRequest: (requestId: string) => Promise<any>;
};
export declare const clanAPI: {
    listClans: (search?: string) => Promise<any>;
    createClan: (name: string, tag: string, description: string, visibility?: "PUBLIC" | "PRIVATE") => Promise<any>;
    joinClan: (clanId: string) => Promise<any>;
};
export declare const tournamentAPI: {
    listTournaments: (search?: string) => Promise<any>;
    createTournament: (title: string, description: string, game: string, startDate: string, endDate: string) => Promise<any>;
    joinTournament: (tournamentId: string) => Promise<any>;
};
//# sourceMappingURL=api.services.d.ts.map