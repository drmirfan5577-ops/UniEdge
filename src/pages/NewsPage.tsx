import { useState } from "react";
import { Search, RefreshCw, TrendingUp, Globe } from "lucide-react";
import { NewsCard } from "@/components/features/NewsCard";
import { MOCK_NEWS } from "@/constants/mockData";

const CATEGORIES = ["All", "Technology", "Islamic", "World", "Business", "Health"];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_NEWS.filter((n) => {
    const matchCat = activeCategory === "All" || n.category === activeCategory;
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📰</span>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text-green leading-tight">ES News</h1>
              <p className="text-[10px] text-muted-foreground">Ever Smart News Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full">
              <Globe className="w-3 h-3" />
              <span>Live Feed</span>
            </div>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-neon-green text-black"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto lg:max-w-4xl">
        {/* Trending */}
        {activeCategory === "All" && !searchQuery && (
          <div className="flex items-center gap-2 py-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-semibold">Trending Today</span>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <span className="text-5xl block mb-3">📰</span>
            <p className="text-lg font-medium">No news found</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {activeCategory === "All" && !searchQuery && (
              <NewsCard news={filtered[0]} featured />
            )}

            {/* List */}
            <div className="space-y-2">
              {(activeCategory === "All" && !searchQuery ? filtered.slice(1) : filtered).map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </>
        )}

        {/* ES-Hub Links */}
        {activeCategory === "All" && !searchQuery && (
          <div className="glass-card neon-border-green rounded-2xl p-4 mt-6">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-neon-green" />
              ES-Hub — Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Al Jazeera", icon: "🌍", url: "#" },
                { name: "BBC Arabic", icon: "📡", url: "#" },
                { name: "Reuters", icon: "📰", url: "#" },
                { name: "Islam21c", icon: "🕌", url: "#" },
                { name: "TRT World", icon: "🌐", url: "#" },
                { name: "Siasat Daily", icon: "📱", url: "#" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm"
                >
                  <span>{link.icon}</span>
                  <span className="font-medium text-xs">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
