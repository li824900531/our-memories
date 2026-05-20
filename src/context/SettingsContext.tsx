import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeKey = 'sunset' | 'lavender' | 'ocean' | 'mint'

export interface Album {
  id: string
  name: string
  emoji: string
  coverPhotoId: string | null   // 封面照片 ID
  sortOrder: number            // 排序权重，越小越靠前
  isPinned: boolean            // 是否置顶
  createdAt: string
}

// 视频相册（与照片相册分离）
export interface VideoAlbum {
  id: string
  name: string
  emoji: string
  coverVideoId: string | null  // 封面视频 ID
  sortOrder: number            // 排序权重
  isPinned: boolean            // 是否置顶
  createdAt: string
}

export interface Photo {
  id: string
  url: string
  date: string
  caption: string
  albumId: string | null       // 所属分类，null = "全部"
}

export interface Video {
  id: string
  url: string
  date: string
  title: string
  albumId: string | null       // 所属分类，null = "全部"
  isAudio?: boolean
}

export interface TimelineItem {
  id: string
  date: string
  title: string
  description: string
}

export interface Letter {
  id: string
  title: string
  date: string
  content: string
}

export interface HomeContent {
  heroImage: string
  heroEmoji: string
  heroTitle: string
  heroSubtitle: string
  heroTagline: string
  heroImageSize: number        // 图片尺寸（像素），默认 160
  heroImageOffsetX: number     // 水平偏移（px），默认 0
  heroImageOffsetY: number     // 垂直偏移（px），默认 0
  heroImageMarginBottom: number // 图片与标题间距（px），默认 0
  statsLabel1: string
  statsLabel2: string
  statsLabel3: string
}

export interface AppSettings {
  theme: ThemeKey
  fontBody: string
  fontDisplay: string
  siteName: string
}

export interface AppData {
  settings: AppSettings
  home: HomeContent
  albums: Album[]
  videoAlbums: VideoAlbum[]   // 视频相册（与照片相册分离）
  photos: Photo[]
  videos: Video[]
  timeline: TimelineItem[]
  letters: Letter[]
}

const defaultData: AppData = {
  settings: {
    theme: 'sunset',
    fontBody: "'Noto Sans SC', sans-serif",
    fontDisplay: "'Playfair Display', serif",
    siteName: 'MEMORY',
  },
  home: {
    heroImage: '',
    heroEmoji: '💕',
    heroTitle: '我们的纪念日',
    heroSubtitle: '记录每一个珍贵瞬间',
    heroTagline: '在一起的每一天，都是我想珍惜的日子',
    heroImageSize: 160,
    heroImageOffsetX: 0,
    heroImageOffsetY: 0,
    heroImageMarginBottom: 0,
    statsLabel1: '一起的日子',
    statsLabel2: '张照片',
    statsLabel3: '爱',
  },
  albums: [],
  videoAlbums: [],
  photos: [
    { id: '1', url: '', date: '2024.01.01', caption: '我们的第一天', albumId: null },
    { id: '2', url: '', date: '2024.02.14', caption: '情人节', albumId: null },
    { id: '3', url: '', date: '2024.03.20', caption: '樱花树下', albumId: null },
    { id: '4', url: '', date: '2024.04.05', caption: '第一次旅行', albumId: null },
    { id: '5', url: '', date: '2024.05.20', caption: '520', albumId: null },
    { id: '6', url: '', date: '2024.06.01', caption: '夏天的开始', albumId: null },
  ],
  videos: [
    { id: '1', url: '', date: '2024.01.15', title: '初次相遇', albumId: null },
    { id: '2', url: '', date: '2024.02.20', title: '生日惊喜', albumId: null },
  ],
  timeline: [
    { id: '1', date: '2024.01.01', title: '我们在一起了', description: '新年的第一天，你成为我生命中最重要的人' },
    { id: '2', date: '2024.02.14', title: '第一个情人节', description: '收到你亲手写的卡片，珍贵到舍不得打开' },
    { id: '3', date: '2024.03.20', title: '樱花季', description: '春风十里，不如你' },
    { id: '4', date: '2024.04.05', title: '第一次旅行', description: '一起看世界，说好要走到很远很远' },
    { id: '5', date: '2024.05.20', title: '520', description: '我爱你，永远' },
  ],
  letters: [
    {
      id: '1',
      title: '写给你的第一封信',
      date: '2024.01.15',
      content: `亲爱的，

遇见你的那一天，阳光刚好，你笑得很甜。

从那一刻起，我就知道，你是我等了很久很久的人。

谢谢你愿意走进我的生命，愿意陪我走过每一个春夏秋冬。

我会珍惜和你在一起的每一天，把我们的故事写成一首长长的诗。

永远爱你的我
💕`,
    },
    {
      id: '2',
      title: '关于未来',
      date: '2024.03.20',
      content: `宝贝，

我想过很多次未来是什么样子。

直到遇见你，我才发现，未来不是一个人走的路，是两个人牵着手的方向。

我想和你一起变老，看日出日落，听潮起潮落。

不管生活给我什么，有你在身边，就是最好的答案。

想一直牵着你的手，走到世界的尽头。

爱你的我
🌸`,
    },
  ],
}

