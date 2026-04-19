import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('oasys_token')),
  )
  const [username, setUsername] = useState(localStorage.getItem('oasys_username') || '')

  useEffect(() => {
    const token = localStorage.getItem('oasys_token')
    if (!token) {
      setIsAuthenticated(false)
      return
    }

    api.get('/auth/verify')
      .then((response) => {
        setIsAuthenticated(Boolean(response.data?.valid))
        if (response.data?.username) {
          setUsername(response.data.username)
          localStorage.setItem('oasys_username', response.data.username)
        }
      })
      .catch(() => {
        localStorage.removeItem('oasys_token')
        localStorage.removeItem('oasys_username')
        localStorage.removeItem('isLoggedIn')
        setIsAuthenticated(false)
      })
  }, [])

  const value = {
    isAuthenticated,
    username,
    login(token, nextUsername = '') {
      localStorage.setItem('oasys_token', token)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('oasys_username', nextUsername)
      setIsAuthenticated(true)
      setUsername(nextUsername)
    },
    logout() {
      localStorage.removeItem('oasys_token')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('oasys_username')
      setIsAuthenticated(false)
      setUsername('')
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
