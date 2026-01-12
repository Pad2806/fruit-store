import { Navigate } from 'react-router-dom'

const getRoleFromToken = () => {
  const token = localStorage.getItem('access_token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch {
    return null
  }
}

export default function RequireRole({ allowedRoles, children }) {
  const token = localStorage.getItem('access_token')
  const role = getRoleFromToken()

  if (!token) return <Navigate to='/login' replace />

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to='/403' replace />
  }

  return children
}
