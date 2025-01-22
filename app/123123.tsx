import { Stack, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export default function Layout() {
  const [user, setUser] = useState<boolean | null>(null); // Track authentication state

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true); // User is logged in
      } else {
        setUser(false); // User is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Show a loading indicator while checking auth state
  if (user === null) {
    return null; // Or return a loading spinner
  }
  console.log({user})

  return (
    <Stack>
      {/* Redirect to Auth Screen if user is not logged in */}
      {!user && (
        <Stack.Screen
          name="auth"
          options={{ title: 'Login / Sign Up' }}
        />
      )}

      {/* Redirect to Feed Screen if user is logged in */}
      {user && (
        <>
          <Stack.Screen
            name="index" // Feed Screen
            options={{ title: 'Login / Sign Up' }}
          />
          <Stack.Screen
            name="create-posts" // Create Post Screen
            options={{ title: 'Login / Sign Up', headerShown: false }}
          />
          <Stack.Screen
            name="profile" // Profile Screen
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack>
  );
}