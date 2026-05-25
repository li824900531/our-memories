import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { supabase } from '../supabase'

export type ThemeKey = 'sunset' | 'lavender' | 'ocean' | 'mint'

export interface Album {
  id: string
  name: string
  emoji: string
  coverPhotoId: string | null
  sortOrder: number
  isPinned: boolean
  isPrivate: boolean
  createdAt: string
}

export interface VideoAlbum {
  id: string
  name: string
  emoji: string
  coverVideoId: string | null
  sortOrder: number
  isPinned: boolean
  isPrivate: boolean
  createdAt: string
}

export interface Photo {
  id: string
  url: string
  date: string
  caption: string
  albumId: string | null
  isPrivate: boolean
}

export interface Video {
  id: string
  url: string
  date: string
  title: string
  albumId: string | null
  isAudio?: boolean
  isPrivate: boolean
}

export interface TimelineItem {
  id: string
  date: string
  title: string
  description: string
  isPrivate: boolean
  mediaUrl?: string
  mediaType?: 'image' | 'video'
}

export interface Letter {
  id: string
  title: string
  date: string
  content: string
  isPrivate: boolean
}

export interface HomeContent {
  heroImage: string
  heroEmoji: string
  heroTitle: string
  heroSubtitle: string
  heroTagline: string
  heroImageSize: number
  heroImageOffsetX: number
  heroImageOffsetY: number
  heroImageMarginBottom: number
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
  videoAlbums: VideoAlbum[]
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
  photos: [],
  videos: [],
  timeline: [],
  letters: [],
}

interface SettingsContextValue {
  data: AppData
  isLoading: boolean
  updateSettings: (s: Partial<AppSettings>) => void
  updateHome: (h: Partial<HomeContent>) => void
  addAlbum: (album: Album) => void
  removeAlbum: (id: string) => void
  updateAlbum: (id: string, album: Partial<Album>) => void
  reorderAlbums: (albums: Album[]) => void
  togglePinAlbum: (id: string) => void
  addVideoAlbum: (album: VideoAlbum) => void
  removeVideoAlbum: (id: string) => void
  updateVideoAlbum: (id: string, album: Partial<VideoAlbum>) => void
  reorderVideoAlbums: (albums: VideoAlbum[]) => void
  togglePinVideoAlbum: (id: string) => void
  togglePrivateAlbum: (id: string) => void
  togglePrivateVideoAlbum: (id: string) => void
  togglePrivatePhoto: (id: string) => void
  togglePrivateVideo: (id: string) => void
  togglePrivateTimelineItem: (id: string) => void
  togglePrivateLetter: (id: string) => void
  addPhoto: (photo: Photo) => void
  removePhoto: (id: string) => void
  updatePhoto: (id: string, photo: Partial<Photo>) => void
  movePhotoToAlbum: (photoId: string, albumId: string | null) => void
  moveVideoToAlbum: (videoId: string, albumId: string | null) => void
  addVideo: (video: Video) => void
  removeVideo: (id: string) => void
  addTimelineItem: (item: TimelineItem) => void
  updateTimelineItem: (id: string, item: Partial<TimelineItem>) => void
  removeTimelineItem: (id: string) => void
  addLetter: (letter: Letter) => void
  updateLetter: (id: string, letter: Partial<Letter>) => void
  removeLetter: (id: string) => void
  resetData: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)
