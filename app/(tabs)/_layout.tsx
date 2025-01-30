import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabsLayout() {
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const background = useThemeColor({}, 'background');

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: primary, // Active tab color
                tabBarInactiveTintColor: text, // Inactive tab color
                tabBarStyle: {
                    backgroundColor: background, // Tab bar background color
                    borderTopWidth: 0, // Remove the top border
                },
            }}
        >
            {/* Home Tab */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />

            {/* Explore Tab */}
            <Tabs.Screen
                name="explore/index"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" size={size} color={color} />
                    ),
                }}
            />

            {/* Profile Tab */}
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}