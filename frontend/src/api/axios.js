import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
})

// Attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('oasys_token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Handle 401 globally — redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('oasys_token')
            sessionStorage.removeItem('oasys_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api