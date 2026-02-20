import { create } from 'zustand';

interface UIState {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    hasSeenOnboarding: boolean;
    setHasSeenOnboarding: (seen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    theme: 'light',
    setTheme: (theme) => set({ theme }),
    hasSeenOnboarding: false,
    setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),
}));
