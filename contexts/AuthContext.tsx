import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { auth } from '@/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Define the shape of the context
interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (userId: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access the AuthContext
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Load authentication state on app startup
    useEffect(() => {
        const checkPersistedAuth = async () => {
            try {
                const userId = await SecureStore.getItemAsync('userId');
                if (userId) {
                    setIsAuthenticated(true);
                    // Optionally fetch user details from Firebase or another API here
                }
            } catch (error) {
                console.error('Error checking persisted authentication:', error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    setIsAuthenticated(true);
                    setUser(user);
                    await SecureStore.setItemAsync('userId', user.uid);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    await SecureStore.deleteItemAsync('userId');
                }
            } catch (error) {
                console.error('Error handling authentication state:', error);
            }
        });

        checkPersistedAuth();

        return () => unsubscribe();
    }, []);

    // Login function
    const login = async (userId: string) => {
        try {
            await SecureStore.setItemAsync('userId', userId);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to save user ID:', error);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('userId');
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            console.error('Failed to clear user ID:', error);
        }
    };

    // Provide the context value to the app
    const contextValue: AuthContextType = {
        isAuthenticated,
        user,
        login,
        logout,
        loading
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};