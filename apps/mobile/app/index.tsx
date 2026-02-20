import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
                <ActivityIndicator size="large" className="text-blue-500" />
            </View>
        );
    }

    if (user) {
        return <Redirect href="/(app)" />;
    }

    return <Redirect href="/(auth)/login" />;
}
