import { Stack, Slot } from 'expo-router';

export default function Layout(props) {
    console.log({ props }, 'experience')
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
