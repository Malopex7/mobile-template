import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { Link } from 'expo-router';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { register } = useAuth();

    const handleRegister = async () => {
        try {
            await register({ email, password, name });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            Alert.alert('Registration Failed', message);
        }
    };

    return (
        <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-slate-900">
            <Text className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Create Account</Text>

            <View className="w-full max-w-sm">
                <TextInput
                    className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mb-4 text-slate-800 dark:text-white"
                    placeholder="Name"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mb-4 text-slate-800 dark:text-white"
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mb-6 text-slate-800 dark:text-white"
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    className="w-full bg-blue-600 p-4 rounded-xl items-center mb-4"
                    onPress={handleRegister}
                >
                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                </TouchableOpacity>

                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity className="items-center p-2">
                        <Text className="text-blue-600 dark:text-blue-400 font-medium">Already have an account? Log in</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
