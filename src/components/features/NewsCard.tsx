import { Clock, ExternalLink } from "lucide-react";
import type { NewsItem } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "#00D4FF",
  World: "#8B5CF6",
  Islamic: "#FFD700",
  Business: "#00FF88",
  Health: "#FF006E",
  Education: "#F97316",
};

interface Props {
  news: NewsItem;
  featured?: boolean;
}

export function NewsCard({ news, featured = false }: Props) {
  const color = CATEGORY_COLORS[news.category] || "#94A3B8";

  if (featured) {
    return (
      <div className="glass-card rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.01] transition-all duration-200 neon-border-cyan">
        <div className="relative aspect-video overflow-hidden">
          <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="video-overlay absolute inset-0" />
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-black" style={{ backgroundColor: color }}>
              {news.category}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h2 className="text-white font-display font-bold text-lg leading-snug line-clamp-2 drop-shadow-lg">{news.title}</h2>
          </div>
        </div>
        <div className="p-4">
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{news.summary}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium" style={{ color }}>{news.source}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{news.readTime}</span>
              <span>·</span>
              <span>{news.publishedAt}</span>
            </div>
            <button className="text-muted-foreground hover:text-neon-cyan transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden cursor-pointer group hover:bg-muted transition-all duration-150">
      <div className="flex gap-3 p-3">
        <div className="relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden">
          <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-black" style={{ backgroundColor: color }}>
              {news.category}
            </span>
          </div>
          <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-1">{news.title}</h3>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-medium" style={{ color }}>{news.source}</span>
            <span>·</span>
            <span>{news.publishedAt}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{news.readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
