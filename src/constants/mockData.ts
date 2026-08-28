import type { User, Chat, StatusUpdate, VideoItem, ShortItem, NewsItem, QuranSurah, PrayerTimes } from "@/types";

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Ahmed Hassan", subName: "Tech Enthusiast", avatar: "https://i.pravatar.cc/150?img=11", isVerified: true, isOnline: true },
  { id: "u2", name: "Sara Al-Rashid", subName: "Designer", avatar: "https://i.pravatar.cc/150?img=20", isVerified: true, isOnline: false, lastSeen: "2 min ago" },
  { id: "u3", name: "Muhammad Yusuf", subName: "Developer", avatar: "https://i.pravatar.cc/150?img=33", isVerified: false, isOnline: true },
  { id: "u4", name: "Fatima Malik", subName: "Student", avatar: "https://i.pravatar.cc/150?img=25", isVerified: true, isOnline: false, lastSeen: "1 hr ago" },
  { id: "u5", name: "Omar Khalid", subName: "Content Creator", avatar: "https://i.pravatar.cc/150?img=56", isVerified: true, isOnline: true },
  { id: "u6", name: "Aisha Rehman", subName: "Entrepreneur", avatar: "https://i.pravatar.cc/150?img=45", isVerified: false, isOnline: true },
  { id: "me", name: "You", avatar: "https://i.pravatar.cc/150?img=1", isVerified: true, isOnline: true },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: "c1", isGroup: false, isPinned: true, isMuted: false, unreadCount: 3,
    participants: [MOCK_USERS[0]],
    lastMessage: { id: "m1", senderId: "u1", content: "Assalamu Alaikum! How are you?", type: "text", status: "delivered", timestamp: "10:34 AM" },
  },
  {
    id: "c2", isGroup: false, isPinned: false, isMuted: false, unreadCount: 0,
    participants: [MOCK_USERS[1]],
    lastMessage: { id: "m2", senderId: "me", content: "The design looks amazing 🔥", type: "text", status: "read", timestamp: "9:12 AM" },
  },
  {
    id: "c3", isGroup: true, groupName: "UniEdge Dev Team 🚀", groupIcon: "https://i.pravatar.cc/150?img=3", isPinned: true, isMuted: false, unreadCount: 12,
    participants: [MOCK_USERS[2], MOCK_USERS[4]],
    lastMessage: { id: "m3", senderId: "u3", content: "New feature pushed to main! ✅", type: "text", status: "delivered", timestamp: "Yesterday" },
  },
  {
    id: "c4", isGroup: false, isPinned: false, isMuted: true, unreadCount: 0,
    participants: [MOCK_USERS[3]],
    lastMessage: { id: "m4", senderId: "u4", content: "🎙 Voice message (0:32)", type: "voice", status: "read", timestamp: "Tuesday" },
  },
  {
    id: "c5", isGroup: false, isPinned: false, isMuted: false, unreadCount: 7,
    participants: [MOCK_USERS[4]],
    lastMessage: { id: "m5", senderId: "u5", content: "Check out my latest video!", type: "text", status: "sent", timestamp: "Monday" },
  },
  {
    id: "c6", isGroup: true, groupName: "Islamic Circle 🕌", groupIcon: "https://i.pravatar.cc/150?img=7", isPinned: false, isMuted: false, unreadCount: 4,
    participants: [MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[3]],
    lastMessage: { id: "m6", senderId: "u2", content: "Jazakallahu Khairan for sharing!", type: "text", status: "delivered", timestamp: "Sunday" },
  },
];

