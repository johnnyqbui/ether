import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import AuthGuard from '@/components/AuthGuard';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SessionProvider } from '@/hooks/useSession';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from '@/contexts/AuthContext';

export default function AuthLayout() {
    const context = useContext(AuthContext);
    console.log({ context }, 'from auth layout')
    return (
        <AuthProvider>
            <Stack screenOptions={{
                headerShown: false
            }}>
                {context?.isAuthenticated
                    ? <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    : <Stack.Screen name="index" options={{ headerShown: false }} />
                }
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </AuthProvider>
    );
}
