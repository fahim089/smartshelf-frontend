import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Users, ShoppingCart,
  Truck, RotateCcw, UserCog, Settings, LogOut,
  ChevronLeft, ChevronRight, Store, Menu
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { authAPI } from '../../api'

const NAV = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/products',   icon: Package,          label: 'Products'   },
  { to: '/admin/categories', icon: Tag,              label: 'Categories' },
  { to: '/admin/people',     icon: Users,            label: 'People'     },
  { to: '/admin/sales',      icon: ShoppingCart,     label: 'Sales'      },
  { to: '/admin/purchases',  icon: Truck,            label: 'Purchases'  },
  { to: '/admin/returns',    icon: RotateCcw,        label: 'Returns'    },
  { to: '/admin/users',      icon: UserCog,          label: 'Users'      },
  { to: '/admin/profile',    icon: Settings,         label: 'Profile'    },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try { await authAPI.logout() } catch {}
    clearAuth()
    navigate('/login', { replace: true })
  }

  const NavLinks = ({ onClose }) => (
    <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} title={collapsed ? label : undefined}
          onClick={onClose}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px 16px' : '9px 12px',
            borderRadius: 9, marginBottom: 2,
            color: isActive ? '#fff' : 'var(--sidebar-text)',
            background: isActive ? 'var(--sidebar-active)' : 'transparent',
            textDecoration: 'none', fontSize: 13, fontWeight: isActive ? 600 : 400,
            whiteSpace: 'nowrap', overflow: 'hidden', transition: 'all .15s',
            borderLeft: isActive ? '3px solid var(--brand)' : '3px solid transparent',
          })}>
          <Icon size={16} style={{ flexShrink: 0 }} />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* Desktop sidebar */}
      <aside style={{
        width: collapsed ? 64 : 220, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)',
        transition: 'width .25s ease', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: collapsed ? '0 16px' : '0 20px', borderBottom: '1px solid var(--sidebar-border)', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Store size={17} color="#fff" />
          </div>
          {!collapsed && <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>Smart<span style={{ color: 'var(--brand)' }}>Shelf</span></span>}
        </div>


        <NavLinks onClose={undefined} />

        {/* Collapse + Logout */}
        <div style={{ borderTop: '1px solid var(--sidebar-border)', padding: '8px' }}>
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 16px' : '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sidebar-muted)', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 16px' : '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.5)' }} onClick={() => setMobileOpen(false)}>
          <aside style={{ width: 240, height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--sidebar-bg)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--sidebar-border)', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Store size={17} color="#fff" /></div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Smart<span style={{ color: 'var(--brand)' }}>Shelf</span></span>
            </div>
            <NavLinks onClose={() => setMobileOpen(false)} />
            <div style={{ padding: 8, borderTop: '1px solid var(--sidebar-border)' }}>
              <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', borderRadius: 9, fontSize: 13, fontFamily: 'inherit' }}>
                <LogOut size={16} /><span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Fixed top bar */}
        <header style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-icon" style={{ display: 'none' }} id="menu-btn" onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Admin Panel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--brand)' }}>Administrator</div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}