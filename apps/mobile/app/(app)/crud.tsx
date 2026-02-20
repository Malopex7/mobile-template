import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../src/api/client';
import { ExampleEntityResponse } from '@repo/shared';

export default function CrudScreen() {
    const [title, setTitle] = useState('');
    const queryClient = useQueryClient();

    // Queries
    const { data, isLoading } = useQuery({
        queryKey: ['examples'],
        queryFn: async () => {
            const res = await apiClient('/examples');
            return res.data as ExampleEntityResponse[];
        },
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (newExample: { title: string }) => {
            return apiClient('/examples', { method: 'POST', data: newExample });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examples'] });
            setTitle('');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => {
            return apiClient(`/examples/${id}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examples'] });
        },
    });

    const handleCreate = () => {
        if (title.trim()) {
            createMutation.mutate({ title });
        }
    };

    return (
        <View className="flex-1 p-4 bg-slate-50 dark:bg-slate-900">
            <View className="flex-row items-center mb-6">
                <TextInput
                    className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mr-2 text-slate-800 dark:text-white"
                    placeholder="New Example Title..."
                    placeholderTextColor="#9ca3af"
                    value={title}
                    onChangeText={setTitle}
                />
                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-xl justify-center items-center h-full w-20"
                    onPress={handleCreate}
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold">Add</Text>
                    )}
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" className="text-blue-500 mt-10" />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View className="flex-row items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl mb-3 shadow-sm border border-slate-100 dark:border-slate-700">
                            <Text className="text-slate-800 dark:text-white font-medium text-lg">{item.title}</Text>
                            <TouchableOpacity
                                className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg"
                                onPress={() => deleteMutation.mutate(item.id)}
                                disabled={deleteMutation.isPending}
                            >
                                <Text className="text-red-500 font-medium">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text className="text-center text-slate-500 mt-10">No examples found. Create one above!</Text>
                    }
                />
            )}
        </View>
    );
}
