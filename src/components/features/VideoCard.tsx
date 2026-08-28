import { Play, Eye, Heart, MoreVertical } from "lucide-react";
import type { VideoItem } from "@/types";

interface Props {
  video: VideoItem;
  compact?: boolean;
}

export function VideoCard({ video, compact = false }: Props) {
  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 hover:scale-[1.02] hover:shadow-neon-cyan ${
        compact ? "" : ""
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="video-overlay absolute inset-0" />

        {/* Live badge */}
        {video.isLive && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE
          </div>
        )}

        {/* Duration */}
        {!video.isLive && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full btn-glow-cyan flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Category */}
        <div
          className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.6)", color: "#00D4FF" }}
        >
          {video.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex gap-2">
          <img
            src={video.channelAvatar}
            alt={video.channelName}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
              {video.title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
              <span className="text-neon-cyan font-medium truncate">{video.channelName}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground text-[11px] mt-1">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {video.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {video.likes}
              </span>
              <span>{video.uploadedAt}</span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground flex-shrink-0 p-1">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
