import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type AuthMode = 'none' | 'guest' | 'authenticated'

interface AuthContextValue {
  mode: AuthMode
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  enterGuestMode: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const AUTH_STORAGE_KEY = 'our-memories-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthMode>('none')
  const [isLoading, setIsLoading] = useState(true)

  // 启动时从 localStorage 恢复登录状态
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const { mode: storedMode, timestamp } = JSON.parse(stored)
        // 登录状态有效期 7 天
        if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
          setMode(storedMode)
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      }
    } catch {}
    setIsLoading(false)
  }, [])

  const persistAuth = (newMode: AuthMode) => {
    setMode(newMode)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      mode: newMode,
      timestamp: Date.now()
    }))
  }

  // 本地硬编码账号（国内无需 VPN 连 Supabase）
  const ACCOUNTS = [
    { username: 'maidou', password: 'maidou666' },
  ]

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const account = ACCOUNTS.find(a => a.username === username)

    if (!account) {
      return { success: false, error: '账号不存在' }
    }

    if (account.password !== password) {
      return { success: false, error: '密码错误' }
    }

    persistAuth('authenticated')
    return { success: true }
  }

  const logout = () => {
    setMode('none')
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const enterGuestMode = () => {
    persistAuth('guest')
  }

  return (
    <AuthContext.Provider value={{ mode, isLoading, login, logout, enterGuestMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
