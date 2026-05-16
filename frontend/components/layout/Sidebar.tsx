'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/types'

interface NavItem {
  href: string
  label: string
  icon: string
}

const adminNav: NavItem[] = [
  { href: '/admin', label: 'Inicio', icon: '🏠' },
  { href: '/admin/users', label: 'Usuarios', icon: '👥' },
  { href: '/admin/grupos', label: 'Grupos', icon: '📚' },
]

const teacherNav: NavItem[] = [
  { href: '/teacher', label: 'Mis grupos', icon: '🏠' },
]

const studentNav: NavItem[] = [
  { href: '/student', label: 'Mi panel', icon: '🏠' },
  { href: '/student/grupos', label: 'Mis grupos', icon: '📚' },
]

function navForRole(role: Role): NavItem[] {
  switch (role) {
    case 'ADMIN':   return adminNav
    case 'TEACHER': return teacherNav
    case 'STUDENT': return studentNav
  }
}

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const items = navForRole(user.role)
  const roleLabel = { ADMIN: 'Administrador', TEACHER: 'Docente', STUDENT: 'Alumno' }[user.role]

  return (
    <nav
      className="h-full flex flex-col bg-white border-r border-neutral-200"
      aria-label="Menú principal"
    >
      {/* Logo / brand */}
      <div className="px-6 py-5 border-b border-neutral-100">
        <span className="text-xl font-bold text-primary-700 tracking-tight">Aula</span>
        <p className="text-xs text-neutral-400 mt-0.5">{roleLabel}</p>
      </div>

      {/* Nav items */}
      <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-1" role="list">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-neutral-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div
            className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            aria-hidden
          >
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 w-full text-left px-3 py-2 text-sm text-neutral-500 hover:text-danger-600 hover:bg-danger-100 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
