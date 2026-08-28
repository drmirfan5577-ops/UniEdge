import { Heart, MessageCircle, Share2, Play } from "lucide-react";
import type { ShortItem } from "@/types";

interface Props {
  short: ShortItem;
  isActive: boolean;
  onClick: () => void;
}

export function ShortCard({ short, isActive, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${
        isActive ? "ring-2 ring-neon-cyan shadow-neon-cyan scale-[1.02]" : "hover:scale-[1.01]"
      }`}
      style={{ aspectRatio: "9/16", height: "100%" }}
    >
      {/* Background */}
      <img
        src={short.thumbnail}
        alt={short.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

      {/* Play button center */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-neon-cyan/20 backdrop-blur-sm border border-neon-cyan/50 rounded-full px-2 py-1">
          <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
          <span className="text-neon-cyan text-[10px] font-bold">PLAYING</span>
        </div>
      )}

      {/* Creator info */}
      <div className="absolute bottom-0 left-0 right-12 p-3">
        <div className="flex items-center gap-2 mb-2">
          <img src={short.creatorAvatar} alt={short.creator} className="w-7 h-7 rounded-full border border-white/30" />
          <span className="text-white text-xs font-semibold">@{short.creator}</span>
        </div>
        <p className="text-white text-xs font-medium line-clamp-2 leading-tight">{short.title}</p>
        <span className="text-white/60 text-[10px] mt-1 block">{short.duration}</span>
      </div>

      {/* Action buttons */}
      <div className="absolute right-2 bottom-16 flex flex-col gap-3 items-center">
        <ActionBtn icon={<Heart className="w-5 h-5" />} count={short.likes} color="#FF006E" />
        <ActionBtn icon={<MessageCircle className="w-5 h-5" />} count={short.comments} color="#00D4FF" />
        <ActionBtn icon={<Share2 className="w-5 h-5" />} count={short.shares} color="#00FF88" />
      </div>
    </div>
  );
}

function ActionBtn({ icon, count, color }: { icon: React.ReactNode; count: string; color: string }) {
  return (
    <button className="flex flex-col items-center gap-1 group">
      <div
        className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
        style={{ color }}
      >
        {icon}
      </div>
      <span className="text-white text-[10px] font-medium">{count}</span>
    </button>
  );
}
