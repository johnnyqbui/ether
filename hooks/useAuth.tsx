import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    onAuthStateChangedListener,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from '../services/firebase';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if the user is logged in on app startup
    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load user from storage:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthState();

        // Listen for auth state changes
        const unsubscribe = onAuthStateChangedListener((authUser) => {
            if (authUser) {
                setUser(authUser);
                AsyncStorage.setItem('user', JSON.stringify(authUser)).catch((error) => {
                    console.error('Failed to save user to storage:', error);
                });
            } else {
                setUser(null);
                AsyncStorage.removeItem('user').catch((error) => {
                    console.error('Failed to remove user from storage:', error);
                });
            }
        });

        return unsubscribe;
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const authUser = await signInWithEmailAndPassword(email, password);
            setUser(authUser);
            await AsyncStorage.setItem('user', JSON.stringify(authUser));
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    // Signup function
    const signup = async (email: string, password: string) => {
        try {
            const authUser = await createUserWithEmailAndPassword(email, password);
            setUser(authUser);
            await AsyncStorage.setItem('user', JSON.stringify(authUser));
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await signOut();
            setUser(null);
            await AsyncStorage.removeItem('user');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    return { user, loading, login, signup, logout };
}