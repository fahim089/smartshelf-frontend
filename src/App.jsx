import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import { authAPI } from './api'

import LoginPage    from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

import AdminLayout     from './pages/admin/AdminLayout'
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminProducts   from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminPeople     from './pages/admin/AdminPeople'
import AdminSales      from './pages/admin/AdminSales'
import AdminPurchases  from './pages/admin/AdminPurchases'
import AdminReturns    from './pages/admin/AdminReturns'
import AdminUsers      from './pages/admin/AdminUsers'
import AdminProfile    from './pages/admin/AdminProfile'

import StaffLayout    from './pages/staff/StaffLayout'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffProducts  from './pages/staff/StaffProducts'
import StaffSales     from './pages/staff/StaffSales'
import StaffPurchases from './pages/staff/StaffPurchases'
import StaffReturns   from './pages/staff/StaffReturns'
import StaffProfile   from './pages/staff/StaffProfile'

function RequireAuth({ children }) {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useAuthStore()
  if (!user) return null
  if (user.role !== 'admin') return <Navigate to="/staff/dashboard" replace />
  return children
}

function RequireStaff({ children }) {
  const { user } = useAuthStore()
  if (!user) return null
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'admin'
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/staff/dashboard" replace />
}

export default function App() {
  const { setAuth, clearAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { setLoading(false); return }
    authAPI.me()
      .then(({ data }) => setAuth(data.data, localStorage.getItem('access_token'), localStorage.getItem('refresh_token')))
      .catch(() => clearAuth())
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/"         element={<RoleRedirect />} />

      <Route path="/admin" element={<RequireAuth><RequireAdmin><AdminLayout /></RequireAdmin></RequireAuth>}>
        <Route index                element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"     element={<AdminDashboard />} />
        <Route path="products"      element={<AdminProducts />} />
        <Route path="categories"    element={<AdminCategories />} />
        <Route path="people"        element={<AdminPeople />} />
        <Route path="sales"         element={<AdminSales />} />
        <Route path="purchases"     element={<AdminPurchases />} />
        <Route path="returns"       element={<AdminReturns />} />
        <Route path="users"         element={<AdminUsers />} />
        <Route path="profile"       element={<AdminProfile />} />
      </Route>

      <Route path="/staff" element={<RequireAuth><RequireStaff><StaffLayout /></RequireStaff></RequireAuth>}>
        <Route index                element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"     element={<StaffDashboard />} />
        <Route path="products"      element={<StaffProducts />} />
        <Route path="sales"         element={<StaffSales />} />
        <Route path="purchases"     element={<StaffPurchases />} />
        <Route path="returns"       element={<StaffReturns />} />
        <Route path="profile"       element={<StaffProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}