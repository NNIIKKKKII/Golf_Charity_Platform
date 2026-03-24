import { create } from 'zustand'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useAuthStore = create((set) => ({
    user: null,
    session: null,
    loading: true,
    error: null,

    signUp: async (email, password) => {
        set({ error: null })
        try {
            await axios.post(`${API_URL}/api/auth/signup`, { email, password })
            return { success: true }
        } catch (err) {
            set({ error: err.response?.data?.error || 'Signup failed' })
            return { success: false }
        }
    },

    login: async (email, password) => {
        set({ error: null })
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })
            const { session, user } = res.data
            localStorage.setItem('session', JSON.stringify(session))
            set({ session, user, loading: false })
            return { success: true }
        } catch (err) {
            set({ error: err.response?.data?.error || 'Login failed' })
            return { success: false }
        }
    },

    logout: () => {
        localStorage.removeItem('session')
        set({ user: null, session: null, loading: false })
    },

    loadUser: async () => {
        try {
            const stored = localStorage.getItem('session')
            if (!stored) {
                set({ loading: false })
                return
            }

            const session = JSON.parse(stored)

            // Check if session is expired before making API call
            const expiresAt = session.expires_at
            if (expiresAt && Date.now() / 1000 > expiresAt) {
                localStorage.removeItem('session')
                set({ user: null, session: null, loading: false })
                return
            }

            const res = await axios.get(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${session.access_token}` }
            })

            set({ user: res.data.user, session, loading: false })

        } catch (err) {
            // Don't clear session on network errors — only on auth errors
            if (err.response?.status === 401) {
                localStorage.removeItem('session')
                set({ user: null, session: null, loading: false })
            } else {
                // Network error or server down — keep existing session
                const stored = localStorage.getItem('session')
                if (stored) {
                    set({ session: JSON.parse(stored), loading: false })
                } else {
                    set({ loading: false })
                }
            }
        }
    }
}))