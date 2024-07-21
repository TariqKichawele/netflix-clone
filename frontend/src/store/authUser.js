import axios from 'axios';
import toast from 'react-hot-toast'
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isCheckingAuth: false,
    isLogginOut: false,
    isLoggingIn: false,

    signUp: async (credentials) => {
        set({ isSigningUp: true });
        try {
            const res = await axios.post('/api/v1/auth/signup', credentials);
            set({ user: res.data.user , isSigningUp: false });
            toast.success('Signed Up Successfully');
        } catch (error) {
            toast.error('Failed to Sign Up');
            set({ isSigningUp: false, user: null });
        }
    },
    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const res = await axios.post('/api/v1/auth/login', credentials);
            set({ user: res.data.user, isLoggingIn: false });
            toast.success('Logged In Successfully');
        } catch (error) {
            toast.error('Failed to Login');
            set({ isLoggingIn: false, user: null });
        }
    },
    logout: async () => {
        set({ isLogginOut: true });
        try {
            await axios.post('/api/v1/auth/logout');
            set({ user: null, isLogginOut: false });
            toast.success('Logged Out Successfully');
        } catch (error) {
            toast.error('Failed to Logout');
            set({ isLogginOut: false });
        }
    },
    authCheck: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axios.get('/api/v1/auth/authCheck');
            set({ user: res.data.user, isCheckingAuth: false });
        } catch (error) {
            set({ user: null, isCheckingAuth: false });
        }
    }
}));