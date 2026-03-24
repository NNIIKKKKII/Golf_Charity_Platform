import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('session')
    if (stored) {
        const session = JSON.parse(stored)
        config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
})

// Handle 401 globally — log user out if token expired
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('session')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api