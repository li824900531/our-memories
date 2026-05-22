import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SettingsProvider, useSettings, Album, VideoAlbum } from './context/SettingsContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import SettingsPanel from './components/SettingsPanel'
import LoginPage from './components/LoginPage'

type Page = 'home' | 'albums' | 'gallery' | 'video-albums' | 'timeline' | 'letters'

/* ════════════════════════════════════════════════
   导航栏
════════════════════════════════════════════════ */
function Navbar({ current, onNavigate, isAuthenticated }: { current: Page; onNavigate: (p: Page) => void; isAuthenticated: boolean }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { logout } = useAuth()

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass border-b"
        style={{ borderColor: 'var(--border)' }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div
              className="text-sm font-bold tracking-widest gradient-text cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              MEMORY
            </div>
            <div className="hidden sm:flex items-center gap-8">
              {([
                ['home', '首页'],
                ['albums', '相册'],
                ['video-albums', '视频册'],
                ['timeline', '时间线'],
                ['letters', '情书'],
              ] as [Page, string][]).map(([key, label]) => (
                <NavButton key={key} active={current === key} onClick={() => onNavigate(key)}>
                  {label}
                </NavButton>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <motion.button
                  onClick={() => setSettingsOpen(true)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ⚙️
                </motion.button>
              )}
              {isAuthenticated && (
                <motion.button
                  onClick={logout}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="退出登录"
                >
                  🚪
                </motion.button>
              )}
              {!isAuthenticated && (
                <motion.button
                  onClick={logout}
                  className="text-xs px-3 py-1.5 rounded-xl"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-light)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  退出访客
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

function NavButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative text-xs tracking-wider font-medium"
      style={{ color: active ? 'var(--c1)' : 'var(--text-light)' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
          style={{ background: 'var(--gradient)' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      )}
    </motion.button>
  )
}

/* ════════════════════════════════════════════════
   首页
════════════════════════════════════════════════ */
function HomePage({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { data, updateHome } = useSettings()
  const h = data.home
  const [editing, setEditing] = useState(false)

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
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
          <motion.div
            className="absolute top-[40%] right-[20%] w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ background: 'var(--c3)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
        </div>

        <div className="relative">
          <motion.div
            className="mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.1 }}
          >
            {h.heroImage ? (
              <img
                src={h.heroImage}
                alt="hero"
                className="object-contain rounded-2xl"
                style={{ 
                  imageRendering: 'auto',
                  width: h.heroImageSize || 160,
                  height: h.heroImageSize || 160,
                  marginLeft: h.heroImageOffsetX || 0,
                  marginTop: h.heroImageOffsetY || 0,
                }}
              />
            ) : (
              <span className="text-7xl">{h.heroEmoji}</span>
            )}
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ marginTop: h.heroImageMarginBottom || 0 }}
          >
            <span
              suppressContentEditableWarning
              contentEditable={isAuthenticated && editing}
              onBlur={e => updateHome({ heroTitle: e.currentTarget.textContent || '' })}
              className="gradient-text"
            >
              {h.heroTitle}
            </span>
          </motion.h1>

          <motion.p
            suppressContentEditableWarning
            contentEditable={isAuthenticated && editing}
            onBlur={e => updateHome({ heroSubtitle: e.currentTarget.textContent || '' })}
            className="text-lg md:text-xl mb-4 max-w-md mx-auto"
            style={{ color: 'var(--text-light)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {h.heroSubtitle}
          </motion.p>

          <motion.p
            suppressContentEditableWarning
            contentEditable={isAuthenticated && editing}
            onBlur={e => updateHome({ heroTagline: e.currentTarget.textContent || '' })}
            className="text-sm max-w-sm mx-auto"
            style={{ color: 'var(--text-light)', opacity: 0.7 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            "{h.heroTagline}"
          </motion.p>

          {/* 编辑提示 - 仅登录后可见 */}
          {isAuthenticated && (
            <motion.button
              onClick={() => setEditing(!editing)}
              className="mt-6 px-5 py-2 rounded-full text-xs font-medium"
              style={{
                background: editing ? 'var(--c1)' : 'var(--card)',
                color: editing ? 'white' : 'var(--text-light)',
                border: editing ? 'none' : '1px solid var(--border)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {editing ? '✓ 编辑模式已开启（点击文字即可修改）' : '✏️ 开启编辑模式'}
            </motion.button>
          )}
        </div>

        {/* 装饰线 */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="w-px h-16 rounded-full"
            style={{ background: 'linear-gradient(to bottom, var(--c1), transparent)' }}
            animate={{ scaleY: [1, 0.6, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* 统计卡片 */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          className="grid grid-cols-3 gap-4 md:gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { emoji: '📅', label: h.statsLabel1, number: '∞' },
            { emoji: '📷', label: h.statsLabel2, number: (isAuthenticated ? data.photos.length : data.photos.filter(p => !p.isPrivate).length) + '+' },
            { emoji: '❤️', label: h.statsLabel3, number: '∞' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="text-center p-6 md:p-8 rounded-3xl glass"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <div className="text-3xl md:text-4xl mb-3">{stat.emoji}</div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.number}</div>
              <div className="text-xs md:text-sm" style={{ color: 'var(--text-light)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 大字展示 */}
      <section className="py-20 text-center relative overflow-hidden">
        <motion.p
          className="text-7xl md:text-9xl font-bold select-none"
          style={{ color: 'var(--text)', opacity: 0.04 }}
          initial={{ scale: 0.8 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          LOVE
        </motion.p>
      </section>
    </div>
  )
}

/* ════════════════════════════════════════════════
   相册册页面（展示所有相册卡片，类似QQ空间）
════════════════════════════════════════════════ */
function AlbumsPage({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { data, addAlbum, removeAlbum, updateAlbum } = useSettings()
  const [currentPage, setCurrentPage] = useState<'list' | 'detail'>('list')
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', emoji: '📷' })

  // 过滤数据：访客模式隐藏私密内容
  const visibleAlbums = isAuthenticated ? data.albums : data.albums.filter(a => !a.isPrivate)
  const visiblePhotos = isAuthenticated ? data.photos : data.photos.filter(p => !p.isPrivate)

  // 获取排序后的相册（置顶在前）
  const sortedAlbums = [...visibleAlbums].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1
    return a.sortOrder - b.sortOrder
  })

  const activeAlbum = visibleAlbums.find(a => a.id === activeAlbumId)
  const albumPhotos = activeAlbumId ? visiblePhotos.filter(p => p.albumId === activeAlbumId) : visiblePhotos

  // 点击相册卡片进入详情
  const handleAlbumClick = (albumId: string) => {
    setActiveAlbumId(albumId)
    setCurrentPage('detail')
  }

  // 回到相册列表
  const handleBack = () => {
    setCurrentPage('list')
    setActiveAlbumId(null)
  }

  // 创建相册
  const handleCreate = () => {
    if (!formData.name) return
    addAlbum({
      id: Date.now().toString(),
      name: formData.name,
      emoji: formData.emoji,
      coverPhotoId: null,
      sortOrder: data.albums.length,
      isPinned: false,
      createdAt: new Date().toISOString(),
    })
    setFormData({ name: '', emoji: '📷' })
    setShowForm(false)
  }

  // 删除相册
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定删除这个相册吗？里面的照片不会删除。')) {
      removeAlbum(id)
    }
  }

  // 相册册列表页
  if (currentPage === 'list') {
    return (
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 头部 */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs tracking-[0.3em] mb-3 font-medium" style={{ color: 'var(--c1)' }}>ALBUMS</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>相册</h2>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-light)' }}>
                  {visibleAlbums.length} 个相册 · {visiblePhotos.length} 张照片
                </p>
              </div>
              {isAuthenticated && (
                <motion.button
                  onClick={() => setShowForm(!showForm)}
                  className="btn-primary px-6 py-3 rounded-2xl text-sm flex items-center gap-2"
                  whileTap={{ scale: 0.95 }}
                >
                  <span>+</span> 新建相册
                </motion.button>
              )}
            </div>

            {/* 创建表单 */}
            {showForm && (
              <motion.div
                className="glass rounded-3xl p-6 mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs" style={{ color: 'var(--text-light)' }}>Emoji</label>
                    <input
                      type="text"
                      value={formData.emoji}
                      onChange={e => setFormData({ ...formData, emoji: e.target.value })}
                      className="input-field text-center text-2xl"
                      placeholder="📷"
                    />
                  </div>
                  <div className="flex-[3] space-y-1">
                    <label className="text-xs" style={{ color: 'var(--text-light)' }}>相册名称</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="输入相册名称"
                    />
                  </div>
                  <button onClick={handleCreate} className="btn-primary px-6 py-2 rounded-xl text-sm h-10">
                    创建
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm h-10" style={{ border: '1px solid var(--border)' }}>
                    取消
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* 相册卡片网格 */}
          {sortedAlbums.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
              <div className="text-5xl mb-4">📚</div>
              <p>还没有相册</p>
              <p className="text-sm mt-2">点击右上角按钮创建相册</p>
            </div>
          ) : (
            <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" layout>
              <AnimatePresence>
                {sortedAlbums.map((album, i) => {
                  const coverPhoto = data.photos.find(p => p.id === album.coverPhotoId)
                  const photoCount = data.photos.filter(p => p.albumId === album.id).length
                  const videoCount = data.videos.filter(v => v.albumId === album.id).length

                  return (
                    <motion.div
                      key={album.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      onClick={() => handleAlbumClick(album.id)}
                      className="relative rounded-3xl overflow-hidden cursor-pointer group aspect-[4/5]"
                      style={{ background: 'linear-gradient(135deg, var(--c1) 0%, var(--c5) 100%)' }}
                      whileHover={{ scale: 1.03, y: -4 }}
                    >
                      {/* 封面图 */}
                      {coverPhoto?.url ? (
                        <img src={coverPhoto.url} alt={album.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-7xl opacity-40">{album.emoji}</span>
                        </div>
                      )}
                      {/* 渐变遮罩 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      {/* 置顶标签 */}
                      {album.isPinned && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-yellow-400 text-white text-xs font-medium flex items-center gap-1">
                          📌
                        </div>
                      )}
                      {/* 私密标签 */}
                      {album.isPrivate && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gray-700 text-white text-xs font-medium">
                          🔒
                        </div>
                      )}
                      {/* 删除按钮 - 仅登录可见 */}
                      {isAuthenticated && (
                        <button
                          onClick={(e) => handleDelete(album.id, e)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                        >
                          🗑
                        </button>
                      )}
                      {/* 信息 */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{album.emoji}</span>
                          <span className="text-white font-bold text-lg truncate">{album.name}</span>
                        </div>
                        <p className="text-white/70 text-xs">
                          {photoCount}张照片{videoCount > 0 ? ` · ${videoCount}个视频` : ''}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // 相册详情页
  return (
    <AlbumDetailPage
      album={activeAlbum!}
      photos={albumPhotos}
      allAlbums={visibleAlbums}
      onBack={handleBack}
      isAuthenticated={isAuthenticated}
    />
  )
}

/* ════════════════════════════════════════════════
   相册详情页（查看单个相册内的照片）
════════════════════════════════════════════════ */
function AlbumDetailPage({ album, photos, allAlbums, onBack, isAuthenticated }: {
  album: Album
  photos: any[]
  allAlbums: Album[]
  onBack: () => void
  isAuthenticated: boolean
}) {
  const { data, addPhoto, removePhoto, updatePhoto, movePhotoToAlbum, updateAlbum } = useSettings()
  const [selected, setSelected] = useState<any>(null)
  const [showAlbumPicker, setShowAlbumPicker] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ photo: any; x: number; y: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const coverPhoto = data.photos.find(p => p.id === album.coverPhotoId)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = e => {
        addPhoto({
          id: Date.now().toString() + Math.random(),
          url: e.target?.result as string,
          date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
          caption: file.name.replace(/\.[^/.]+$/, ''),
          albumId: album.id,
        })
      }
      reader.readAsDataURL(file)
    })
  }, [addPhoto, album.id])

  const handleContextMenu = (e: React.MouseEvent, photo: any) => {
    e.preventDefault()
    setContextMenu({ photo, x: e.clientX, y: e.clientY })
  }

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 返回按钮 */}
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-sm"
            style={{ color: 'var(--text-light)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span>←</span> 返回相册
          </motion.button>

          {/* 相册封面 */}
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--c1) 0%, var(--c5) 100%)' }}>
              {coverPhoto?.url ? (
                <img src={coverPhoto.url} alt={album.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{album.emoji}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{album.emoji}</span>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{album.name}</h2>
                {album.isPinned && <span className="text-sm">📌</span>}
              </div>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-light)' }}>
                {photos.length} 张照片
              </p>
            </div>
            {isAuthenticated && (
              <motion.button
                onClick={() => fileRef.current?.click()}
                className="btn-primary px-6 py-3 rounded-2xl text-sm flex items-center gap-2 ml-auto"
                whileTap={{ scale: 0.95 }}
              >
                <span>+</span> 添加照片
              </motion.button>
            )}
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => handleFiles(e.target.files)} />
          </div>
        </motion.div>

        {/* 拖拽上传 - 仅登录可见 */}
        {isAuthenticated && (
          <motion.div
            className={`drop-zone mb-8 ${dragging ? 'drag-over' : ''}`}
            style={{ borderRadius: 'var(--radius)' }}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm" style={{ color: 'var(--text-light)' }}>
              📂 拖拽照片到此处上传 · 将归入「{album.name}」
            </p>
          </motion.div>
        )}

        {/* 照片网格 */}
        <motion.div className="photo-grid" layout>
          <AnimatePresence>
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                onClick={() => photo.url && setSelected(photo)}
                onContextMenu={e => handleContextMenu(e, photo)}
                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer group ${
                  i % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ background: 'var(--card)' }}
                whileHover={{ scale: 1.03 }}
              >
                {photo.url ? (
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center" style={{ color: 'var(--text-light)', opacity: 0.4 }}>
                    <span className="text-4xl mb-2">🖼️</span>
                    <span className="text-xs">{photo.caption}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">{photo.caption}</p>
                  <p className="text-white/60 text-xs">{photo.date}</p>
                </div>
                {/* 封面标记 */}
                {photo.id === album.coverPhotoId && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-yellow-400 text-white text-xs font-medium">
                    📌 封面
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {photos.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
            <div className="text-5xl mb-4">📷</div>
            <p>这个相册还没有照片</p>
          </div>
        )}
      </div>

      {/* 右键菜单 */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContextMenu(null)}
            />
            <motion.div
              className="fixed z-50 rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: 'var(--card)', minWidth: 160, top: contextMenu.y, left: contextMenu.x }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {[
                { label: '📌 设为相册封面', action: () => {
                  updateAlbum(album.id, { coverPhotoId: contextMenu.photo.id })
                  setContextMenu(null)
                }},
                { label: '📂 移动到其他相册', action: () => {
                  setShowAlbumPicker(contextMenu.photo.id)
                  setContextMenu(null)
                }},
                { label: '✏️ 修改描述', action: () => {
                  const newCaption = prompt('修改描述', contextMenu.photo.caption)
                  if (newCaption !== null) updatePhoto(contextMenu.photo.id, { caption: newCaption })
                  setContextMenu(null)
                }},
                { label: '🗑 删除照片', action: () => { removePhoto(contextMenu.photo.id); setContextMenu(null); if (selected?.id === contextMenu.photo.id) setSelected(null) }, danger: true },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full text-left px-4 py-3 text-xs hover:bg-black/5 transition-colors"
                  style={{ color: (item as any).danger ? '#ef4444' : 'var(--text)' }}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 分类选择弹窗 */}
      <AnimatePresence>
        {showAlbumPicker && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAlbumPicker(null)}
          >
            <motion.div
              className="max-w-sm w-full rounded-3xl p-6"
              style={{ background: 'var(--card)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>📂 移动到其他相册</h3>
              <div className="space-y-2">
                {allAlbums.filter(a => a.id !== album.id).map(a => (
                  <button
                    key={a.id}
                    onClick={() => { movePhotoToAlbum(showAlbumPicker, a.id); setShowAlbumPicker(null) }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-2 transition-all"
                    style={{ background: 'var(--bg)', color: 'var(--text)' }}
                  >
                    <span>{a.emoji}</span> {a.name}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAlbumPicker(null)} className="mt-4 w-full py-3 rounded-xl text-sm" style={{ color: 'var(--text-light)' }}>
                取消
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 照片查看器 */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="max-w-3xl w-full rounded-3xl overflow-hidden"
              style={{ background: 'var(--bg)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="aspect-video" style={{ background: '#000' }}>
                {selected.url && <img src={selected.url} alt={selected.caption} className="w-full h-full object-contain" />}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text)' }}>{selected.caption}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>{selected.date}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="btn-ghost px-4 py-2 rounded-xl text-sm">关闭</button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { updateAlbum(album.id, { coverPhotoId: selected.id }); setSelected(null) }}
                    className="px-4 py-2 rounded-xl text-sm" style={{ background: 'var(--c1)', color: 'white' }}>
                    📌 设为封面
                  </button>
                  <button onClick={() => { removePhoto(selected.id); setSelected(null) }}
                    className="px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-50 transition-colors">
                    🗑 删除
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════
   照片管理页（查看全部照片）
════════════════════════════════════════════════ */
function GalleryPage({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { data, addPhoto, removePhoto, updatePhoto, movePhotoToAlbum, updateAlbum } = useSettings()
  const [selected, setSelected] = useState<any>(null)
  const [showAlbumPicker, setShowAlbumPicker] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ photo: any; x: number; y: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [batchSelected, setBatchSelected] = useState<Set<string>>(new Set())

  // 过滤数据
  const visiblePhotos = isAuthenticated ? data.photos : data.photos.filter(p => !p.isPrivate)
  const visibleAlbums = isAuthenticated ? data.albums : data.albums.filter(a => !a.isPrivate)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = e => {
        addPhoto({
          id: Date.now().toString() + Math.random(),
          url: e.target?.result as string,
          date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
          caption: file.name.replace(/\.[^/.]+$/, ''),
          albumId: null,
        })
      }
      reader.readAsDataURL(file)
    })
  }, [addPhoto])

  const handleContextMenu = (e: React.MouseEvent, photo: any) => {
    e.preventDefault()
    setContextMenu({ photo, x: e.clientX, y: e.clientY })
  }

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs tracking-[0.3em] mb-3 font-medium" style={{ color: 'var(--c1)' }}>ALL PHOTOS</p>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>全部照片</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-light)' }}>
                {data.photos.length} 张照片
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => fileRef.current?.click()}
                className="btn-primary px-6 py-3 rounded-2xl text-sm flex items-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <span>+</span> 添加照片
              </motion.button>
              {data.photos.length > 0 && (
                <motion.button
                  onClick={() => {
                    setBatchMode(!batchMode)
                    setBatchSelected(new Set())
                  }}
                  className={`px-6 py-3 rounded-2xl text-sm flex items-center gap-2 transition-all`}
                  style={batchMode ? { background: 'var(--c1)', color: 'white' } : { border: '1px solid var(--border)', color: 'var(--text)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {batchMode ? '✓ 完成选择' : '☐ 批量选择'}
                </motion.button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => handleFiles(e.target.files)} />
          </div>
        </motion.div>

        {/* 拖拽上传 */}
        <motion.div
          className={`drop-zone mb-8 ${dragging ? 'drag-over' : ''}`}
          style={{ borderRadius: 'var(--radius)' }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm" style={{ color: 'var(--text-light)' }}>
            📂 拖拽照片到此处上传（不归入任何相册）
          </p>
        </motion.div>

        {/* 照片网格 */}
        <motion.div className="photo-grid" layout>
          <AnimatePresence>
            {data.photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                onClick={() => {
                  if (batchMode) {
                    setBatchSelected(prev => {
                      const next = new Set(prev)
                      if (next.has(photo.id)) next.delete(photo.id)
                      else next.add(photo.id)
                      return next
                    })
                  } else {
                    photo.url && setSelected(photo)
                  }
                }}
                onContextMenu={e => handleContextMenu(e, photo)}
                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer group ${
                  i % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } ${batchSelected.has(photo.id) ? 'ring-4 ring-c1 scale-95' : ''}`}
                style={{ background: 'var(--card)' }}
                whileHover={{ scale: batchMode ? (batchSelected.has(photo.id) ? 0.95 : 1.02) : 1.03 }}
              >
                {photo.url ? (
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center" style={{ color: 'var(--text-light)', opacity: 0.4 }}>
                    <span className="text-4xl mb-2">🖼️</span>
                    <span className="text-xs">{photo.caption}</span>
                  </div>
                )}
                {/* 选中标记 */}
                {batchMode && (
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    batchSelected.has(photo.id) ? 'bg-c1 border-c1' : 'border-white/80'
                  }`}>
                    {batchSelected.has(photo.id) && <span className="text-white text-xs">✓</span>}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">{photo.caption}</p>
                  <p className="text-white/60 text-xs">{photo.date}</p>
                </div>
                {/* 分类标签 */}
                {photo.albumId && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-xs backdrop-blur-sm"
                    style={{ background: 'rgba(0,0,0,0.4)' }}>
                    {data.albums.find(a => a.id === photo.albumId)?.emoji}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {data.photos.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
            <div className="text-5xl mb-4">📷</div>
            <p>还没有照片</p>
          </div>
        )}
      </div>

      {/* 批量操作栏 */}
      {batchMode && (
        <motion.div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-full glass shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            已选择 {batchSelected.size} 张
          </span>
          <button
            onClick={() => {
              batchSelected.forEach(id => removePhoto(id))
              setBatchSelected(new Set())
              setBatchMode(false)
            }}
            className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            🗑 删除
          </button>
          <button
            onClick={() => {
              setBatchSelected(new Set())
              setBatchMode(false)
            }}
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            取消
          </button>
        </motion.div>
      )}

      {/* 右键菜单 */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContextMenu(null)}
            />
            <motion.div
              className="fixed z-50 rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: 'var(--card)', minWidth: 160, top: contextMenu.y, left: contextMenu.x }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {[
                { label: '📂 移动到相册', action: () => {
                  setShowAlbumPicker(contextMenu.photo.id)
                  setContextMenu(null)
                }},
                { label: '✏️ 修改描述', action: () => {
                  const newCaption = prompt('修改描述', contextMenu.photo.caption)
                  if (newCaption !== null) updatePhoto(contextMenu.photo.id, { caption: newCaption })
                  setContextMenu(null)
                }},
                { label: '🗑 删除照片', action: () => { removePhoto(contextMenu.photo.id); setContextMenu(null); if (selected?.id === contextMenu.photo.id) setSelected(null) }, danger: true },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full text-left px-4 py-3 text-xs hover:bg-black/5 transition-colors"
                  style={{ color: (item as any).danger ? '#ef4444' : 'var(--text)' }}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 分类选择弹窗 */}
      <AnimatePresence>
        {showAlbumPicker && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAlbumPicker(null)}
          >
            <motion.div
              className="max-w-sm w-full rounded-3xl p-6"
              style={{ background: 'var(--card)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>📂 移动到相册</h3>
              <div className="space-y-2">
                <button
                  onClick={() => { movePhotoToAlbum(showAlbumPicker, null); setShowAlbumPicker(null) }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-2 transition-all"
                  style={{ background: data.photos.find(p => p.id === showAlbumPicker)?.albumId === null ? 'var(--c1)' : 'var(--bg)', color: data.photos.find(p => p.id === showAlbumPicker)?.albumId === null ? 'white' : 'var(--text)' }}
                >
                  📁 未分类
                </button>
                {data.albums.map(album => (
                  <button
                    key={album.id}
                    onClick={() => { movePhotoToAlbum(showAlbumPicker, album.id); setShowAlbumPicker(null) }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-2 transition-all"
                    style={{ background: data.photos.find(p => p.id === showAlbumPicker)?.albumId === album.id ? 'var(--c1)' : 'var(--bg)', color: data.photos.find(p => p.id === showAlbumPicker)?.albumId === album.id ? 'white' : 'var(--text)' }}
                  >
                    <span>{album.emoji}</span> {album.name}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAlbumPicker(null)} className="mt-4 w-full py-3 rounded-xl text-sm" style={{ color: 'var(--text-light)' }}>
                取消
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 照片查看器 */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="max-w-3xl w-full rounded-3xl overflow-hidden"
              style={{ background: 'var(--bg)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="aspect-video" style={{ background: '#000' }}>
                {selected.url && <img src={selected.url} alt={selected.caption} className="w-full h-full object-contain" />}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text)' }}>{selected.caption}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>{selected.date}</p>
                    {selected.albumId && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs"
                        style={{ background: 'var(--c1)', color: 'white', opacity: 0.8 }}>
                        {data.albums.find(a => a.id === selected.albumId)?.emoji} {data.albums.find(a => a.id === selected.albumId)?.name}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setSelected(null)} className="btn-ghost px-4 py-2 rounded-xl text-sm">关闭</button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { removePhoto(selected.id); setSelected(null) }}
                    className="px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-50 transition-colors">
                    🗑 删除
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════
   视频册页面（展示所有视频相册卡片）
════════════════════════════════════════════════ */
function VideoAlbumsPage() {
  const { data, addVideoAlbum, removeVideoAlbum } = useSettings()
  const [currentPage, setCurrentPage] = useState<'list' | 'detail'>('list')
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', emoji: '🎬' })

  const sortedAlbums = [...data.videoAlbums].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1
    return a.sortOrder - b.sortOrder
  })

  const activeAlbum = data.videoAlbums.find(a => a.id === activeAlbumId)
  const albumVideos = activeAlbumId ? data.videos.filter(v => v.albumId === activeAlbumId) : data.videos

  const handleAlbumClick = (albumId: string) => {
    setActiveAlbumId(albumId)
    setCurrentPage('detail')
  }

  const handleBack = () => {
    setCurrentPage('list')
    setActiveAlbumId(null)
  }

  // 创建视频册
  const handleCreate = () => {
    if (!formData.name) return
    addVideoAlbum({
      id: Date.now().toString(),
      name: formData.name,
      emoji: formData.emoji,
      coverVideoId: null,
      sortOrder: data.videoAlbums.length,
      isPinned: false,
      createdAt: new Date().toISOString(),
    })
    setFormData({ name: '', emoji: '🎬' })
    setShowForm(false)
  }

  // 删除视频册
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定删除这个视频册吗？里面的视频不会删除。')) {
      removeVideoAlbum(id)
    }
  }

  // 视频相册册列表页
  if (currentPage === 'list') {
    return (
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 头部 */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs tracking-[0.3em] mb-3 font-medium" style={{ color: 'var(--c5)' }}>VIDEO ALBUMS</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>视频册</h2>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-light)' }}>
                  {data.videoAlbums.length} 个视频册 · {data.videos.length} 个视频
                </p>
              </div>
              <motion.button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary px-6 py-3 rounded-2xl text-sm flex items-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <span>+</span> 新建视频册
              </motion.button>
            </div>

            {/* 创建表单 */}
            {showForm && (
              <motion.div
                className="glass rounded-3xl p-6 mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs" style={{ color: 'var(--text-light)' }}>Emoji</label>
                    <input
                      type="text"
                      value={formData.emoji}
                      onChange={e => setFormData({ ...formData, emoji: e.target.value })}
                      className="input-field text-center text-2xl"
                      placeholder="🎬"
                    />
                  </div>
                  <div className="flex-[3] space-y-1">
                    <label className="text-xs" style={{ color: 'var(--text-light)' }}>视频册名称</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="输入视频册名称"
                    />
                  </div>
                  <button onClick={handleCreate} className="btn-primary px-6 py-2 rounded-xl text-sm h-10">
                    创建
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm h-10" style={{ border: '1px solid var(--border)' }}>
                    取消
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* 视频相册卡片网格 */}
          {sortedAlbums.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
              <div className="text-5xl mb-4">🎬</div>
              <p>还没有视频册</p>
              <p className="text-sm mt-2">点击右上角按钮创建视频册</p>
            </div>
          ) : (
            <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" layout>
              <AnimatePresence>
                {sortedAlbums.map((album, i) => {
                  const coverVideo = data.videos.find(v => v.id === album.coverVideoId)
                  const videoCount = data.videos.filter(v => v.albumId === album.id).length

                  return (
                    <motion.div
                      key={album.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      onClick={() => handleAlbumClick(album.id)}
                      className="relative rounded-3xl overflow-hidden cursor-pointer group aspect-[4/5]"
                      style={{ background: 'linear-gradient(135deg, var(--c5) 0%, var(--c6) 100%)' }}
                      whileHover={{ scale: 1.03, y: -4 }}
                    >
                      {/* 封面视频 */}
                      {coverVideo?.url ? (
                        <video src={coverVideo.url} className="absolute inset-0 w-full h-full object-cover" muted />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-7xl opacity-40">{album.emoji}</span>
                        </div>
                      )}
                      {/* 渐变遮罩 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      {/* 置顶标签 */}
                      {album.isPinned && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-yellow-400 text-white text-xs font-medium flex items-center gap-1">
                          📌
                        </div>
                      )}
                      {/* 删除按钮 */}
                      <button
                        onClick={(e) => handleDelete(album.id, e)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                      >
                        🗑
                      </button>
                      {/* 信息 */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{album.emoji}</span>
                          <span className="text-white font-bold text-lg truncate">{album.name}</span>
                        </div>
                        <p className="text-white/70 text-xs">
                          {videoCount}个视频
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // 视频相册详情页
  // 如果没有选中相册，返回列表页
  if (!activeAlbum) {
    return (
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center" style={{ color: 'var(--text-light)' }}>
          <p>视频册不存在</p>
          <button onClick={handleBack} className="btn-primary mt-4 px-6 py-3 rounded-2xl text-sm">
            返回视频册
          </button>
        </div>
      </div>
    )
  }

  return (
    <VideoAlbumDetailPage
      album={activeAlbum}
      videos={albumVideos}
      allAlbums={data.videoAlbums}
      onBack={handleBack}
    />
  )
}

/* ════════════════════════════════════════════════
   视频相册详情页
════════════════════════════════════════════════ */
function VideoAlbumDetailPage({ album, videos, allAlbums, onBack }: {
  album: VideoAlbum
  videos: any[]
  allAlbums: VideoAlbum[]
  onBack: () => void
}) {
  const { data, addVideo, removeVideo, moveVideoToAlbum, updateVideoAlbum } = useSettings()
  const [selected, setSelected] = useState<any>(null)
  const [showAlbumPicker, setShowAlbumPicker] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const coverVideo = data.videos.find(v => v.id === album.coverVideoId)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/')
      const isAudio = file.type.startsWith('audio/')
      if (!isVideo && !isAudio) return
      const url = URL.createObjectURL(file)
      addVideo({
        id: Date.now().toString() + Math.random(),
        url,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        title: file.name.replace(/\.[^/.]+$/, ''),
        isAudio,
        albumId: album.id,
      })
    })
  }, [addVideo, album.id])

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 头部 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 返回按钮 */}
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 text-sm"
            style={{ color: 'var(--text-light)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span>←</span> 返回视频册
          </motion.button>

          {/* 视频册封面 */}
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, var(--c5) 0%, var(--c6) 100%)' }}>
              {coverVideo?.url ? (
                <video src={coverVideo.url} className="w-full h-full object-cover" muted />
              ) : (
                <span className="text-4xl">{album.emoji}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{album.emoji}</span>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{album.name}</h2>
                {album.isPinned && <span className="text-sm">📌</span>}
              </div>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-light)' }}>
                {videos.length} 个视频
              </p>
            </div>
            <motion.button
              onClick={() => fileRef.current?.click()}
              className="btn-primary px-6 py-3 rounded-2xl text-sm flex items-center gap-2 ml-auto"
              whileTap={{ scale: 0.95 }}
            >
              <span>+</span> 添加视频
            </motion.button>
            <input ref={fileRef} type="file" accept="video/*,audio/*" multiple className="hidden"
              onChange={e => handleFiles(e.target.files)} />
          </div>
        </motion.div>

        {/* 拖拽上传 */}
        <motion.div
          className={`drop-zone mb-8 ${dragging ? 'drag-over' : ''}`}
          style={{ borderRadius: 'var(--radius)' }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm" style={{ color: 'var(--text-light)' }}>
            🎬 拖拽视频/音频到此处上传 · 将归入「{album.name}」
          </p>
        </motion.div>

        {/* 视频网格 */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" layout>
          <AnimatePresence>
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => video.url && setSelected(video)}
                onContextMenu={e => {
                  e.preventDefault()
                  setShowAlbumPicker(video.id)
                }}
                className="glass rounded-3xl overflow-hidden cursor-pointer hover-lift relative"
              >
                {video.id === album.coverVideoId && (
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-yellow-400 text-white text-xs font-medium">
                    📌 封面
                  </div>
                )}
                <div className="aspect-video relative" style={{ background: 'linear-gradient(135deg, var(--c5) 0%, var(--c6) 100%)' }}>
                  {video.url ? <video src={video.url} className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">{video.isAudio ? '🎵' : '🎬'}</span>
                    </div>
                  )}
                  {!video.isAudio && video.url && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-xl ml-1">▶</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{video.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>{video.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {videos.length === 0 && (
          <div className="text-center py-20" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
            <div className="text-5xl mb-4">🎬</div>
            <p>这个视频册还没有视频</p>
          </div>
        )}
      </div>

      {/* 分类选择弹窗 */}
      <AnimatePresence>
        {showAlbumPicker && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAlbumPicker(null)}
          >
            <motion.div
              className="max-w-sm w-full rounded-3xl p-6"
              style={{ background: 'var(--card)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>📂 移动到其他视频册</h3>
              <div className="space-y-2">
                <button
                  onClick={() => { moveVideoToAlbum(showAlbumPicker, null); setShowAlbumPicker(null) }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-2 transition-all"
                  style={{ background: 'var(--bg)', color: 'var(--text)' }}
                >
                  📁 未分类
                </button>
                {allAlbums.filter(a => a.id !== album.id).map(a => (
                  <button
                    key={a.id}
                    onClick={() => { moveVideoToAlbum(showAlbumPicker, a.id); setShowAlbumPicker(null) }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-2 transition-all"
                    style={{ background: 'var(--bg)', color: 'var(--text)' }}
                  >
                    <span>{a.emoji}</span> {a.name}
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => {
                    updateVideoAlbum(album.id, { coverVideoId: showAlbumPicker })
                    setShowAlbumPicker(null)
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-2 transition-all"
                  style={{ background: 'var(--c5)', color: 'white' }}
                >
                  📌 设为视频册封面
                </button>
              </div>
              <button onClick={() => setShowAlbumPicker(null)} className="mt-4 w-full py-3 rounded-xl text-sm" style={{ color: 'var(--text-light)' }}>
                取消
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 播放器 */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="max-w-4xl w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
            >
              {selected.url && (
                <video src={selected.url} controls autoPlay className="w-full rounded-2xl" style={{ maxHeight: '80vh' }} />
              )}
              <div className="p-4 flex justify-between items-center mt-4">
                <div>
                  <p className="text-white font-medium">{selected.title}</p>
                  {selected.albumId && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>
                      {data.videoAlbums.find(a => a.id === selected.albumId)?.emoji} {data.videoAlbums.find(a => a.id === selected.albumId)?.name}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { updateVideoAlbum(album.id, { coverVideoId: selected.id }); setSelected(null) }}
                    className="px-4 py-2 rounded-xl text-sm text-yellow-400 bg-white/10"
                  >
                    📌 设为封面
                  </button>
                  <button onClick={() => { removeVideo(selected.id); setSelected(null) }} className="px-4 py-2 rounded-xl text-sm text-red-400 bg-white/10">🗑 删除</button>
                  <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-xl text-sm text-white bg-white/10">关闭</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════
   时间线页
════════════════════════════════════════════════ */
function TimelinePage() {
  const { data, addTimelineItem, updateTimelineItem, removeTimelineItem } = useSettings()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ date: '', title: '', description: '' })

  const handleAdd = () => {
    if (!formData.date || !formData.title) return
    addTimelineItem({
      id: Date.now().toString(),
      date: formData.date,
      title: formData.title,
      description: formData.description,
    })
    setFormData({ date: '', title: '', description: '' })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定删除这条记录吗？')) {
      removeTimelineItem(id)
    }
  }

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs tracking-[0.3em] mb-3 font-medium" style={{ color: 'var(--c3)' }}>TIMELINE</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>时间线</h2>
              <p className="mt-3 text-sm" style={{ color: 'var(--text-light)' }}>我们一起走过的每一步</p>
            </div>
            <motion.button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary px-6 py-3 rounded-2xl text-sm flex items-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <span>+</span> 添加记录
            </motion.button>
          </div>

          {/* 添加表单 */}
          {showForm && (
            <motion.div
              className="glass rounded-3xl p-6 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="space-y-4">
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  placeholder="日期"
                />
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="事件标题"
                />
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="描述..."
                />
                <div className="flex gap-3">
                  <button onClick={handleAdd} className="btn-primary px-6 py-2 rounded-xl text-sm flex-1">
                    保存
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl text-sm" style={{ border: '1px solid var(--border)' }}>
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="relative pl-8">
          {/* 竖线 */}
          <motion.div
            className="absolute left-3 top-2 bottom-2 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(to bottom, var(--c1), var(--c5), var(--c3))' }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <div className="space-y-8">
            {data.timeline.map((item, i) => (
              <motion.div
                key={item.id}
                className="relative group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="absolute -left-8 top-1.5 timeline-dot" />
                <motion.div
                  className="glass rounded-3xl p-6 hover-lift"
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--c1)' }}>{item.date}</p>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>{item.description}</p>
                  {/* 操作按钮 */}
                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        const newTitle = prompt('修改标题', item.title)
                        const newDesc = prompt('修改描述', item.description)
                        if (newTitle !== null) updateTimelineItem(item.id, { title: newTitle })
                        if (newDesc !== null) updateTimelineItem(item.id, { description: newDesc })
                      }}
                      className="px-3 py-1 rounded-lg text-xs"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      ✏️ 编辑
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 rounded-lg text-xs text-red-500"
                      style={{ border: '1px solid #ef4444' }}
                    >
                      🗑 删除
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {data.timeline.length === 0 && (
            <div className="text-center py-20" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
              <div className="text-5xl mb-4">📅</div>
              <p>还没有记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   情书页
════════════════════════════════════════════════ */
function LettersPage() {
  const { data, addLetter, updateLetter, removeLetter } = useSettings()
  const [selected, setSelected] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '' })

  const handleAdd = () => {
    if (!formData.title || !formData.content) return
    addLetter({
      id: Date.now().toString(),
      title: formData.title,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      content: formData.content,
    })
    setFormData({ title: '', content: '' })
    setShowForm(false)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('确定删除这封情书吗？')) {
      removeLetter(id)
      if (selected?.id === id) setSelected(null)
    }
  }

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-end justify-between mb-4">
            <div className="text-center flex-1">
              <p className="text-xs tracking-[0.3em] mb-3 font-medium" style={{ color: 'var(--c6)' }}>LETTERS</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>情书</h2>
              <p className="mt-3 text-sm" style={{ color: 'var(--text-light)' }}>想对你说的每一句话</p>
            </div>
            <motion.button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary px-6 py-3 rounded-2xl text-sm flex items-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <span>+</span> 写情书
            </motion.button>
          </div>

          {/* 添加表单 */}
          {showForm && (
            <motion.div
              className="letter-paper rounded-3xl p-8 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="情书标题"
                />
                <textarea
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="input-field resize-none"
                  rows={6}
                  placeholder="写下你想说的话..."
                />
                <div className="flex gap-3">
                  <button onClick={handleAdd} className="btn-primary px-6 py-2 rounded-xl text-sm flex-1">
                    保存
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-xl text-sm" style={{ border: '1px solid var(--border)' }}>
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="space-y-5">
          {data.letters.map((letter, i) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onClick={() => setSelected(letter)}
              className="letter-paper rounded-3xl p-8 cursor-pointer hover-lift group relative"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>{letter.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-light)' }}>{letter.date}</p>
                </div>
                <span className="text-3xl">💌</span>
              </div>
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-light)' }}>
                {letter.content}
              </p>
              <p className="text-xs mt-4 gradient-text font-medium">点击阅读 →</p>
              {/* 操作按钮 */}
              <div className="absolute top-4 right-16 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const newTitle = prompt('修改标题', letter.title)
                    const newContent = prompt('修改内容', letter.content)
                    if (newTitle !== null) updateLetter(letter.id, { title: newTitle })
                    if (newContent !== null) updateLetter(letter.id, { content: newContent })
                  }}
                  className="px-3 py-1 rounded-lg text-xs"
                  style={{ border: '1px solid var(--border)', background: 'var(--card)' }}
                >
                  ✏️ 编辑
                </button>
                <button
                  onClick={(e) => handleDelete(letter.id, e)}
                  className="px-3 py-1 rounded-lg text-xs text-red-500"
                  style={{ border: '1px solid #ef4444', background: 'var(--card)' }}
                >
                  🗑 删除
                </button>
              </div>
            </motion.div>
          ))}

          {data.letters.length === 0 && (
            <div className="text-center py-20" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
              <div className="text-5xl mb-4">💌</div>
              <p>还没有情书</p>
            </div>
          )}
        </div>
      </div>

      {/* 情书详情 */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="letter-paper max-w-lg w-full rounded-3xl p-10 max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <span className="text-5xl">💕</span>
                <h2 className="text-xl font-bold mt-4 mb-1" style={{ color: 'var(--text)' }}>{selected.title}</h2>
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>{selected.date}</p>
              </div>
              <div className="text-sm leading-8 whitespace-pre-line" style={{ color: 'var(--text-light)' }}>
                {selected.content}
              </div>
              <motion.button
                onClick={() => setSelected(null)}
                className="mt-10 w-full py-4 rounded-2xl text-sm font-semibold text-white btn-primary"
                whileTap={{ scale: 0.97 }}
              >
                关闭
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════
   页脚
════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="text-center py-12 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
      <p className="text-xs tracking-wider" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
        Made with ❤️ · {new Date().getFullYear()}
      </p>
    </footer>
  )
}

/* ════════════════════════════════════════════════
   主应用
════════════════════════════════════════════════ */
function AppContent() {
  const { mode, isLoading: authLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const { isLoading: dataLoading } = useSettings()

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <motion.div
          className="text-6xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💕
        </motion.div>
      </div>
    )
  }

  if (mode === 'none') {
    return <LoginPage />
  }

  const isAuthenticated = mode === 'authenticated'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar current={currentPage} onNavigate={setCurrentPage} isAuthenticated={isAuthenticated} />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {currentPage === 'home' && <HomePage isAuthenticated={isAuthenticated} />}
          {currentPage === 'albums' && <AlbumsPage isAuthenticated={isAuthenticated} />}
          {currentPage === 'gallery' && <GalleryPage isAuthenticated={isAuthenticated} />}
          {currentPage === 'video-albums' && <VideoAlbumsPage isAuthenticated={isAuthenticated} />}
          {currentPage === 'timeline' && <TimelinePage isAuthenticated={isAuthenticated} />}
          {currentPage === 'letters' && <LettersPage isAuthenticated={isAuthenticated} />}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SettingsProvider>
  )
}
