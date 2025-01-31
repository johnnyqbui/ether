import { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthScreen() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login } = useAuth();
    // console.log({ isAuthenticated })
    // // Redirect authenticated users away from the login screen
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         router.replace('/(tabs)'); // Redirect to main app if already authenticated
    //     }
    // }, [isAuthenticated]);

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Call the login function from AuthContext to persist the user session
            login(user.uid); // Pass the user ID or token to the login function

            Alert.alert('Success', 'User signed up!');
            router.replace('/(tabs)'); // Redirect to main app after signup
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Call the login function from AuthContext to persist the user session
            login(user.uid); // Pass the user ID or token to the login function

            Alert.alert('Success', 'User logged in!');
            router.replace('/(tabs)'); // Redirect to main app after login
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}