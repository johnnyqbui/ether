import { Image, StyleSheet, Platform } from 'react-native';
import { useContext, useEffect } from 'react';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function App() {
    const { isAuthenticated, loading } = useContext(AuthContext);
    // Redirect authenticated users away from the login screen
    useEffect(() => {
        if (loading) return;

        if (isAuthenticated) {
            console.log({ isAuthenticated })
            router.replace('/(tabs)'); // Redirect to main app if already authenticated
        } else {
            router.replace('/(auth)');
        }
    }, [isAuthenticated]);

    return (
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">PUT LOGO SPLASH SCREEN HERE</ThemedText>
            <HelloWave />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
