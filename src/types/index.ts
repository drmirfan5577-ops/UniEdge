export type Theme = "super-bright" | "light" | "ultra-light" | "dark";
export type LayoutMode = "auto" | "mobile" | "desktop";
export type TabId = "videos" | "shorts" | "news" | "social" | "islamic" | "settings";

export interface NavTab {
  id: TabId;
  label: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  subName?: string;
  title?: string;
  avatar: string;
  phone?: string;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "video" | "voice" | "doc";
  status: "sent" | "delivered" | "read";
  timestamp: string;
  replyTo?: string;
  reactions?: { emoji: string; userId: string }[];
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isGroup: boolean;
  groupName?: string;
  groupIcon?: string;
}

export interface StatusUpdate {
  id: string;
  user: User;
  mediaUrl?: string;
  type: "image" | "video" | "text";
  text?: string;
  bgColor?: string;
  viewCount: number;
  expiresAt: string;
  timestamp: string;
}

export interface VideoItem {
  id: string;
  title: string;
  channelName: string;
  channelAvatar: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadedAt: string;
  likes: string;
  isLive?: boolean;
  category: string;
}

export interface ShortItem {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  thumbnail: string;
  likes: string;
  comments: string;
  shares: string;
  duration: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  thumbnail: string;
  summary: string;
  category: string;
  publishedAt: string;
  readTime: string;
  url: string;
}

export interface QuranSurah {
  id: number;
  name: string;
  arabicName: string;
  verses: number;
  revelation: "Makkah" | "Madinah";
  meaning: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  location: string;
}

export interface AdminConfig {
  enabledTabs: TabId[];
  tabOrder: TabId[];
  appName: string;
  tagline: string;
  version: string;
  maintenanceMode: boolean;
  customTabs: { id: string; label: string; icon: string; url: string }[];
}
