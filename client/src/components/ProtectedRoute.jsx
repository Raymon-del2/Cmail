import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CompassLoader from './CompassLoader'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <CompassLoader size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default ProtectedRoute
