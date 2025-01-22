import { Button } from 'react-native';
import { auth } from '../app/firebase';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.replace('/auth'); // Redirect to Auth Screen after logout
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

<Button title="Logout" onPress={handleLogout} />