interface SettingsContextValue {
  data: AppData
  updateSettings: (s: Partial<AppSettings>) => void
  updateHome: (h: Partial<HomeContent>) => void
  // 照片相册
  addAlbum: (album: Album) => void
  removeAlbum: (id: string) => void
  updateAlbum: (id: string, album: Partial<Album>) => void
  reorderAlbums: (albums: Album[]) => void  // 批量更新排序
  togglePinAlbum: (id: string) => void       // 切换置顶状态
  // 视频相册
  addVideoAlbum: (album: VideoAlbum) => void
  removeVideoAlbum: (id: string) => void
  updateVideoAlbum: (id: string, album: Partial<VideoAlbum>) => void
  reorderVideoAlbums: (albums: VideoAlbum[]) => void
  togglePinVideoAlbum: (id: string) => void
  // 照片
  addPhoto: (photo: Photo) => void
  removePhoto: (id: string) => void
  updatePhoto: (id: string, photo: Partial<Photo>) => void
  movePhotoToAlbum: (photoId: string, albumId: string | null) => void
  // 视频
  moveVideoToAlbum: (videoId: string, albumId: string | null) => void
  addVideo: (video: Video) => void
  removeVideo: (id: string) => void
  // 时间线
  addTimelineItem: (item: TimelineItem) => void
  updateTimelineItem: (id: string, item: Partial<TimelineItem>) => void
  removeTimelineItem: (id: string) => void
  // 情书
  addLetter: (letter: Letter) => void
  updateLetter: (id: string, letter: Partial<Letter>) => void
  removeLetter: (id: string) => void
  resetData: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)
