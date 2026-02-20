import { Stack } from 'expo-router';

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Home', headerShadowVisible: false }} />
            <Stack.Screen name="crud" options={{ title: 'Manage Examples' }} />
        </Stack>
    );
}
