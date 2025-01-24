import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { getData, removeData } from './utils/storage';
import AuthScreen from './screens/AuthScreen';
import FeedScreen from './screens/FeedScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Button } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState<boolean | null>(null); // Track authentication state

  // Check for persisted authentication state on app launch
  useEffect(() => {
    const checkAuthState = async () => {
      const userId = await getData('userId'); // Retrieve user ID from AsyncStorage
      if (userId) {
        setUser(true); // User is logged in
      } else {
        setUser(false); // User is not logged in
      }
    };

    checkAuthState();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(!!user); // Set user state to true if logged in, false otherwise
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Show a loading indicator while checking auth state
  if (user === null) {
    return null; // Or return a loading spinner
  }

  return (
    // <NavigationContainer>
    <Stack.Navigator>
      {user ? (
        // User is logged in, show Feed screen
        <>
          <Stack.Screen
            name="Feed"
            component={FeedScreen}
            options={{
              title: 'Feed',
              headerRight: () => (
                <Button
                  onPress={async () => {
                    await auth.signOut(); // Sign out the user
                    await removeData('userId'); // Remove user ID from AsyncStorage
                    setUser(false); // Update authentication state
                  }}
                  title="Logout"
                />
              ),
              headerShown: false
            }}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{ title: 'Create Post' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        </>
      ) : (
        // User is not logged in, show Auth screen
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Login / Sign Up', headerShown: false }}
        />
      )}
    </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default AppNavigator;