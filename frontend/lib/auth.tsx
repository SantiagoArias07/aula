'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { UserDto, LoginResponse } from '@/types'

interface AuthState {
  user: UserDto | null
  token: string | null
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  setAuth: (resp: LoginResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  })

  useEffect(() => {
    const token = getCookie('aula_token')
    const userJson = getCookie('aula_user')
    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson)) as UserDto
        setState({ user, token, isLoading: false })
      } catch {
        deleteCookie('aula_token')
        deleteCookie('aula_user')
        setState({ user: null, token: null, isLoading: false })
      }
    } else {
      setState(s => ({ ...s, isLoading: false }))
    }
  }, [])

  function setAuth(resp: LoginResponse) {
    setCookie('aula_token', resp.token, 1)
    setCookie('aula_user', JSON.stringify(resp.user), 1)
    setState({ user: resp.user, token: resp.token, isLoading: false })
  }

  function logout() {
    deleteCookie('aula_token')
    deleteCookie('aula_user')
    setState({ user: null, token: null, isLoading: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
