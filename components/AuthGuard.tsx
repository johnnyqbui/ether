import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();

    if (!user && !loading) {
        return <Redirect href="/(auth)" />;
    }

    return children;
}