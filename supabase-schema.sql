-- Supabase 数据库表结构 for our-memories app
-- 在 Supabase Dashboard -> SQL Editor 中执行此脚本

-- 相册分类表
CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '📷',
  cover_photo_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 视频相册分类表
CREATE TABLE IF NOT EXISTS video_albums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🎬',
  cover_video_id TEXT,
  sort_order INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 照片表
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  date TEXT,
  caption TEXT,
  album_id TEXT REFERENCES albums(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 视频表
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  date TEXT,
  title TEXT,
  album_id TEXT REFERENCES video_albums(id) ON DELETE SET NULL,
  is_audio BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 时间线表
CREATE TABLE IF NOT EXISTS timeline (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 情书表
CREATE TABLE IF NOT EXISTS letters (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 首页内容表
CREATE TABLE IF NOT EXISTS home_content (
  id TEXT PRIMARY KEY DEFAULT 'home',
  hero_image TEXT,
  hero_emoji TEXT DEFAULT '💕',
  hero_title TEXT DEFAULT '我们的纪念日',
  hero_subtitle TEXT DEFAULT '记录每一个珍贵瞬间',
  hero_tagline TEXT DEFAULT '在一起的每一天，都是我想珍惜的日子',
  hero_image_size INTEGER DEFAULT 160,
  hero_image_offset_x INTEGER DEFAULT 0,
  hero_image_offset_y INTEGER DEFAULT 0,
  hero_image_margin_bottom INTEGER DEFAULT 0,
  stats_label1 TEXT DEFAULT '一起的日子',
  stats_label2 TEXT DEFAULT '张照片',
  stats_label3 TEXT DEFAULT '爱',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认首页内容
INSERT INTO home_content (id) VALUES ('home') ON CONFLICT (id) DO NOTHING;