const STORAGE_KEY = 'our-memory-app-data'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(defaultData)
  const [isLoading, setIsLoading] = useState(true)
  const isSupabaseConnected = useRef(false)

  // 加载数据：优先 Supabase，失败则回退 localStorage
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        const [albumsRes, videoAlbumsRes, photosRes, videosRes, timelineRes, lettersRes, homeRes] = await Promise.all([
          supabase.from('albums').select('*').order('sort_order'),
          supabase.from('video_albums').select('*').order('sort_order'),
          supabase.from('photos').select('*').order('created_at', { ascending: false }),
          supabase.from('videos').select('*').order('created_at', { ascending: false }),
          supabase.from('timeline').select('*').order('date', { ascending: false }),
          supabase.from('letters').select('*').order('created_at', { ascending: false }),
          supabase.from('home_content').select('*').eq('id', 'home').single(),
        ])

        if (albumsRes.error || videoAlbumsRes.error || photosRes.error || videosRes.error || timelineRes.error || lettersRes.error || homeRes.error) {
          throw new Error('Supabase query failed')
        }

        const loadedData: AppData = {
          ...defaultData,
          albums: (albumsRes.data || []).map(a => ({
            id: a.id,
            name: a.name,
            emoji: a.emoji,
            coverPhotoId: a.cover_photo_id,
            sortOrder: a.sort_order,
            isPinned: a.is_pinned,
            isPrivate: a.is_private ?? false,
            createdAt: a.created_at,
          })),
          videoAlbums: (videoAlbumsRes.data || []).map(a => ({
            id: a.id,
            name: a.name,
            emoji: a.emoji,
            coverVideoId: a.cover_video_id,
            sortOrder: a.sort_order,
            isPinned: a.is_pinned,
            isPrivate: a.is_private ?? false,
            createdAt: a.created_at,
          })),
          photos: (photosRes.data || []).map(p => ({
            id: p.id,
            url: p.url,
            date: p.date,
            caption: p.caption,
            albumId: p.album_id,
            isPrivate: p.is_private ?? false,
          })),
          videos: (videosRes.data || []).map(v => ({
            id: v.id,
            url: v.url,
            date: v.date,
            title: v.title,
            albumId: v.album_id,
            isAudio: v.is_audio,
            isPrivate: v.is_private ?? false,
          })),
          timeline: (timelineRes.data || []).map(t => ({
            id: t.id,
            date: t.date,
            title: t.title,
            description: t.description,
            isPrivate: t.is_private ?? false,
            mediaUrl: t.media_url || undefined,
            mediaType: t.media_type || undefined,
          })),
          letters: (lettersRes.data || []).map(l => ({
            id: l.id,
            title: l.title,
            date: l.date,
            content: l.content,
            isPrivate: l.is_private ?? false,
          })),
        }

        if (homeRes.data) {
          const h = homeRes.data
          loadedData.home = {
            heroImage: h.hero_image || '',
            heroEmoji: h.hero_emoji || '💕',
            heroTitle: h.hero_title || '我们的纪念日',
            heroSubtitle: h.hero_subtitle || '记录每一个珍贵瞬间',
            heroTagline: h.hero_tagline || '在一起的每一天，都是我想珍惜的日子',
            heroImageSize: h.hero_image_size || 160,
            heroImageOffsetX: h.hero_image_offset_x || 0,
            heroImageOffsetY: h.hero_image_offset_y || 0,
            heroImageMarginBottom: h.hero_image_margin_bottom || 0,
            statsLabel1: h.stats_label1 || '一起的日子',
            statsLabel2: h.stats_label2 || '张照片',
            statsLabel3: h.stats_label3 || '爱',
          }
        }

        isSupabaseConnected.current = true
        setData(loadedData)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedData))
      } catch {
        // Supabase 失败，回退 localStorage
        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            const parsed = JSON.parse(stored)
            setData({ ...defaultData, ...parsed, settings: { ...defaultData.settings, ...parsed.settings } })
          } else {
            setData(defaultData)
          }
        } catch {
          setData(defaultData)
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadFromSupabase()
  }, [])

  // 写入 Supabase（通用 upsert）
  const supabaseUpsert = async (table: string, row: Record<string, unknown>) => {
    if (!isSupabaseConnected.current) return
    try {
      await supabase.from(table).upsert(row, { onConflict: 'id' })
    } catch {}
  }

  // 写入 Supabase（删除）
  const supabaseDelete = async (table: string, id: string) => {
    if (!isSupabaseConnected.current) return
    try {
      await supabase.from(table).delete().eq('id', id)
    } catch {}
  }

  // 保存到 localStorage
  useEffect(() => {
    if (!isLoading) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
    }
  }, [data, isLoading])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.settings.theme === 'sunset' ? '' : data.settings.theme)
    document.body.style.fontFamily = data.settings.fontBody
  }, [data.settings.theme, data.settings.fontBody, data.settings.fontDisplay])

  const updateSettings = (s: Partial<AppSettings>) =>
    setData(d => ({ ...d, settings: { ...d.settings, ...s } }))

  const updateHome = (h: Partial<HomeContent>) => {
    setData(d => ({ ...d, home: { ...d.home, ...h } }))
    const updated = { ...data.home, ...h }
    supabaseUpsert('home_content', {
      id: 'home',
      hero_image: updated.heroImage,
      hero_emoji: updated.heroEmoji,
      hero_title: updated.heroTitle,
      hero_subtitle: updated.heroSubtitle,
      hero_tagline: updated.heroTagline,
      hero_image_size: updated.heroImageSize,
      hero_image_offset_x: updated.heroImageOffsetX,
      hero_image_offset_y: updated.heroImageOffsetY,
      hero_image_margin_bottom: updated.heroImageMarginBottom,
      stats_label1: updated.statsLabel1,
      stats_label2: updated.statsLabel2,
      stats_label3: updated.statsLabel3,
      updated_at: new Date().toISOString(),
    })
  }

  // 相册
  const addAlbum = (album: Album) => {
    setData(d => ({ ...d, albums: [...d.albums, { ...album, sortOrder: d.albums.length }] }))
    supabaseUpsert('albums', { id: album.id, name: album.name, emoji: album.emoji, cover_photo_id: album.coverPhotoId, sort_order: album.sortOrder, is_pinned: album.isPinned, is_private: album.isPrivate, created_at: album.createdAt })
  }

  const removeAlbum = (id: string) => {
    setData(d => ({ ...d, albums: d.albums.filter(a => a.id !== id), photos: d.photos.map(p => p.albumId === id ? { ...p, albumId: null } : p) }))
    supabaseDelete('albums', id)
  }

  const updateAlbum = (id: string, album: Partial<Album>) => {
    setData(d => ({ ...d, albums: d.albums.map(a => (a.id === id ? { ...a, ...album } : a)) }))
    const current = data.albums.find(a => a.id === id)
    if (current) supabaseUpsert('albums', { id, name: current.name, emoji: current.emoji, cover_photo_id: current.coverPhotoId, sort_order: current.sortOrder, is_pinned: current.isPinned, created_at: current.createdAt })
  }

  const reorderAlbums = (albums: Album[]) => {
    setData(d => ({ ...d, albums }))
    albums.forEach((a, i) => supabaseUpsert('albums', { ...a, sort_order: i }))
  }

  const togglePinAlbum = (id: string) => {
    setData(d => ({ ...d, albums: d.albums.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a) }))
    const current = data.albums.find(a => a.id === id)
    if (current) supabaseUpsert('albums', { ...current, is_pinned: !current.isPinned })
  }

  // 视频相册
  const addVideoAlbum = (album: VideoAlbum) => {
    setData(d => ({ ...d, videoAlbums: [...d.videoAlbums, { ...album, sortOrder: d.videoAlbums.length }] }))
    supabaseUpsert('video_albums', { id: album.id, name: album.name, emoji: album.emoji, cover_video_id: album.coverVideoId, sort_order: album.sortOrder, is_pinned: album.isPinned, created_at: album.createdAt })
  }

  const removeVideoAlbum = (id: string) => {
    setData(d => ({ ...d, videoAlbums: d.videoAlbums.filter(a => a.id !== id), videos: d.videos.map(v => v.albumId === id ? { ...v, albumId: null } : v) }))
    supabaseDelete('video_albums', id)
  }

  const updateVideoAlbum = (id: string, album: Partial<VideoAlbum>) => {
    setData(d => ({ ...d, videoAlbums: d.videoAlbums.map(a => (a.id === id ? { ...a, ...album } : a)) }))
    const current = data.videoAlbums.find(a => a.id === id)
    if (current) supabaseUpsert('video_albums', { ...current, id })
  }

  const reorderVideoAlbums = (albums: VideoAlbum[]) => {
    setData(d => ({ ...d, videoAlbums: albums }))
    albums.forEach((a, i) => supabaseUpsert('video_albums', { ...a, sort_order: i }))
  }

  const togglePinVideoAlbum = (id: string) => {
    setData(d => ({ ...d, videoAlbums: d.videoAlbums.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a) }))
    const current = data.videoAlbums.find(a => a.id === id)
    if (current) supabaseUpsert('video_albums', { ...current, is_pinned: !current.isPinned })
  }

  // 私有切换
  const togglePrivateAlbum = (id: string) => {
    setData(d => ({ ...d, albums: d.albums.map(a => a.id === id ? { ...a, isPrivate: !a.isPrivate } : a) }))
    const current = data.albums.find(a => a.id === id)
    if (current) supabaseUpsert('albums', { ...current, is_private: !current.isPrivate })
  }

  const togglePrivateVideoAlbum = (id: string) => {
    setData(d => ({ ...d, videoAlbums: d.videoAlbums.map(a => a.id === id ? { ...a, isPrivate: !a.isPrivate } : a) }))
    const current = data.videoAlbums.find(a => a.id === id)
    if (current) supabaseUpsert('video_albums', { ...current, is_private: !current.isPrivate })
  }

  const togglePrivatePhoto = (id: string) => {
    setData(d => ({ ...d, photos: d.photos.map(p => p.id === id ? { ...p, isPrivate: !p.isPrivate } : p) }))
    const current = data.photos.find(p => p.id === id)
    if (current) supabaseUpsert('photos', { ...current, is_private: !current.isPrivate })
  }

  const togglePrivateVideo = (id: string) => {
    setData(d => ({ ...d, videos: d.videos.map(v => v.id === id ? { ...v, isPrivate: !v.isPrivate } : v) }))
    const current = data.videos.find(v => v.id === id)
    if (current) supabaseUpsert('videos', { ...current, is_private: !current.isPrivate })
  }

  const togglePrivateTimelineItem = (id: string) => {
    setData(d => ({ ...d, timeline: d.timeline.map(t => t.id === id ? { ...t, isPrivate: !t.isPrivate } : t) }))
    const current = data.timeline.find(t => t.id === id)
    if (current) supabaseUpsert('timeline', { ...current, is_private: !current.isPrivate })
  }

  const togglePrivateLetter = (id: string) => {
    setData(d => ({ ...d, letters: d.letters.map(l => l.id === id ? { ...l, isPrivate: !l.isPrivate } : l) }))
    const current = data.letters.find(l => l.id === id)
    if (current) supabaseUpsert('letters', { ...current, is_private: !current.isPrivate })
  }

  // 照片
  const addPhoto = (photo: Photo) => {
    setData(d => ({ ...d, photos: [photo, ...d.photos] }))
    supabaseUpsert('photos', { id: photo.id, url: photo.url, date: photo.date, caption: photo.caption, album_id: photo.albumId })
  }

  const removePhoto = (id: string) => {
    setData(d => {
      const newPhotos = d.photos.filter(p => p.id !== id)
      const newAlbums = d.albums.map(a => ({ ...a, coverPhotoId: a.coverPhotoId === id ? null : a.coverPhotoId }))
      return { ...d, photos: newPhotos, albums: newAlbums }
    })
    supabaseDelete('photos', id)
  }

  const updatePhoto = (id: string, photo: Partial<Photo>) => {
    setData(d => ({ ...d, photos: d.photos.map(p => (p.id === id ? { ...p, ...photo } : p)) }))
    const current = data.photos.find(p => p.id === id)
    if (current) supabaseUpsert('photos', { id, url: current.url, date: current.date, caption: current.caption, album_id: current.albumId })
  }

  const movePhotoToAlbum = (photoId: string, albumId: string | null) => {
    setData(d => ({ ...d, photos: d.photos.map(p => (p.id === photoId ? { ...p, albumId } : p)) }))
    const current = data.photos.find(p => p.id === photoId)
    if (current) supabaseUpsert('photos', { id: photoId, url: current.url, date: current.date, caption: current.caption, album_id: albumId })
  }

  // 视频
  const addVideo = (video: Video) => {
    setData(d => ({ ...d, videos: [video, ...d.videos] }))
    supabaseUpsert('videos', { id: video.id, url: video.url, date: video.date, title: video.title, album_id: video.albumId, is_audio: video.isAudio })
  }

  const removeVideo = (id: string) => {
    setData(d => {
      const newVideos = d.videos.filter(v => v.id !== id)
      const newVideoAlbums = d.videoAlbums.map(a => ({ ...a, coverVideoId: a.coverVideoId === id ? null : a.coverVideoId }))
      return { ...d, videos: newVideos, videoAlbums: newVideoAlbums }
    })
    supabaseDelete('videos', id)
  }

  const moveVideoToAlbum = (videoId: string, albumId: string | null) => {
    setData(d => ({ ...d, videos: d.videos.map(v => (v.id === videoId ? { ...v, albumId } : v)) }))
    const current = data.videos.find(v => v.id === videoId)
    if (current) supabaseUpsert('videos', { id: videoId, url: current.url, date: current.date, title: current.title, album_id: albumId, is_audio: current.isAudio })
  }

  // 时间线
  const addTimelineItem = (item: TimelineItem) => {
    setData(d => ({ ...d, timeline: [...d.timeline, item] }))
    supabaseUpsert('timeline', {
      id: item.id,
      date: item.date,
      title: item.title,
      description: item.description,
      media_url: item.mediaUrl || null,
      media_type: item.mediaType || null,
    })
  }

  const updateTimelineItem = (id: string, item: Partial<TimelineItem>) => {
    setData(d => ({ ...d, timeline: d.timeline.map(t => (t.id === id ? { ...t, ...item } : t)) }))
    const current = data.timeline.find(t => t.id === id)
    if (current) supabaseUpsert('timeline', {
      id,
      date: current.date,
      title: current.title,
      description: current.description,
      media_url: current.mediaUrl || null,
      media_type: current.mediaType || null,
    })
  }

  const removeTimelineItem = (id: string) => {
    setData(d => ({ ...d, timeline: d.timeline.filter(t => t.id !== id) }))
    supabaseDelete('timeline', id)
  }

  // 情书
  const addLetter = (letter: Letter) => {
    setData(d => ({ ...d, letters: [...d.letters, letter] }))
    supabaseUpsert('letters', { id: letter.id, title: letter.title, date: letter.date, content: letter.content })
  }

  const updateLetter = (id: string, letter: Partial<Letter>) => {
    setData(d => ({ ...d, letters: d.letters.map(l => (l.id === id ? { ...l, ...letter } : l)) }))
    const current = data.letters.find(l => l.id === id)
    if (current) supabaseUpsert('letters', { id, title: current.title, date: current.date, content: current.content })
  }

  const removeLetter = (id: string) => {
    setData(d => ({ ...d, letters: d.letters.filter(l => l.id !== id) }))
    supabaseDelete('letters', id)
  }

  const resetData = () => {
    if (confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      setData(defaultData)
      // 清空 Supabase
      if (isSupabaseConnected.current) {
        supabase.from('albums').delete().neq('id', '').then(() => {})
        supabase.from('video_albums').delete().neq('id', '').then(() => {})
        supabase.from('photos').delete().neq('id', '').then(() => {})
        supabase.from('videos').delete().neq('id', '').then(() => {})
        supabase.from('timeline').delete().neq('id', '').then(() => {})
        supabase.from('letters').delete().neq('id', '').then(() => {})
      }
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        data,
        isLoading,
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
        togglePrivateAlbum,
        togglePrivateVideoAlbum,
        togglePrivatePhoto,
        togglePrivateVideo,
        togglePrivateTimelineItem,
        togglePrivateLetter,
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
