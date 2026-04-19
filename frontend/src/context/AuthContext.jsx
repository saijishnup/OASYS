import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token    = sessionStorage.getItem('oasys_token')
        const username = sessionStorage.getItem('oasys_user')
        if (token && username) {
            setUser({ username, token })
        }
        setLoading(false)
    }, [])

    const login = async (username, password) => {
        const res = await api.post('/auth/login', { username, password })
        const { token } = res.data
        sessionStorage.setItem('oasys_token', token)
        sessionStorage.setItem('oasys_user', username)
        setUser({ username, token })
        return res.data
    }

    const logout = () => {
        sessionStorage.removeItem('oasys_token')
        sessionStorage.removeItem('oasys_user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)