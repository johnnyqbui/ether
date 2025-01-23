import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyA49dHzsNSERHR1OrXID6fQcw4hBvvbD6E",
    authDomain: "ether-12f76.firebaseapp.com",
    projectId: "ether-12f76",
    storageBucket: "ether-12f76.firebasestorage.app",
    messagingSenderId: "320667570835",
    appId: "1:320667570835:web:0b9f6cda87f9ae924d7366",
    measurementId: "G-12VQ2VZKW2"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage };