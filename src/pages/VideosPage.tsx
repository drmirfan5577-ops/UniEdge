import { useState, useRef } from "react";
import { Search, Bell, TrendingUp, Filter, Radio, Plus, Play, Pause, Eye, ThumbsUp, Share2, MoreVertical, Upload, X, Zap, Clock, Users } from "lucide-react";
import { ESMediaPlayer } from "@/components/features/ESMediaPlayer";
import MediaUploader from "@/components/features/MediaUploader";
import { useAuthStore } from "@/stores/authStore";

const CATEGORIES = ["All", "Technology", "Islamic", "Education", "Travel", "Lifestyle", "Gaming", "Music"];

interface VideoItem {
  id: string;
  title: string;
  channel: string;
  channelAvatar: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  uploadedAt: string;
  category: string;
  isLive?: boolean;
  videoUrl?: string;
}

// Real publicly available sample videos for demo
const SAMPLE_VIDEO_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
];

const FEED_VIDEOS: VideoItem[] = [
  { id: "v1", title: "Big Buck Bunny — Animated Short Film (4K Demo)", channel: "UniEdge Studio", channelAvatar: "https://i.pravatar.cc/40?img=1", thumbnail: "https://picsum.photos/seed/video1/640/360", duration: "9:56", views: "12.4M", likes: "385K", uploadedAt: "2 days ago", category: "Technology", videoUrl: SAMPLE_VIDEO_URLS[0] },
  { id: "v2", title: "Elephants Dream — Creative Commons Film", channel: "Creative Commons", channelAvatar: "https://i.pravatar.cc/40?img=2", thumbnail: "https://picsum.photos/seed/video2/640/360", duration: "10:54", views: "8.2M", likes: "241K", uploadedAt: "1 week ago", category: "Education", videoUrl: SAMPLE_VIDEO_URLS[1] },
  { id: "v3", title: "ForBigger Blazes — HD Action Reel", channel: "Action Sports", channelAvatar: "https://i.pravatar.cc/40?img=3", thumbnail: "https://picsum.photos/seed/video3/640/360", duration: "0:15", views: "5.1M", likes: "112K", uploadedAt: "3 days ago", category: "Lifestyle", videoUrl: SAMPLE_VIDEO_URLS[2] },
  { id: "v4", title: "Bigger Escapes — Nature Adventure UHD", channel: "Nature Channel", channelAvatar: "https://i.pravatar.cc/40?img=4", thumbnail: "https://picsum.photos/seed/video4/640/360", duration: "0:15", views: "3.8M", likes: "98K", uploadedAt: "5 days ago", category: "Travel", videoUrl: SAMPLE_VIDEO_URLS[3] },
  { id: "v5", title: "For Bigger Fun — Highlight Reel", channel: "Fun Times", channelAvatar: "https://i.pravatar.cc/40?img=5", thumbnail: "https://picsum.photos/seed/video5/640/360", duration: "0:15", views: "7.6M", likes: "203K", uploadedAt: "1 day ago", category: "Gaming", videoUrl: SAMPLE_VIDEO_URLS[4] },
  { id: "v6", title: "Subaru Outback — Street & Dirt Review", channel: "Auto Review", channelAvatar: "https://i.pravatar.cc/40?img=6", thumbnail: "https://picsum.photos/seed/video6/640/360", duration: "2:56", views: "2.1M", likes: "67K", uploadedAt: "2 weeks ago", category: "Technology", videoUrl: SAMPLE_VIDEO_URLS[5] },
  { id: "v7", title: "Tears of Steel — Open Source VFX Film", channel: "Blender Foundation", channelAvatar: "https://i.pravatar.cc/40?img=7", thumbnail: "https://picsum.photos/seed/video7/640/360", duration: "12:14", views: "15.3M", likes: "512K", uploadedAt: "3 weeks ago", category: "Education", videoUrl: SAMPLE_VIDEO_URLS[6] },
  { id: "v8", title: "Volkswagen GTI Review — Drive Report", channel: "Car World", channelAvatar: "https://i.pravatar.cc/40?img=8", thumbnail: "https://picsum.photos/seed/video8/640/360", duration: "6:58", views: "4.5M", likes: "134K", uploadedAt: "4 days ago", category: "Lifestyle", videoUrl: SAMPLE_VIDEO_URLS[7] },
  { id: "v9", title: "🔴 LIVE — Islamic Lecture & Quran Recitation", channel: "I-Hub Official", channelAvatar: "https://i.pravatar.cc/40?img=12", thumbnail: "https://picsum.photos/seed/live1/640/360", duration: "LIVE", views: "24.5K", likes: "8.1K", uploadedAt: "Now", category: "Islamic", isLive: true, videoUrl: SAMPLE_VIDEO_URLS[0] },
  { id: "v10", title: "🔴 LIVE — Tech Talk: AI & Future Innovations", channel: "Tech Hub", channelAvatar: "https://i.pravatar.cc/40?img=15", thumbnail: "https://picsum.photos/seed/live2/640/360", duration: "LIVE", views: "11.2K", likes: "3.7K", uploadedAt: "Now", category: "Technology", isLive: true, videoUrl: SAMPLE_VIDEO_URLS[1] },
];

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [userVideos, setUserVideos] = useState<VideoItem[]>([]);
  const { currentUser } = useAuthStore();

  const allVideos = [...userVideos, ...FEED_VIDEOS];

  const filtered = allVideos.filter((v) => {
    const matchCat = activeCategory === "All" || v.category === activeCategory;
    const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const liveVideos = allVideos.filter((v) => v.isLive);

  return (
    <div className="min-h-screen">
      {/* Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={(e) => { if (e.target === e.currentTarget) setPlayingVideo(null); }}>
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-4">
            <ESMediaPlayer
              source={{ url: playingVideo.videoUrl ?? SAMPLE_VIDEO_URLS[0], title: playingVideo.title, artist: playingVideo.channel, thumbnail: playingVideo.thumbnail }}
              onClose={() => setPlayingVideo(null)}
              autoPlay={true}
              className="w-full flex-shrink-0"
            />
            <div className="mt-4 flex-1 overflow-y-auto">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base text-white leading-tight mb-1">{playingVideo.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <span>{playingVideo.views} views</span>
                    <span>·</span>
                    <span>{playingVideo.uploadedAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <img src={playingVideo.channelAvatar} alt={playingVideo.channel} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-white">{playingVideo.channel}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" /> {playingVideo.likes}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
              </div>
              {/* Related Videos */}
              <div>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wide mb-2">Up Next</p>
                <div className="space-y-3">
                  {allVideos.filter((v) => v.id !== playingVideo.id).slice(0, 6).map((v) => (
                    <button key={v.id} onClick={() => setPlayingVideo(v)}
                      className="w-full flex items-center gap-3 hover:bg-white/5 rounded-xl p-2 transition-colors text-left">
                      <div className="relative w-24 flex-shrink-0 rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                        <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/80 rounded px-1 text-white text-[9px]">{v.duration}</div>
                        {v.isLive && <div className="absolute top-1 left-1 bg-red-500 rounded px-1 text-white text-[8px] font-bold">LIVE</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white line-clamp-2">{v.title}</p>
                        <p className="text-[10px] text-white/50 mt-0.5">{v.channel}</p>
                        <p className="text-[10px] text-white/40">{v.views} views</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowUploader(false); }}>
          <div className="w-full max-w-lg">
            <MediaUploader
              type="video"
              onClose={() => setShowUploader(false)}
              onUploadComplete={(media) => {
                const newVideo: VideoItem = {
                  id: media.id,
                  title: media.title,
                  channel: currentUser?.name ?? "You",
                  channelAvatar: currentUser?.avatar ?? "https://i.pravatar.cc/40",
                  thumbnail: `https://picsum.photos/seed/${media.id}/640/360`,
                  duration: "0:00",
                  views: "0",
                  likes: "0",
                  uploadedAt: "Just now",
                  category: media.category,
                  videoUrl: media.media_url,
                };
                setUserVideos((prev) => [newVideo, ...prev]);
                setShowUploader(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎥</span>
            <h1 className="font-display font-bold text-xl gradient-text-cyan">Videos</h1>
          </div>
          <div className="flex items-center gap-2">
            {currentUser && <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full" />}
            <button onClick={() => setShowUploader(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full btn-glow-cyan text-black text-xs font-bold">
              <Plus className="w-3.5 h-3.5" /> Upload
            </button>
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full" />
            </button>
          </div>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" placeholder="Search videos, channels..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory===cat ? "btn-glow-cyan text-black" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-6 max-w-4xl mx-auto">

        {/* Live Now */}
        {liveVideos.length>0 && activeCategory==="All" && !searchQuery && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <h2 className="font-display font-semibold text-base text-red-400">Live Now</h2>
              <span className="text-[10px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">{liveVideos.length} streams</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {liveVideos.map((v) => (
                <VideoCard key={v.id} video={v} onPlay={() => setPlayingVideo(v)} />
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        {activeCategory==="All" && !searchQuery && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-neon-cyan" />
                <h2 className="font-display font-semibold text-base">Trending</h2>
              </div>
              <button className="flex items-center gap-1 text-xs text-neon-cyan hover:underline">
                <Filter className="w-3 h-3" /> Filter
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allVideos.filter((v) => !v.isLive).slice(0, 6).map((v) => (
                <VideoCard key={v.id} video={v} onPlay={() => setPlayingVideo(v)} />
              ))}
            </div>
          </section>
        )}

        {/* Filtered */}
        {(activeCategory!=="All" || searchQuery) && (
          <section>
            <p className="text-sm text-muted-foreground mb-3">
              {filtered.length} result{filtered.length!==1?"s":""}
              {activeCategory!=="All" ? ` in ${activeCategory}` : ""}
              {searchQuery ? ` for "${searchQuery}"` : ""}
            </p>
            {filtered.length===0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <span className="text-5xl block mb-3">🎥</span>
                <p className="text-lg font-medium">No videos found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((v) => <VideoCard key={v.id} video={v} onPlay={() => setPlayingVideo(v)} />)}
              </div>
            )}
          </section>
        )}

        {/* For You */}
        {activeCategory==="All" && !searchQuery && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display font-semibold text-base">For You</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{allVideos.filter(v=>!v.isLive).length} videos</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allVideos.filter((v) => !v.isLive).map((v) => (
                <VideoCard key={v.id} video={v} onPlay={() => setPlayingVideo(v)} />
              ))}
            </div>
          </section>
        )}

        {/* Upload CTA */}
        <div className="glass-card neon-border-cyan rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎥</div>
          <h3 className="font-display font-bold text-lg mb-1 gradient-text-cyan">Upload Your Video</h3>
          <p className="text-muted-foreground text-sm mb-1">Chunked 5MB uploads · 720p to UHD+ · All formats supported</p>
          <p className="text-xs text-neon-cyan mb-4">MP4, WebM, MKV, MOV, AVI · No file size limit</p>
          <button onClick={() => setShowUploader(true)}
            className="btn-glow-cyan text-black px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Video
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, onPlay }: { video: VideoItem; onPlay: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-200"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative" style={{ aspectRatio: "16/9" }}>
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="video-overlay absolute inset-0" />
        {video.isLive ? (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        ) : (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        )}
        <button onClick={onPlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-neon-cyan hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </button>
      </div>
      <div className="p-3">
        <div className="flex gap-2">
          <img src={video.channelAvatar} alt={video.channel} className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight line-clamp-2 mb-1">{video.title}</p>
            <p className="text-xs text-muted-foreground">{video.channel}</p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
              <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{video.views}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{video.uploadedAt}</span>
            </div>
          </div>
          <button className="p-1 rounded-xl hover:bg-muted self-start flex-shrink-0">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
