import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSecureToken, saveSecureToken, deleteSecureToken } from '../utils/secureStore';
import { apiClient } from '../api/client';
import { connectSocket, disconnectSocket } from '../utils/socket';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { LoginInput, RegisterInput, AuthResponse } from '@repo/shared';

type AuthContextType = {
    user: any;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = await getSecureToken('accessToken');
                if (token) {
                    setUser({ id: 'persisted-dev-stub' });
                    connectSocket();
                    // registerForPushNotificationsAsync(); // Optional: trigger push permission prompt
                }
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const login = async (data: LoginInput) => {
        const res = await apiClient('/auth/login', {
            method: 'POST',
            data,
        });
        const authData: AuthResponse = res.data;

        await saveSecureToken('accessToken', authData.accessToken);
        await saveSecureToken('refreshToken', authData.refreshToken);
        setUser(authData.user);
        connectSocket();
        // registerForPushNotificationsAsync();
    };

    const register = async (data: RegisterInput) => {
        const res = await apiClient('/auth/register', {
            method: 'POST',
            data,
        });
        const authData: AuthResponse = res.data;

        await saveSecureToken('accessToken', authData.accessToken);
        await saveSecureToken('refreshToken', authData.refreshToken);
        setUser(authData.user);
        connectSocket();
        // registerForPushNotificationsAsync();
    };

    const logout = async () => {
        const refreshToken = await getSecureToken('refreshToken');
        if (refreshToken) {
            await apiClient('/auth/logout', {
                method: 'POST',
                data: { refreshToken }
            }).catch(() => { });
        }
        await deleteSecureToken('accessToken');
        await deleteSecureToken('refreshToken');
        setUser(null);
        disconnectSocket();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
