import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Link } from 'expo-router';
import { useUIStore } from '../../src/store/uiStore';

export default function Home() {
    const { user, logout } = useAuth();
    const theme = useUIStore((state) => state.theme);
    const setTheme = useUIStore((state) => state.setTheme);

    return (
        <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-slate-900">
            <Text className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Welcome!</Text>
            <Text className="text-gray-500 mb-8">{user?.email}</Text>

            <Link href="/(app)/crud" asChild>
                <TouchableOpacity className="w-full bg-blue-600 p-4 rounded-xl items-center mb-4">
                    <Text className="text-white font-bold text-lg">Manage Examples (CRUD)</Text>
                </TouchableOpacity>
            </Link>

            <TouchableOpacity
                className="w-full bg-slate-200 dark:bg-slate-800 p-4 rounded-xl items-center mb-4"
                onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
                <Text className="text-slate-800 dark:text-white font-bold text-lg">
                    Toggle Theme ({theme})
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="w-full border border-red-500 p-4 rounded-xl items-center mt-auto"
                onPress={logout}
            >
                <Text className="text-red-500 font-bold text-lg">Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}
