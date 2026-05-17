import { Navigate } from 'react-router-dom'
import LoginPage from './LoginPage'
import useAuthStore from '../../store/authStore'

export default function RegisterPage() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <LoginPage />
}