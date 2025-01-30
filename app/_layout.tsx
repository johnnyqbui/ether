import { Stack } from 'expo-router';
import AuthGuard from '@/components/AuthGuard';

export default function RootLayout() {
    return (
        <AuthGuard>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </AuthGuard>
    );
}