import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, enterGuestMode } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError('请输入账号和密码')
      return
    }
    setError('')
    setLoading(true)
    const result = await login(username, password)
    setLoading(false)
    if (!result.success) {
      setError(result.error || '登录失败')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--c1)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'var(--c5)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💕
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 gradient-text">
            Two of Us
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-light)', opacity: 0.7 }}>
            铁妞时光机
          </p>
        </motion.div>

        {/* 登录表单 */}
        <motion.form
          onSubmit={handleLogin}
          className="glass rounded-3xl p-8 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-light)' }}>账号</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              className="input-field w-full"
              placeholder="输入账号"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-light)' }}>密码</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              className="input-field w-full"
              placeholder="输入密码"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <motion.p
              className="text-xs text-center py-2 px-3 rounded-xl"
              style={{ background: '#fef2f2', color: '#ef4444' }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-2xl text-sm font-semibold disabled:opacity-60"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? '登录中...' : '登 录'}
          </motion.button>

          {/* 分隔线 */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-light)', opacity: 0.4 }}>或</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* 访客模式 */}
          <motion.button
            type="button"
            onClick={enterGuestMode}
            className="w-full py-3 rounded-2xl text-sm font-medium transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--text-light)' }}
            whileHover={{ borderColor: 'var(--c1)', color: 'var(--c1)' }}
            whileTap={{ scale: 0.97 }}
          >
            👀 以访客身份浏览
          </motion.button>
        </motion.form>

        <motion.p
          className="text-center mt-8 text-xs"
          style={{ color: 'var(--text-light)', opacity: 0.4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          属于两个人的时光机
        </motion.p>
      </div>
    </div>
  )
}