export const MOCK_STATUSES: StatusUpdate[] = [
  { id: "s1", user: MOCK_USERS[0], type: "image", mediaUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", viewCount: 42, expiresAt: "", timestamp: "2h ago" },
  { id: "s2", user: MOCK_USERS[1], type: "text", text: "AlhamdulilAllah for everything! 🌟", bgColor: "linear-gradient(135deg, #8B5CF6, #00D4FF)", viewCount: 28, expiresAt: "", timestamp: "5h ago" },
  { id: "s3", user: MOCK_USERS[2], type: "image", mediaUrl: "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=400", viewCount: 63, expiresAt: "", timestamp: "8h ago" },
  { id: "s4", user: MOCK_USERS[4], type: "image", mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400", viewCount: 91, expiresAt: "", timestamp: "12h ago" },
  { id: "s5", user: MOCK_USERS[5], type: "text", text: "New journey begins today! 🚀", bgColor: "linear-gradient(135deg, #00FF88, #00D4FF)", viewCount: 17, expiresAt: "", timestamp: "20h ago" },
];

export const MOCK_VIDEOS: VideoItem[] = [
  { id: "v1", title: "The Future of AI in 2025 — Everything You Need to Know", channelName: "TechVision", channelAvatar: "https://i.pravatar.cc/40?img=10", thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600", duration: "18:42", views: "2.4M", uploadedAt: "3 days ago", likes: "89K", category: "Technology" },
  { id: "v2", title: "Beautiful Quran Recitation — Surah Al-Mulk | Sheikh Mishary", channelName: "Quran Channel", channelAvatar: "https://i.pravatar.cc/40?img=15", thumbnail: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600", duration: "12:17", views: "5.1M", uploadedAt: "1 week ago", likes: "210K", category: "Islamic" },
  { id: "v3", title: "Build a Full-Stack App in 1 Hour — React + Supabase Tutorial", channelName: "CodeCraft", channelAvatar: "https://i.pravatar.cc/40?img=22", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600", duration: "58:03", views: "447K", uploadedAt: "2 days ago", likes: "22K", category: "Education" },
  { id: "v4", title: "Top 10 Destinations in the Muslim World — Travel Vlog 2025", channelName: "Halal Travel", channelAvatar: "https://i.pravatar.cc/40?img=30", thumbnail: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600", duration: "24:55", views: "1.2M", uploadedAt: "5 days ago", likes: "54K", category: "Travel" },
  { id: "v5", title: "UniEdge Platform — Official Launch Announcement 🚀", channelName: "UniEdge Official", channelAvatar: "https://i.pravatar.cc/40?img=5", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600", duration: "8:21", views: "890K", uploadedAt: "1 day ago", likes: "67K", category: "Technology", isLive: false },
  { id: "v6", title: "Digital Nomad Life in Dubai — Day in My Life", channelName: "OmarCreates", channelAvatar: "https://i.pravatar.cc/40?img=56", thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600", duration: "31:44", views: "678K", uploadedAt: "4 days ago", likes: "31K", category: "Lifestyle" },
  { id: "v7", title: "🔴 LIVE — Friday Khutbah from Masjid Al-Haram", channelName: "Haram Live", channelAvatar: "https://i.pravatar.cc/40?img=18", thumbnail: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=600", duration: "LIVE", views: "34.5K watching", uploadedAt: "Live now", likes: "12K", category: "Islamic", isLive: true },
  { id: "v8", title: "Python Automation Scripts That Save Hours Every Day", channelName: "PythonPro", channelAvatar: "https://i.pravatar.cc/40?img=42", thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600", duration: "22:09", views: "331K", uploadedAt: "6 days ago", likes: "18K", category: "Education" },
];

export const MOCK_SHORTS: ShortItem[] = [
  { id: "sh1", title: "Amazing sunset in Istanbul 🌅", creator: "TravelMuhammad", creatorAvatar: "https://i.pravatar.cc/40?img=33", thumbnail: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=700", likes: "124K", comments: "1.2K", shares: "8.9K", duration: "0:28" },
  { id: "sh2", title: "Quick Tajweed tip for Fatiha recitation ✨", creator: "QuranTeacher", creatorAvatar: "https://i.pravatar.cc/40?img=15", thumbnail: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&h=700", likes: "89K", comments: "3.4K", shares: "21K", duration: "0:45" },
  { id: "sh3", title: "Coding a React app in 60 seconds ⚡", creator: "DevAhmed", creatorAvatar: "https://i.pravatar.cc/40?img=22", thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=700", likes: "56K", comments: "780", shares: "4.2K", duration: "1:00" },
  { id: "sh4", title: "Dubai skyline at night 🌃 4K", creator: "OmarCreates", creatorAvatar: "https://i.pravatar.cc/40?img=56", thumbnail: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=400&h=700", likes: "211K", comments: "5.6K", shares: "34K", duration: "0:33" },
  { id: "sh5", title: "Morning Azkar — Start your day right 🤲", creator: "IslamicReminders", creatorAvatar: "https://i.pravatar.cc/40?img=18", thumbnail: "https://images.unsplash.com/photo-1565017228497-4b4b4b4e5e5e?w=400&h=700", likes: "178K", comments: "9.1K", shares: "55K", duration: "0:52" },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: "n1", title: "UniEdge Launches New AI-Powered Features for Global Communities", source: "TechToday", thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600", summary: "UniEdge platform announces groundbreaking AI features that will transform how global communities connect and share content online.", category: "Technology", publishedAt: "2 hours ago", readTime: "3 min read", url: "#" },
  { id: "n2", title: "OIC Summit: Muslim Nations Agree on Digital Cooperation Framework", source: "World News", thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600", summary: "Leaders from 57 Muslim-majority countries signed a landmark digital cooperation agreement at the latest OIC summit in Riyadh.", category: "World", publishedAt: "4 hours ago", readTime: "5 min read", url: "#" },
  { id: "n3", title: "New Research Shows Benefits of Morning Adhkar on Mental Health", source: "Islamic Science", thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600", summary: "Groundbreaking research from the Islamic University reveals significant mental health improvements in individuals who regularly practice morning Adhkar.", category: "Islamic", publishedAt: "6 hours ago", readTime: "4 min read", url: "#" },
  { id: "n4", title: "Dubai Becomes World's #1 Digital Economy Hub in 2025 Rankings", source: "Business Daily", thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600", summary: "Dubai has topped global rankings as the world's leading digital economy hub, surpassing Singapore and London for the first time.", category: "Business", publishedAt: "8 hours ago", readTime: "3 min read", url: "#" },
  { id: "n5", title: "Open Source Quran Project Reaches 1 Billion Downloads Milestone", source: "Dev Weekly", thumbnail: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600", summary: "The Tanzil open-source Quran project celebrates reaching 1 billion total downloads across all its distributions and APIs.", category: "Islamic", publishedAt: "Yesterday", readTime: "2 min read", url: "#" },
  { id: "n6", title: "Scientists Discover How Ramadan Fasting Activates Cellular Repair", source: "Medical Times", thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600", summary: "A landmark study confirms that Ramadan-style intermittent fasting triggers autophagy — the body's cellular self-cleaning mechanism.", category: "Health", publishedAt: "Yesterday", readTime: "6 min read", url: "#" },
];

export const MOCK_SURAHS: QuranSurah[] = [
  { id: 1, name: "Al-Fatiha", arabicName: "الفاتحة", verses: 7, revelation: "Makkah", meaning: "The Opening" },
  { id: 2, name: "Al-Baqarah", arabicName: "البقرة", verses: 286, revelation: "Madinah", meaning: "The Cow" },
  { id: 3, name: "Ali Imran", arabicName: "آل عمران", verses: 200, revelation: "Madinah", meaning: "Family of Imran" },
  { id: 4, name: "An-Nisa", arabicName: "النساء", verses: 176, revelation: "Madinah", meaning: "The Women" },
  { id: 5, name: "Al-Maidah", arabicName: "المائدة", verses: 120, revelation: "Madinah", meaning: "The Table Spread" },
  { id: 6, name: "Al-Anam", arabicName: "الأنعام", verses: 165, revelation: "Makkah", meaning: "The Cattle" },
  { id: 7, name: "Al-Araf", arabicName: "الأعراف", verses: 206, revelation: "Makkah", meaning: "The Heights" },
  { id: 36, name: "Ya-Sin", arabicName: "يس", verses: 83, revelation: "Makkah", meaning: "Ya-Sin" },
  { id: 55, name: "Ar-Rahman", arabicName: "الرحمن", verses: 78, revelation: "Madinah", meaning: "The Beneficent" },
  { id: 56, name: "Al-Waqi'ah", arabicName: "الواقعة", verses: 96, revelation: "Makkah", meaning: "The Event" },
  { id: 67, name: "Al-Mulk", arabicName: "الملك", verses: 30, revelation: "Makkah", meaning: "The Sovereignty" },
  { id: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", verses: 4, revelation: "Makkah", meaning: "The Sincerity" },
  { id: 113, name: "Al-Falaq", arabicName: "الفلق", verses: 5, revelation: "Makkah", meaning: "The Daybreak" },
  { id: 114, name: "An-Nas", arabicName: "الناس", verses: 6, revelation: "Makkah", meaning: "The Mankind" },
];

export const MOCK_PRAYER_TIMES: PrayerTimes = {
  fajr: "05:14",
  sunrise: "06:38",
  dhuhr: "12:45",
  asr: "16:18",
  maghrib: "19:02",
  isha: "20:22",
  date: "Friday, 22 Aug 2025",
  location: "Islamabad, Pakistan",
};

export const MORNING_AZKAR = [
  { id: 1, arabic: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ", transliteration: "A'udhu billahis-sami'il-'alimi minash-shaytanir-rajim", translation: "I seek refuge in Allah, the All-Hearing, All-Knowing, from the accursed devil.", count: 3, virtue: "Protection from Shaytan throughout the day" },
  { id: 2, arabic: "بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ", transliteration: "Bismillahir-rahmanir-rahim", translation: "In the name of Allah, the Most Gracious, the Most Merciful.", count: 1, virtue: "Barakah (blessing) in all affairs" },
  { id: 3, arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaikan-nushur", translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and unto You is the resurrection.", count: 1, virtue: "Remembrance of Allah at the start of the day" },
  { id: 4, arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ", transliteration: "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk", translation: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant.", count: 1, virtue: "Best supplication for seeking forgiveness (Sayyidul Istighfar)" },
];
