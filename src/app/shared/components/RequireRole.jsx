import { Navigate } from 'react-router-dom'
import { useAuth } from '../../user/context/AuthContext'

export default function RequireRole({ allowedRoles, children }) {
  const { user, token, loading } = useAuth()

  // Show loading state while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        Đang kiểm tra quyền truy cập...
      </div>
    )
  }

  // Redirect to login if no token
  if (!token) {
    return <Navigate to='/login' replace />
  }

  // Get role from user object
  const role = user?.role?.name || user?.role || null

  // Check if user has allowed role
  // Support both string and array for allowedRoles
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  if (allowedRoles && rolesArray.length > 0 && !rolesArray.includes(role)) {
    return <Navigate to='/403' replace />
  }

  return children
}