const STORAGE_KEY = 'our-memory-app-data'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // 迁移旧数据（没有 albums 字段）
        if (!parsed.albums) parsed.albums = []
        // 迁移旧相册数据：添加 sortOrder 和 isPinned，移除 coverVideoId
        parsed.albums = parsed.albums.map((a: any, i: number) => ({
          id: a.id,
          name: a.name,
          emoji: a.emoji,
          coverPhotoId: a.coverPhotoId ?? null,
          sortOrder: a.sortOrder ?? i,
          isPinned: a.isPinned ?? false,
          createdAt: a.createdAt ?? new Date().toISOString(),
        }))
        // 迁移视频相册
        if (!parsed.videoAlbums) parsed.videoAlbums = []
        parsed.videoAlbums = parsed.videoAlbums.map((a: any, i: number) => ({
          id: a.id,
          name: a.name,
          emoji: a.emoji,
          coverVideoId: a.coverVideoId ?? null,
          sortOrder: a.sortOrder ?? i,
          isPinned: a.isPinned ?? false,
          createdAt: a.createdAt ?? new Date().toISOString(),
        }))
        // 旧照片没有 albumId
        if (parsed.photos) {
          parsed.photos = parsed.photos.map((p: any) => ({ ...p, albumId: p.albumId ?? null }))
        }
        if (parsed.videos) {
          parsed.videos = parsed.videos.map((v: any) => ({ ...v, albumId: v.albumId ?? null }))
        }
        return { ...defaultData, ...parsed, settings: { ...defaultData.settings, ...parsed.settings } }
      }
    } catch {}
    return defaultData
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {}
  }, [data])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.settings.theme === 'sunset' ? '' : data.settings.theme)
    document.body.style.fontFamily = data.settings.fontBody
  }, [data.settings.theme, data.settings.fontBody, data.settings.fontDisplay])

  const updateSettings = (s: Partial<AppSettings>) =>
    setData(d => ({ ...d, settings: { ...d.settings, ...s } }))

  const updateHome = (h: Partial<HomeContent>) =>
    setData(d => ({ ...d, home: { ...d.home, ...h } }))

  // 照片相册
  const addAlbum = (album: Album) =>
    setData(d => ({
      ...d,
      albums: [...d.albums, { ...album, sortOrder: d.albums.length }],
    }))

  const removeAlbum = (id: string) =>
    setData(d => ({
      ...d,
      albums: d.albums.filter(a => a.id !== id),
      photos: d.photos.map(p => p.albumId === id ? { ...p, albumId: null } : p),
    }))

  const updateAlbum = (id: string, album: Partial<Album>) =>
    setData(d => ({
      ...d,
      albums: d.albums.map(a => (a.id === id ? { ...a, ...album } : a)),
    }))

  // 批量更新相册排序
  const reorderAlbums = (albums: Album[]) =>
    setData(d => ({ ...d, albums }))

  // 切换置顶状态
  const togglePinAlbum = (id: string) =>
    setData(d => ({
      ...d,
      albums: d.albums.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a),
    }))

  // 视频相册
  const addVideoAlbum = (album: VideoAlbum) =>
    setData(d => ({
      ...d,
      videoAlbums: [...d.videoAlbums, { ...album, sortOrder: d.videoAlbums.length }],
    }))

  const removeVideoAlbum = (id: string) =>
    setData(d => ({
      ...d,
      videoAlbums: d.videoAlbums.filter(a => a.id !== id),
      videos: d.videos.map(v => v.albumId === id ? { ...v, albumId: null } : v),
    }))

  const updateVideoAlbum = (id: string, album: Partial<VideoAlbum>) =>
    setData(d => ({
      ...d,
      videoAlbums: d.videoAlbums.map(a => (a.id === id ? { ...a, ...album } : a)),
    }))

  const reorderVideoAlbums = (albums: VideoAlbum[]) =>
    setData(d => ({ ...d, videoAlbums: albums }))

  const togglePinVideoAlbum = (id: string) =>
    setData(d => ({
      ...d,
      videoAlbums: d.videoAlbums.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a),
    }))

  // 照片
  const addPhoto = (photo: Photo) =>
    setData(d => ({ ...d, photos: [photo, ...d.photos] }))

  const removePhoto = (id: string) =>
    setData(d => {
      const newPhotos = d.photos.filter(p => p.id !== id)
      // 如果删除的是某相册封面，清除该封面引用
      const newAlbums = d.albums.map(a => ({
        ...a,
        coverPhotoId: a.coverPhotoId === id ? null : a.coverPhotoId,
      }))
      return { ...d, photos: newPhotos, albums: newAlbums }
    })

  const updatePhoto = (id: string, photo: Partial<Photo>) =>
    setData(d => ({
      ...d,
      photos: d.photos.map(p => (p.id === id ? { ...p, ...photo } : p)),
    }))

  const movePhotoToAlbum = (photoId: string, albumId: string | null) =>
    setData(d => ({
      ...d,
      photos: d.photos.map(p => (p.id === photoId ? { ...p, albumId } : p)),
    }))

  // 视频
  const addVideo = (video: Video) =>
    setData(d => ({ ...d, videos: [video, ...d.videos] }))

  const removeVideo = (id: string) =>
    setData(d => {
      const newVideos = d.videos.filter(v => v.id !== id)
      const newVideoAlbums = d.videoAlbums.map(a => ({
        ...a,
        coverVideoId: a.coverVideoId === id ? null : a.coverVideoId,
      }))
      return { ...d, videos: newVideos, videoAlbums: newVideoAlbums }
    })

  const moveVideoToAlbum = (videoId: string, albumId: string | null) =>
    setData(d => ({
      ...d,
      videos: d.videos.map(v => (v.id === videoId ? { ...v, albumId } : v)),
    }))

  // 时间线
  const addTimelineItem = (item: TimelineItem) =>
    setData(d => ({ ...d, timeline: [...d.timeline, item] }))

  const updateTimelineItem = (id: string, item: Partial<TimelineItem>) =>
    setData(d => ({
      ...d,
      timeline: d.timeline.map(t => (t.id === id ? { ...t, ...item } : t)),
    }))

  const removeTimelineItem = (id: string) =>
    setData(d => ({ ...d, timeline: d.timeline.filter(t => t.id !== id) }))

  // 情书
  const addLetter = (letter: Letter) =>
    setData(d => ({ ...d, letters: [...d.letters, letter] }))

  const updateLetter = (id: string, letter: Partial<Letter>) =>
    setData(d => ({
      ...d,
      letters: d.letters.map(l => (l.id === id ? { ...l, ...letter } : l)),
    }))

  const removeLetter = (id: string) =>
    setData(d => ({ ...d, letters: d.letters.filter(l => l.id !== id) }))

  const resetData = () => {
    if (confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      setData(defaultData)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        data,
        updateSettings,
        updateHome,
        addAlbum,
        removeAlbum,
        updateAlbum,
        reorderAlbums,
        togglePinAlbum,
        addVideoAlbum,
        removeVideoAlbum,
        updateVideoAlbum,
        reorderVideoAlbums,
        togglePinVideoAlbum,
        addPhoto,
        removePhoto,
        updatePhoto,
        movePhotoToAlbum,
        moveVideoToAlbum,
        addVideo,
        removeVideo,
        addTimelineItem,
        updateTimelineItem,
        removeTimelineItem,
        addLetter,
        updateLetter,
        removeLetter,
        resetData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
