import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HomeScreen() {
    const background = useThemeColor({}, 'background');
    const text = useThemeColor({}, 'text');

    return (
        <View style={[styles.container, { backgroundColor: background }]}>
            <Text style={[styles.text, { color: text }]}>Welcome to the Home Screen!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});