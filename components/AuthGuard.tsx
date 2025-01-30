import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AuthGuard({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="../app/(auth)/index" />;
    }

    return children;
}