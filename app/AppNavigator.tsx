import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AuthScreen from './screens/AuthScreen';
import FeedScreen from './screens/FeedScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [user, setUser] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(!!user); // Set user state to true if logged in, false otherwise
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    // <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // User is logged in, show Feed screen
          <>
            <Stack.Screen
              name="Feed"
              component={FeedScreen}
              options={{ title: 'Feed', headerShown: false }}
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
            options={{ title: 'Login / Sign Up' }}
          />
        )}
      </Stack.Navigator>
    // </NavigationContainer>
  );
};

export default AppNavigator;