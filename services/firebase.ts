import { initializeApp } from 'firebase/app';
import {
    initializeAuth,
    getReactNativePersistence,
    onAuthStateChanged,
    signInWithEmailAndPassword as firebaseSignIn,
    createUserWithEmailAndPassword as firebaseSignUp,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore and Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

// Export Firebase services
export { app, auth, firestore, storage };

// Helper functions for authentication
export const signInWithEmailAndPassword = (email: string, password: string) => {
    return firebaseSignIn(auth, email, password);
};

export const createUserWithEmailAndPassword = (email: string, password: string) => {
    return firebaseSignUp(auth, email, password);
};

export const signOut = () => {
    return firebaseSignOut(auth);
};

// Listen for auth state changes
export const onAuthStateChangedListener = (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
};