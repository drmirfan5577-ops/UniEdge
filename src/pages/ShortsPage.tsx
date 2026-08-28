import { useState } from "react";
import { Plus, TrendingUp, Heart, MessageCircle, Share2, Bookmark, Music, Play, Pause, Upload, X, Eye, ThumbsUp } from "lucide-react";
import { ESMediaPlayer } from "@/components/features/ESMediaPlayer";
import MediaUploader from "@/components/features/MediaUploader";
import { useAuthStore } from "@/stores/authStore";

interface ShortItem {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  thumbnail: string;
  videoUrl?: string;
  likes: string;
  comments: string;
  shares: string;
  views: string;
  duration: string;
  music?: string;
  category: string;
}

const SHORT_VIDEO_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
];

const DEMO_SHORTS: ShortItem[] = [
  { id: "s1", title: "🔥 Epic Action Short — ForBigger Blazes Demo", creator: "ActionCreator", creatorAvatar: "https://i.pravatar.cc/40?img=1", thumbnail: "https://picsum.photos/seed/short1/400/720", videoUrl: SHORT_VIDEO_URLS[0], likes: "284K", comments: "12.4K", shares: "45K", views: "2.4M", duration: "0:15", music: "Epic Cinematic Beat", category: "Action" },
  { id: "s2", title: "🌍 Nature Escape — Breathtaking Aerial View", creator: "NatureFilms", creatorAvatar: "https://i.pravatar.cc/40?img=2", thumbnail: "https://picsum.photos/seed/short2/400/720", videoUrl: SHORT_VIDEO_URLS[1], likes: "156K", comments: "8.1K", shares: "23K", views: "1.8M", duration: "0:15", music: "Calm Oud Melody", category: "Travel" },
  { id: "s3", title: "⚡ Fun Reel — Daily Dose of Joy", creator: "FunnyClips", creatorAvatar: "https://i.pravatar.cc/40?img=3", thumbnail: "https://picsum.photos/seed/short3/400/720", videoUrl: SHORT_VIDEO_URLS[2], likes: "412K", comments: "19.2K", shares: "87K", views: "5.1M", duration: "0:15", music: "Happy Pop Beat", category: "Comedy" },
  { id: "s4", title: "🚗 Joyride Highlights — Speed & Style", creator: "AutoVibes", creatorAvatar: "https://i.pravatar.cc/40?img=4", thumbnail: "https://picsum.photos/seed/short4/400/720", videoUrl: SHORT_VIDEO_URLS[3], likes: "98K", comments: "4.5K", shares: "15K", views: "987K", duration: "0:15", music: "Electronic Flow", category: "Lifestyle" },
  { id: "s5", title: "💥 Meltdown Moment — Raw Power Demo", creator: "TechVibes", creatorAvatar: "https://i.pravatar.cc/40?img=5", thumbnail: "https://picsum.photos/seed/short5/400/720", videoUrl: SHORT_VIDEO_URLS[4], likes: "223K", comments: "9.8K", shares: "34K", views: "3.2M", duration: "0:15", music: "Bass Drop", category: "Technology" },
];

