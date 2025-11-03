import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Configure axios defaults
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        await loadUser()
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const loadUser = async () => {
    try {
      const response = await axios.get('/api/user/me')
      setUser(response.data.user)
    } catch (error) {
      // Only logout if it's an auth error, not a network error
      if (error.response?.status === 401) {
        console.log('Session expired, logging out')
        logout()
      } else {
        console.error('Error loading user:', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    setLoading(false)
    setToken(token) // Update token state for consistency
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    setUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
