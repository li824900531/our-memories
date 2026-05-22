import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings, ThemeKey, Letter, Album, VideoAlbum } from '../context/SettingsContext'

type Tab = 'theme' | 'home' | 'albums' | 'video-albums' | 'photos' | 'videos' | 'timeline' | 'letters' | 'reset'

const themeOptions: { key: ThemeKey; name: string; colors: string[]; label: string }[] = [
  {
    key: 'sunset',
    name: '落日多巴胺',
    label: '珊瑚红 · 杏桃 · 金黄',
    colors: ['#FF6B6B', '#FFA07A', '#FFD93D'],
  },
  {
    key: 'lavender',
    name: '薰衣草梦幻',
    label: '薰衣草紫 · 粉色 · 淡紫',
    colors: ['#C084FC', '#F0ABFC', '#F9A8D4'],
  },
  {
    key: 'ocean',
    name: '海洋清风',
    label: '天空蓝 · 海蓝 · 薄荷绿',
    colors: ['#38BDF8', '#7DD3FC', '#86EFAC'],
  },
  {
    key: 'mint',
    name: '薄荷清新',
    label: '薄荷绿 · 珊瑚粉 · 柠檬黄',
    colors: ['#10B981', '#6EE7B7', '#FCD34D'],
  },
]

const fontOptions = [
  { label: '思源黑体', value: "'Noto Sans SC', sans-serif" },
  { label: '苹方', value: "'PingFang SC', 'Hiragino Sans GB', sans-serif" },
  { label: '楷体', value: "'KaiTi', 'STKaiti', serif" },
  { label: 'Helvetica', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
]

export default function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { data, updateSettings, updateHome, addAlbum, removeAlbum, updateAlbum, reorderAlbums, togglePinAlbum, addVideoAlbum, removeVideoAlbum, updateVideoAlbum, reorderVideoAlbums, togglePinVideoAlbum, addPhoto, removePhoto, addVideo, removeVideo, addTimelineItem, updateTimelineItem, removeTimelineItem, addLetter, updateLetter, removeLetter, resetData } = useSettings()
  const [tab, setTab] = useState<Tab>('theme')

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <motion.div
        className="settings-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* 头部 */}
        <div className="sticky top-0 z-10 glass border-b border-black/5 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>⚙️ 设置中心</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>自定义你的网站</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors text-lg"
            style={{ color: 'var(--text-light)' }}
          >
            ✕
          </button>
        </div>

        {/* 标签页 */}
        <div className="px-4 pt-4 pb-2 flex gap-1 flex-wrap">
          {([
            ['theme', '🎨', '主题'],
            ['home', '🏠', '首页'],
            ['albums', '📚', '相册'],
            ['video-albums', '🎬', '视频册'],
            ['photos', '📷', '照片'],
            ['videos', '📹', '视频'],
            ['timeline', '📅', '时间线'],
            ['letters', '💌', '情书'],
            ['reset', '🔄', '重置'],
          ] as [Tab, string, string][]).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
              style={{
                background: tab === key ? 'var(--gradient)' : 'transparent',
                color: tab === key ? 'white' : 'var(--text-light)',
                opacity: tab === key ? 1 : 0.7,
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* 内容 */}
        <div className="px-6 py-6 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'theme' && <ThemeTab updateSettings={updateSettings} data={data} />}
              {tab === 'home' && <HomeTab updateHome={updateHome} data={data} />}
              {tab === 'albums' && <AlbumsTab albums={data.albums} photos={data.photos} addAlbum={addAlbum} removeAlbum={removeAlbum} updateAlbum={updateAlbum} reorderAlbums={reorderAlbums} togglePinAlbum={togglePinAlbum} />}
              {tab === 'video-albums' && <VideoAlbumsTab albums={data.videoAlbums} videos={data.videos} addVideoAlbum={addVideoAlbum} removeVideoAlbum={removeVideoAlbum} updateVideoAlbum={updateVideoAlbum} reorderVideoAlbums={reorderVideoAlbums} togglePinVideoAlbum={togglePinVideoAlbum} />}
              {tab === 'photos' && <PhotosTab addPhoto={addPhoto} removePhoto={removePhoto} photos={data.photos} albums={data.albums} />}
              {tab === 'videos' && <VideosTab addVideo={addVideo} removeVideo={removeVideo} videos={data.videos} videoAlbums={data.videoAlbums} />}
              {tab === 'timeline' && <TimelineTab data={data} addItem={addTimelineItem} updateItem={updateTimelineItem} removeItem={removeTimelineItem} />}
              {tab === 'letters' && <LettersTab data={data} addLetter={addLetter} updateLetter={updateLetter} removeLetter={removeLetter} />}
              {tab === 'reset' && <ResetTab onReset={resetData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

/* ─── 主题设置 ──────────────────────────── */
function ThemeTab({ updateSettings, data }: {
  updateSettings: (s: any) => void
  data: any
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-1">配色主题</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-light)' }}>选择你喜欢的主色调</p>
        <div className="grid grid-cols-2 gap-3">
          {themeOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => updateSettings({ theme: opt.key })}
              className="rounded-2xl p-4 text-left transition-all"
              style={{
                background: 'var(--card)',
                border: data.settings.theme === opt.key
                  ? '2px solid var(--c1)'
                  : '2px solid transparent',
                boxShadow: 'var(--shadow)',
              }}
            >
              <div className="flex gap-1.5 mb-3">
                {opt.colors.map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{opt.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">字体选择</h3>
        <div className="space-y-2">
          {fontOptions.map(f => (
            <button
              key={f.value}
              onClick={() => updateSettings({ fontBody: f.value })}
              className="w-full text-left px-4 py-3 rounded-xl transition-all"
              style={{
                fontFamily: f.value,
                background: data.settings.fontBody === f.value ? 'var(--c1)' : 'var(--card)',
                color: data.settings.fontBody === f.value ? 'white' : 'var(--text)',
                border: data.settings.fontBody === f.value ? 'none' : '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── 首页设置 ──────────────────────────── */
function HomeTab({ updateHome, data }: { updateHome: (h: any) => void; data: any }) {
  const h = data.home
  const fileRef = useRef<HTMLInputElement>(null)
  const [imgDragging, setImgDragging] = useState(false)

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      updateHome({ heroImage: e.target?.result as string })
    }
    reader.readAsDataURL(file)
  }, [updateHome])

  return (
    <div className="space-y-5">
      {/* 顶部图片上传 */}
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>顶部图片 / GIF</label>
        {h.heroImage ? (
          <div className="relative">
            <img src={h.heroImage} alt="hero" className="w-full h-32 object-contain rounded-2xl" style={{ background: 'var(--card)' }} />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="btn-primary px-4 py-2 rounded-xl text-xs flex-1"
              >
                更换图片
              </button>
              <button
                onClick={() => updateHome({ heroImage: '' })}
                className="px-4 py-2 rounded-xl text-xs text-red-400 hover:bg-red-50 transition-colors"
                style={{ border: '1px solid var(--border)' }}
              >
                删除
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`drop-zone cursor-pointer ${imgDragging ? 'drag-over' : ''}`}
            style={{ borderRadius: 'var(--radius)' }}
            onDragOver={e => { e.preventDefault(); setImgDragging(true) }}
            onDragLeave={() => setImgDragging(false)}
            onDrop={e => { e.preventDefault(); setImgDragging(false); handleImageUpload(e.dataTransfer.files) }}
            onClick={() => fileRef.current?.click()}
          >
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>上传 PNG / GIF</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-light)' }}>支持透明背景 PNG · 动态 GIF</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/gif,image/webp"
          className="hidden"
          onChange={e => handleImageUpload(e.target.files)}
        />
      </div>

      {/* 图片尺寸调节 */}
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>
          图片尺寸：{h.heroImageSize || 160}px
        </label>
        <input
          type="range"
          min="80"
          max="2000"
          step="10"
          value={h.heroImageSize || 160}
          onChange={e => updateHome({ heroImageSize: Number(e.target.value) })}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: 'var(--border)' }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-light)' }}>
          <span>80</span>
          <span>1000</span>
          <span>2000</span>
        </div>
      </div>

      {/* 水平位置调节 */}
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>
          水平偏移：{h.heroImageOffsetX || 0}px
        </label>
        <input
          type="range"
          min="-300"
          max="300"
          step="5"
          value={h.heroImageOffsetX || 0}
          onChange={e => updateHome({ heroImageOffsetX: Number(e.target.value) })}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: 'var(--border)' }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-light)' }}>
          <span>← -300</span>
          <span>居中 0</span>
          <span>300 →</span>
        </div>
      </div>

      {/* 垂直位置调节 */}
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>
          垂直偏移：{h.heroImageOffsetY || 0}px
        </label>
        <input
          type="range"
          min="-200"
          max="200"
          step="5"
          value={h.heroImageOffsetY || 0}
          onChange={e => updateHome({ heroImageOffsetY: Number(e.target.value) })}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: 'var(--border)' }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-light)' }}>
          <span>↑ -200</span>
          <span>居中 0</span>
          <span>200 ↓</span>
        </div>
      </div>

      {/* 图片与标题间距 */}
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>
          与标题间距：{h.heroImageMarginBottom || 0}px
        </label>
        <input
          type="range"
          min="-200"
          max="200"
          step="5"
          value={h.heroImageMarginBottom || 0}
          onChange={e => updateHome({ heroImageMarginBottom: Number(e.target.value) })}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: 'var(--border)' }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-light)' }}>
          <span>-200</span>
          <span>0</span>
          <span>200</span>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>备用 Emoji（无图片时显示）</label>
        <input
          className="input-field text-center text-2xl"
          value={h.heroEmoji}
          onChange={e => updateHome({ heroEmoji: e.target.value })}
          placeholder="💕"
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>主标题</label>
        <input
          className="input-field"
          value={h.heroTitle}
          onChange={e => updateHome({ heroTitle: e.target.value })}
          placeholder="我们的纪念日"
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>副标题</label>
        <input
          className="input-field"
          value={h.heroSubtitle}
          onChange={e => updateHome({ heroSubtitle: e.target.value })}
          placeholder="记录每一个珍贵瞬间"
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>引言</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          value={h.heroTagline}
          onChange={e => updateHome({ heroTagline: e.target.value })}
          placeholder="在一起的每一天..."
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>统计标签1</label>
        <input className="input-field" value={h.statsLabel1} onChange={e => updateHome({ statsLabel1: e.target.value })} />
      </div>
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>统计标签2</label>
        <input className="input-field" value={h.statsLabel2} onChange={e => updateHome({ statsLabel2: e.target.value })} />
      </div>
      <div>
        <label className="text-xs font-medium block mb-2" style={{ color: 'var(--text-light)' }}>统计标签3</label>
        <input className="input-field" value={h.statsLabel3} onChange={e => updateHome({ statsLabel3: e.target.value })} />
      </div>
    </div>
  )
}

/* ─── 照片相册管理 ──────────────────────────── */
function AlbumsTab({ albums, photos, addAlbum, removeAlbum, updateAlbum, reorderAlbums, togglePinAlbum }: {
  albums: Album[]
  photos: any[]
  addAlbum: (a: Album) => void
  removeAlbum: (id: string) => void
  updateAlbum: (id: string, a: Partial<Album>) => void
  reorderAlbums: (albums: Album[]) => void
  togglePinAlbum: (id: string) => void
}) {
  const [newAlbum, setNewAlbum] = useState({ name: '', emoji: '📁' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  // 获取排序后的相册（置顶的在前）
  const sortedAlbums = [...albums].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1
    return a.sortOrder - b.sortOrder
  })

  const handleAdd = () => {
    if (!newAlbum.name.trim()) return
    addAlbum({
      id: Date.now().toString(),
      name: newAlbum.name.trim(),
      emoji: newAlbum.emoji || '📁',
      coverPhotoId: null,
      sortOrder: albums.length,
      isPinned: false,
      isPrivate: false,
      createdAt: new Date().toISOString(),
    })
    setNewAlbum({ name: '', emoji: '📁' })
  }

  // 拖拽排序
  const handleDragStart = (id: string) => setDraggingId(id)
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggingId || draggingId === targetId) return
    const newAlbums = [...sortedAlbums]
    const dragIdx = newAlbums.findIndex(a => a.id === draggingId)
    const targetIdx = newAlbums.findIndex(a => a.id === targetId)
    const [removed] = newAlbums.splice(dragIdx, 1)
    newAlbums.splice(targetIdx, 0, removed)
    // 更新 sortOrder
    const updated = newAlbums.map((a, i) => ({ ...a, sortOrder: i }))
    reorderAlbums(updated)
  }
  const handleDragEnd = () => setDraggingId(null)

  const EMOJI_OPTIONS = ['📁', '🏠', '✈️', '🌸', '🎂', '🎄', '🎬', '📷', '💕', '🌅', '🏖️', '🎠', '🍜', '🎓', '💐', '🌙']

  return (
    <div className="space-y-5">
      {/* 新建分类 */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
        <p className="text-sm font-semibold mb-4">✨ 新建相册</p>
        <div className="flex gap-2 mb-3">
          {EMOJI_OPTIONS.map(e => (
            <button key={e} onClick={() => setNewAlbum(s => ({ ...s, emoji: e }))}
              className="w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all"
              style={{ background: newAlbum.emoji === e ? 'var(--c1)' : 'var(--bg)', color: newAlbum.emoji === e ? 'white' : 'var(--text)' }}>
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="相册名称，如：旅行、约会、生日..."
            value={newAlbum.name}
            onChange={e => setNewAlbum(s => ({ ...s, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="btn-primary px-4 py-2 rounded-xl text-sm">创建</button>
        </div>
      </div>

      {/* 提示文字 */}
      {albums.length > 0 && (
        <p className="text-xs px-1" style={{ color: 'var(--text-light)' }}>
          💡 拖拽卡片可排序 · 点击📌置顶 · 置顶相册会显示在顶部
        </p>
      )}

      {/* 已有相册 */}
      <div className="space-y-3">
        {albums.length === 0 && (
          <div className="text-center py-8" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
            <div className="text-4xl mb-3">📚</div>
            <p className="text-sm">还没有相册，先创建一个吧</p>
          </div>
        )}
        {sortedAlbums.map((album, index) => {
          const coverPhoto = photos.find(p => p.id === album.coverPhotoId)
          const photoCount = photos.filter(p => p.albumId === album.id).length

          return (
            <div
              key={album.id}
              draggable
              onDragStart={() => handleDragStart(album.id)}
              onDragOver={(e) => handleDragOver(e, album.id)}
              onDragEnd={handleDragEnd}
              className={`rounded-2xl overflow-hidden transition-all ${draggingId === album.id ? 'opacity-50 scale-95' : ''}`}
              style={{ background: 'var(--card)', boxShadow: 'var(--shadow)', cursor: 'grab' }}
            >
              {/* 封面区域 */}
              <div className="h-28 relative flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--c1) 0%, var(--c5) 100%)' }}>
                {coverPhoto?.url ? (
                  <img src={coverPhoto.url} alt={album.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : null}
                <div className="relative text-center">
                  <span className="text-5xl">{album.emoji}</span>
                  <p className="text-white font-bold text-lg mt-1 drop-shadow">{album.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">{photoCount}张照片</p>
                </div>
                {/* 置顶标签 */}
                {album.isPinned && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-yellow-400 text-white text-xs font-medium flex items-center gap-1">
                    📌 置顶
                  </div>
                )}
                {/* 操作按钮 */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => togglePinAlbum(album.id)}
                    className={`w-7 h-7 rounded-full text-xs flex items-center justify-center transition-colors ${
                      album.isPinned ? 'bg-yellow-400 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                    title={album.isPinned ? '取消置顶' : '置顶'}
                  >
                    📌
                  </button>
                  <button
                    onClick={() => {
                      const newName = prompt('修改相册名称', album.name)
                      if (newName && newName.trim()) updateAlbum(album.id, { name: newName.trim() })
                    }}
                    className="w-7 h-7 rounded-full bg-black/30 text-white text-xs flex items-center justify-center hover:bg-black/50 transition-colors"
                    title="重命名"
                  >
                    ✏️
                  </button>
                  <button onClick={() => removeAlbum(album.id)} className="w-7 h-7 rounded-full bg-black/30 text-white text-xs flex items-center justify-center hover:bg-black/50 transition-colors" title="删除">🗑</button>
                </div>
              </div>
              {/* 封面选择 */}
              <div className="p-3">
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-light)' }}>📌 设置封面（点击选择）</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {photos.filter(p => p.albumId === album.id && p.url).length === 0 ? (
                    <p className="text-xs" style={{ color: 'var(--text-light)', opacity: 0.5 }}>该相册下还没有照片</p>
                  ) : (
                    photos.filter(p => p.albumId === album.id && p.url).map(p => (
                      <button key={p.id} onClick={() => updateAlbum(album.id, { coverPhotoId: p.id })}
                        className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all"
                        style={{ borderColor: album.coverPhotoId === p.id ? 'var(--c1)' : 'transparent' }}>
                        <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                      </button>
                    ))
                  )}
                </div>
                {/* 快速删除封面 */}
                {album.coverPhotoId && (
                  <button onClick={() => updateAlbum(album.id, { coverPhotoId: null })}
                    className="mt-2 text-xs" style={{ color: 'var(--text-light)' }}>
                    ✕ 清除封面
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── 视频相册管理 ──────────────────────────── */
function VideoAlbumsTab({ albums, videos, addVideoAlbum, removeVideoAlbum, updateVideoAlbum, reorderVideoAlbums, togglePinVideoAlbum }: {
  albums: VideoAlbum[]
  videos: any[]
  addVideoAlbum: (a: VideoAlbum) => void
  removeVideoAlbum: (id: string) => void
  updateVideoAlbum: (id: string, a: Partial<VideoAlbum>) => void
  reorderVideoAlbums: (albums: VideoAlbum[]) => void
  togglePinVideoAlbum: (id: string) => void
}) {
  const [newAlbum, setNewAlbum] = useState({ name: '', emoji: '🎬' })
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const sortedAlbums = [...albums].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1
    return a.sortOrder - b.sortOrder
  })

  const handleAdd = () => {
    if (!newAlbum.name.trim()) return
    addVideoAlbum({
      id: Date.now().toString(),
      name: newAlbum.name.trim(),
      emoji: newAlbum.emoji || '🎬',
      coverVideoId: null,
      sortOrder: albums.length,
      isPinned: false,
      isPrivate: false,
      createdAt: new Date().toISOString(),
    })
    setNewAlbum({ name: '', emoji: '🎬' })
  }

  const handleDragStart = (id: string) => setDraggingId(id)
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggingId || draggingId === targetId) return
    const newAlbums = [...sortedAlbums]
    const dragIdx = newAlbums.findIndex(a => a.id === draggingId)
    const targetIdx = newAlbums.findIndex(a => a.id === targetId)
    const [removed] = newAlbums.splice(dragIdx, 1)
    newAlbums.splice(targetIdx, 0, removed)
    const updated = newAlbums.map((a, i) => ({ ...a, sortOrder: i }))
    reorderVideoAlbums(updated)
  }
  const handleDragEnd = () => setDraggingId(null)

  const EMOJI_OPTIONS = ['🎬', '📹', '🎵', '🎤', '🎥', '🎞️', '🎪', '🎭', '🎨', '💕', '🌅', '✈️', '🏖️', '🎂', '🎄', '🎠']

  return (
    <div className="space-y-5">
      {/* 新建视频相册 */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
        <p className="text-sm font-semibold mb-4">✨ 新建视频相册</p>
        <div className="flex gap-2 mb-3">
          {EMOJI_OPTIONS.map(e => (
            <button key={e} onClick={() => setNewAlbum(s => ({ ...s, emoji: e }))}
              className="w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all"
              style={{ background: newAlbum.emoji === e ? 'var(--c5)' : 'var(--bg)', color: newAlbum.emoji === e ? 'white' : 'var(--text)' }}>
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="视频相册名称，如：旅行记录、甜蜜日常..."
            value={newAlbum.name}
            onChange={e => setNewAlbum(s => ({ ...s, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="btn-primary px-4 py-2 rounded-xl text-sm">创建</button>
        </div>
      </div>

      {/* 提示文字 */}
      {albums.length > 0 && (
        <p className="text-xs px-1" style={{ color: 'var(--text-light)' }}>
          💡 拖拽卡片可排序 · 点击📌置顶 · 置顶相册会显示在顶部
        </p>
      )}

      {/* 已有视频相册 */}
      <div className="space-y-3">
        {albums.length === 0 && (
          <div className="text-center py-8" style={{ color: 'var(--text-light)', opacity: 0.5 }}>
            <div className="text-4xl mb-3">🎬</div>
            <p className="text-sm">还没有视频相册，先创建一个吧</p>
          </div>
        )}
        {sortedAlbums.map((album) => {
          const coverVideo = videos.find(v => v.id === album.coverVideoId)
          const videoCount = videos.filter(v => v.albumId === album.id).length

          return (
            <div
              key={album.id}
              draggable
              onDragStart={() => handleDragStart(album.id)}
              onDragOver={(e) => handleDragOver(e, album.id)}
              onDragEnd={handleDragEnd}
              className={`rounded-2xl overflow-hidden transition-all ${draggingId === album.id ? 'opacity-50 scale-95' : ''}`}
              style={{ background: 'var(--card)', boxShadow: 'var(--shadow)', cursor: 'grab' }}
            >
              {/* 封面区域 */}
              <div className="h-28 relative flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--c5) 0%, var(--c6) 100%)' }}>
                {coverVideo?.url ? (
                  <video src={coverVideo.url} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : null}
                <div className="relative text-center">
                  <span className="text-5xl">{album.emoji}</span>
                  <p className="text-white font-bold text-lg mt-1 drop-shadow">{album.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">{videoCount}个视频</p>
                </div>
                {/* 置顶标签 */}
                {album.isPinned && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-yellow-400 text-white text-xs font-medium flex items-center gap-1">
                    📌 置顶
                  </div>
                )}
                {/* 操作按钮 */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => togglePinVideoAlbum(album.id)}
                    className={`w-7 h-7 rounded-full text-xs flex items-center justify-center transition-colors ${
                      album.isPinned ? 'bg-yellow-400 text-white' : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                    title={album.isPinned ? '取消置顶' : '置顶'}
                  >
                    📌
                  </button>
                  <button
                    onClick={() => {
                      const newName = prompt('修改相册名称', album.name)
                      if (newName && newName.trim()) updateVideoAlbum(album.id, { name: newName.trim() })
                    }}
                    className="w-7 h-7 rounded-full bg-black/30 text-white text-xs flex items-center justify-center hover:bg-black/50 transition-colors"
                    title="重命名"
                  >
                    ✏️
                  </button>
                  <button onClick={() => removeVideoAlbum(album.id)} className="w-7 h-7 rounded-full bg-black/30 text-white text-xs flex items-center justify-center hover:bg-black/50 transition-colors" title="删除">🗑</button>
                </div>
              </div>
              {/* 封面选择 */}
              <div className="p-3">
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-light)' }}>📌 设置封面（点击选择视频）</p>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {videos.filter(v => v.albumId === album.id && v.url && !v.isAudio).length === 0 ? (
                    <p className="text-xs" style={{ color: 'var(--text-light)', opacity: 0.5 }}>该相册下还没有视频</p>
                  ) : (
                    videos.filter(v => v.albumId === album.id && v.url && !v.isAudio).map(v => (
                      <button key={v.id} onClick={() => updateVideoAlbum(album.id, { coverVideoId: v.id })}
                        className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all"
                        style={{ borderColor: album.coverVideoId === v.id ? 'var(--c5)' : 'transparent' }}>
                        <video src={v.url} className="w-full h-full object-cover" />
                      </button>
                    ))
                  )}
                </div>
                {album.coverVideoId && (
                  <button onClick={() => updateVideoAlbum(album.id, { coverVideoId: null })}
                    className="mt-2 text-xs" style={{ color: 'var(--text-light)' }}>
                    ✕ 清除封面
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── 照片管理 ──────────────────────────── */
function PhotosTab({ addPhoto, removePhoto, photos, albums }: { addPhoto: (p: any) => void; removePhoto: (id: string) => void; photos: any[]; albums: Album[] }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

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
          isPrivate: false,
        })
      }
      reader.readAsDataURL(file)
    })
  }, [addPhoto])

  return (
    <div className="space-y-5">
      {/* 拖拽上传区 */}
      <div
        className={`drop-zone ${dragging ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileRef.current?.click()}
      >
        <div className="text-4xl mb-3">📷</div>
        <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>拖拽照片到这里</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>或点击选择文件 · 支持多选</p>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* 照片列表 */}
      <div className="space-y-2">
        <p className="text-xs font-medium" style={{ color: 'var(--text-light)' }}>
          已上传 {photos.length} 张照片
        </p>
        {photos.map(p => (
          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
              {p.url ? <img src={p.url} alt={p.caption} className="w-full h-full object-cover" /> : <span>🖼️</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{p.caption}</p>
              <p className="text-xs" style={{ color: 'var(--text-light)' }}>{p.date}</p>
            </div>
            <button onClick={() => removePhoto(p.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-xs flex-shrink-0 transition-colors">
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── 视频管理 ──────────────────────────── */
function VideosTab({ addVideo, removeVideo, videos, videoAlbums }: { addVideo: (v: any) => void; removeVideo: (id: string) => void; videos: any[]; videoAlbums: VideoAlbum[] }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

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
        albumId: null,
        isPrivate: false,
      })
    })
  }, [addVideo])

  return (
    <div className="space-y-5">
      <div
        className={`drop-zone ${dragging ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileRef.current?.click()}
      >
        <div className="text-4xl mb-3">🎬</div>
        <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>拖拽视频/音频到这里</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>支持 MP4、MOV、MP3 等格式</p>
        <input ref={fileRef} type="file" accept="video/*,audio/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium" style={{ color: 'var(--text-light)' }}>
          已上传 {videos.length} 个文件
        </p>
        {videos.map(v => (
          <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{(v as any).isAudio ? '🎵' : '🎬'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{v.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-light)' }}>{v.date}</p>
            </div>
            <button onClick={() => removeVideo(v.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-xs flex-shrink-0 transition-colors">
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── 时间线管理 ──────────────────────────── */
function TimelineTab({ data, addItem, updateItem, removeItem }: {
  data: any
  addItem: (item: any) => void
  updateItem: (id: string, item: any) => void
  removeItem: (id: string) => void
}) {
  const [newItem, setNewItem] = useState({ date: '', title: '', description: '' })

  const handleAdd = () => {
    if (!newItem.title.trim()) return
    addItem({
      id: Date.now().toString(),
      ...newItem,
      date: newItem.date || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      isPrivate: false,
    })
    setNewItem({ date: '', title: '', description: '' })
  }

  return (
    <div className="space-y-5">
      {/* 添加新条目 */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
        <p className="text-sm font-semibold mb-4">✨ 添加新事件</p>
        <div className="space-y-3">
          <input className="input-field" placeholder="日期 如：2024.06.01" value={newItem.date} onChange={e => setNewItem(s => ({ ...s, date: e.target.value }))} />
          <input className="input-field" placeholder="事件标题" value={newItem.title} onChange={e => setNewItem(s => ({ ...s, title: e.target.value }))} />
          <input className="input-field" placeholder="事件描述" value={newItem.description} onChange={e => setNewItem(s => ({ ...s, description: e.target.value }))} />
          <button onClick={handleAdd} className="btn-primary w-full py-3 rounded-xl text-sm">添加</button>
        </div>
      </div>

      {/* 现有条目 */}
      <div className="space-y-2">
        {data.timeline.map((item: any) => (
          <div key={item.id} className="rounded-xl p-4" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <input
              className="w-full text-sm font-medium mb-1 bg-transparent"
              style={{ color: 'var(--text)' }}
              value={item.title}
              onChange={e => updateItem(item.id, { title: e.target.value })}
            />
            <input
              className="w-full text-xs mb-1 bg-transparent"
              style={{ color: 'var(--c1)' }}
              value={item.date}
              onChange={e => updateItem(item.id, { date: e.target.value })}
            />
            <input
              className="w-full text-xs bg-transparent"
              style={{ color: 'var(--text-light)' }}
              value={item.description}
              onChange={e => updateItem(item.id, { description: e.target.value })}
            />
            <button onClick={() => removeItem(item.id)} className="mt-2 text-xs text-red-400 hover:text-red-500">🗑 删除</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── 情书管理 ──────────────────────────── */
function LettersTab({ data, addLetter, updateLetter, removeLetter }: {
  data: any
  addLetter: (letter: Letter) => void
  updateLetter: (id: string, letter: Partial<Letter>) => void
  removeLetter: (id: string) => void
}) {
  const [newLetter, setNewLetter] = useState({ title: '', date: '', content: '' })

  const handleAdd = () => {
    if (!newLetter.title.trim()) return
    addLetter({
      id: Date.now().toString(),
      ...newLetter,
      date: newLetter.date || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      content: newLetter.content || '（无内容）',
      isPrivate: false,
    })
    setNewLetter({ title: '', date: '', content: '' })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
        <p className="text-sm font-semibold mb-4">✍️ 添加新情书</p>
        <div className="space-y-3">
          <input className="input-field" placeholder="情书标题" value={newLetter.title} onChange={e => setNewLetter(s => ({ ...s, title: e.target.value }))} />
          <input className="input-field" placeholder="日期" value={newLetter.date} onChange={e => setNewLetter(s => ({ ...s, date: e.target.value }))} />
          <textarea className="input-field resize-none" rows={4} placeholder="情书内容" value={newLetter.content} onChange={e => setNewLetter(s => ({ ...s, content: e.target.value }))} />
          <button onClick={handleAdd} className="btn-primary w-full py-3 rounded-xl text-sm">添加</button>
        </div>
      </div>

      <div className="space-y-2">
        {data.letters.map((letter: any) => (
          <div key={letter.id} className="rounded-xl p-4" style={{ background: 'var(--card)', boxShadow: 'var(--shadow)' }}>
            <input
              className="w-full text-sm font-semibold mb-1 bg-transparent"
              style={{ color: 'var(--text)' }}
              value={letter.title}
              onChange={e => updateLetter(letter.id, { title: e.target.value })}
            />
            <input
              className="w-full text-xs mb-2 bg-transparent"
              style={{ color: 'var(--text-light)' }}
              value={letter.date}
              onChange={e => updateLetter(letter.id, { date: e.target.value })}
            />
            <textarea
              className="w-full text-xs bg-transparent resize-none leading-relaxed"
              style={{ color: 'var(--text-light)' }}
              rows={3}
              value={letter.content}
              onChange={e => updateLetter(letter.id, { content: e.target.value })}
            />
            <button onClick={() => removeLetter(letter.id)} className="mt-2 text-xs text-red-400 hover:text-red-500">🗑 删除</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── 重置 ──────────────────────────── */
function ResetTab({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">🔄</div>
      <h3 className="font-semibold mb-2">重置所有数据</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--text-light)' }}>
        这将清除所有照片、视频、情书等内容<br />恢复为默认示例数据
      </p>
      <button
        onClick={onReset}
        className="px-8 py-3 rounded-full text-sm font-medium text-white bg-red-400 hover:bg-red-500 transition-colors"
      >
        确认重置
      </button>
    </div>
  )
}