export default function ShortsPage() {
  const [playingShort, setPlayingShort] = useState<ShortItem | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [userShorts, setUserShorts] = useState<ShortItem[]>([]);
  const [likedShorts, setLikedShorts] = useState<Set<string>>(new Set());
  const [savedShorts, setSavedShorts] = useState<Set<string>>(new Set());
  const { currentUser } = useAuthStore();

  const allShorts = [...userShorts, ...DEMO_SHORTS];

  const toggleLike = (id: string) => {
    setLikedShorts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string) => {
    setSavedShorts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Full-screen player */}
      {playingShort && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative">
            <ESMediaPlayer
              source={{ url: playingShort.videoUrl ?? SHORT_VIDEO_URLS[0], title: playingShort.title, artist: playingShort.creator, thumbnail: playingShort.thumbnail, type: "video" }}
              onClose={() => setPlayingShort(null)}
              autoPlay={true}
              className="w-full h-screen"
            />

            {/* Overlay info */}
            <div className="absolute inset-x-0 bottom-0 px-4 py-6 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }}>
              <div className="flex items-end gap-3">
                <div className="flex-1 min-w-0 pointer-events-none">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={playingShort.creatorAvatar} alt={playingShort.creator} className="w-8 h-8 rounded-full border-2 border-white" />
                    <span className="text-white font-bold text-sm">{playingShort.creator}</span>
                    <button className="px-2.5 py-0.5 rounded-full border border-white text-white text-[10px] font-bold pointer-events-auto">
                      Follow
                    </button>
                  </div>
                  <p className="text-white text-sm font-medium mb-1 line-clamp-2">{playingShort.title}</p>
                  {playingShort.music && (
                    <div className="flex items-center gap-1.5 text-white/70 text-[11px]">
                      <Music className="w-3 h-3 animate-spin-slow" />
                      <span>{playingShort.music}</span>
                    </div>
                  )}
                </div>
                {/* Side actions */}
                <div className="flex flex-col gap-4 items-center pointer-events-auto">
                  <button onClick={() => toggleLike(playingShort.id)} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${likedShorts.has(playingShort.id) ? "bg-neon-pink text-white" : "bg-white/20 text-white"}`}>
                      <Heart className={`w-5 h-5 ${likedShorts.has(playingShort.id) ? "fill-white" : ""}`} />
                    </div>
                    <span className="text-white text-[10px] font-semibold">{playingShort.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-white text-[10px] font-semibold">{playingShort.comments}</span>
                  </button>
                  <button onClick={() => toggleSave(playingShort.id)} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${savedShorts.has(playingShort.id) ? "bg-neon-gold text-black" : "bg-white/20 text-white"}`}>
                      <Bookmark className={`w-5 h-5 ${savedShorts.has(playingShort.id) ? "fill-current" : ""}`} />
                    </div>
                    <span className="text-white text-[10px] font-semibold">Save</span>
                  </button>
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-white text-[10px] font-semibold">{playingShort.shares}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
              {allShorts.map((s, i) => (
                <button key={s.id} onClick={() => setPlayingShort(s)}
                  className={`w-2 rounded-full transition-all ${s.id === playingShort.id ? "bg-white h-6" : "bg-white/40 h-2 hover:bg-white/70"}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowUploader(false); }}>
          <div className="w-full max-w-lg">
            <MediaUploader
              type="short"
              onClose={() => setShowUploader(false)}
              onUploadComplete={(media) => {
                const newShort: ShortItem = {
                  id: media.id,
                  title: media.title,
                  creator: currentUser?.name ?? "You",
                  creatorAvatar: currentUser?.avatar ?? "https://i.pravatar.cc/40",
                  thumbnail: `https://picsum.photos/seed/${media.id}/400/720`,
                  videoUrl: media.media_url,
                  likes: "0",
                  comments: "0",
                  shares: "0",
                  views: "0",
                  duration: "0:00",
                  category: media.category,
                };
                setUserShorts((prev) => [newShort, ...prev]);
                setShowUploader(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h1 className="font-display font-bold text-xl gradient-text-cyan">Shorts</h1>
            <div className="flex items-center gap-1 text-xs text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /><span>Trending</span>
            </div>
          </div>
          <button onClick={() => setShowUploader(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full btn-glow-purple text-white text-xs font-semibold">
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {/* Featured Grid */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Tap to Play</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allShorts.map((s) => (
              <div key={s.id} className="relative rounded-2xl overflow-hidden cursor-pointer group"
                style={{ aspectRatio: "9/16" }}
                onClick={() => setPlayingShort(s)}>
                <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 40%, transparent 70%)" }} />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold line-clamp-2 mb-2">{s.title}</p>
                  <div className="flex items-center gap-2">
                    <img src={s.creatorAvatar} alt={s.creator} className="w-5 h-5 rounded-full border border-white/40 flex-shrink-0" />
                    <span className="text-white/80 text-[10px] truncate">{s.creator}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-white/70 text-[10px] flex items-center gap-0.5">
                      <Heart className="w-2.5 h-2.5" />{s.likes}
                    </span>
                    <span className="text-white/70 text-[10px] flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" />{s.views}
                    </span>
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute top-2 right-2 bg-black/70 rounded px-1.5 py-0.5 text-white text-[9px] font-mono">
                  {s.duration}
                </div>
                {s.music && (
                  <div className="absolute top-2 left-2">
                    <Music className="w-3 h-3 text-white/70 animate-spin-slow" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload CTA */}
        <div className="glass-card neon-border-purple rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-display font-bold text-lg mb-1 gradient-text-cyan">Create Your Short</h3>
          <p className="text-muted-foreground text-sm mb-1">Upload up to UHD+ quality. Reach millions of viewers.</p>
          <p className="text-xs text-neon-purple mb-4">9:16 portrait · Up to 60 seconds · All formats</p>
          <button onClick={() => setShowUploader(true)}
            className="btn-glow-purple text-white px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Short
          </button>
        </div>
      </div>
    </div>
  );
}
