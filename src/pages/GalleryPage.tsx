import { useState, useRef, useCallback } from "react";
import { Lock, Grid3X3, List, Image, Video, Music, Search, Plus, Shield, Upload, X, Check, Pause, Play, MoreVertical, Download, Share2, Trash2, Eye, Filter } from "lucide-react";

type GalleryTab = "all" | "images" | "videos" | "audio" | "vault";

interface GalleryItem {
  id: string;
  type: "image" | "video" | "audio";
  thumbnail: string;
  title: string;
  date: string;
  size: string;
}

interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "paused" | "done" | "error";
  thumbnail: string;
}

const GALLERY_ITEMS: GalleryItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `g${i + 1}`,
  type: i % 5 === 0 ? "video" : i % 9 === 0 ? "audio" : "image",
  thumbnail: `https://picsum.photos/seed/${i + 20}/400/400`,
  title: i % 5 === 0 ? `Video Clip ${i + 1}` : i % 9 === 0 ? `Audio ${i + 1}` : `Photo ${i + 1}`,
  date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i % 8]} 2025`,
  size: `${(Math.random() * 10 + 0.5).toFixed(1)} MB`,
}));

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [vaultLocked, setVaultLocked] = useState(true);
  const [vaultPin, setVaultPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const TABS = [
    { id: "all" as GalleryTab, label: "All", emoji: "📁" },
    { id: "images" as GalleryTab, label: "Images", emoji: "🖼️" },
    { id: "videos" as GalleryTab, label: "Videos", emoji: "🎥" },
    { id: "audio" as GalleryTab, label: "Audio", emoji: "🎵" },
    { id: "vault" as GalleryTab, label: "Vault 🔐", emoji: "🔒" },
  ];

  const filtered = GALLERY_ITEMS.filter((item) => {
    const matchTab = activeTab === "all" || item.type === activeTab || activeTab === "vault";
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.date.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const simulateUpload = useCallback((files: File[]) => {
    const newUploads: UploadFile[] = files.map((f) => ({
      id: `up-${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      type: f.type,
      progress: 0,
      status: "uploading",
      thumbnail: f.type.startsWith("image") ? URL.createObjectURL(f) : "",
    }));
    setUploads((prev) => [...prev, ...newUploads]);
    setShowUpload(true);

    newUploads.forEach((up) => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 12 + 3;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setUploads((prev) => prev.map((u) => u.id === up.id ? { ...u, progress: 100, status: "done" } : u));
        } else {
          setUploads((prev) => prev.map((u) => u.id === up.id ? { ...u, progress: Math.round(prog) } : u));
        }
      }, 200);
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) simulateUpload(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) simulateUpload(Array.from(e.dataTransfer.files));
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const pauseUpload = (id: string) => setUploads((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "paused" ? "uploading" : "paused" } : u));
  const cancelUpload = (id: string) => setUploads((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className="min-h-screen" onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
      {/* Drag-over overlay */}
      {dragOver && (
        <div className="fixed inset-0 z-50 bg-neon-cyan/10 border-4 border-dashed border-neon-cyan flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <Upload className="w-16 h-16 text-neon-cyan mx-auto mb-3" />
            <p className="font-bold text-xl gradient-text-cyan">Drop files to upload</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🖼️</span>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text-cyan">Gallery#</h1>
              <p className="text-[10px] text-muted-foreground">{GALLERY_ITEMS.length} items · Chunked Upload</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setSearchQuery(searchQuery ? "" : " ")} className="p-2 rounded-xl hover:bg-muted">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button onClick={() => setView(view === "grid" ? "list" : "grid")} className="p-2 rounded-xl hover:bg-muted">
              {view === "grid" ? <List className="w-5 h-5 text-muted-foreground" /> : <Grid3X3 className="w-5 h-5 text-muted-foreground" />}
            </button>
            <button onClick={() => fileInput.current?.click()} className="p-2 rounded-xl btn-glow-cyan">
              <Plus className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchQuery !== "" && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={searchQuery.trim()}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gallery..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          </div>
        )}

        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? tab.id === "vault" ? "bg-neon-gold text-black" : "btn-glow-cyan text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <input ref={fileInput} type="file" accept="image/*,video/*,audio/*" multiple className="hidden" onChange={handleFileSelect} />

      {/* Upload Panel */}
      {showUpload && uploads.length > 0 && (
        <div className="px-4 pt-3">
          <div className="glass-card neon-border-cyan rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-neon-cyan" />
                <span className="font-semibold text-sm gradient-text-cyan">
                  Uploading {uploads.filter(u => u.status !== "done").length > 0 ? `${uploads.filter(u => u.status !== "done").length} file(s)` : "Complete"}
                </span>
              </div>
              <button onClick={() => setShowUpload(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
              {uploads.map((up) => (
                <div key={up.id} className="flex items-center gap-3">
                  {up.thumbnail ? (
                    <img src={up.thumbnail} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      {up.type.startsWith("video") ? <Video className="w-4 h-4 text-neon-purple" /> : <Music className="w-4 h-4 text-neon-green" />}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium truncate">{up.name}</p>
                      <span className={`text-[10px] font-bold ml-2 flex-shrink-0 ${up.status === "done" ? "text-neon-green" : up.status === "paused" ? "text-neon-gold" : "text-neon-cyan"}`}>
                        {up.status === "done" ? "✓ Done" : up.status === "paused" ? "Paused" : `${up.progress}%`}
                      </span>
                    </div>
                    <div className="relative h-1.5 bg-muted rounded-full">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{ width: `${up.progress}%`, background: up.status === "done" ? "#00FF88" : up.status === "paused" ? "#FFD700" : "linear-gradient(135deg, #00D4FF, #8B5CF6)" }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatSize(up.size)} · 5MB chunks</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {up.status !== "done" && (
                      <button onClick={() => pauseUpload(up.id)} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
                        {up.status === "paused" ? <Play className="w-3 h-3 text-neon-cyan" /> : <Pause className="w-3 h-3 text-muted-foreground" />}
                      </button>
                    )}
                    <button onClick={() => cancelUpload(up.id)} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-red-400/20">
                      {up.status === "done" ? <Check className="w-3 h-3 text-neon-green" /> : <X className="w-3 h-3 text-red-400" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4">
        {/* Vault Tab */}
        {activeTab === "vault" && (
          <div>
            {vaultLocked ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-24 h-24 rounded-2xl bg-neon-gold/20 neon-border-gold flex items-center justify-center mb-5 animate-glow-pulse">
                  <Lock className="w-12 h-12 text-neon-gold" />
                </div>
                <h2 className="font-display font-bold text-xl gradient-text-gold mb-2">Gallery# Vault</h2>
                <p className="text-muted-foreground text-sm mb-2 max-w-xs">
                  AES-256 encrypted personal vault. Protected with biometric authentication.
                </p>
                <div className="flex items-center gap-1.5 text-xs text-neon-green bg-neon-green/10 px-3 py-1.5 rounded-full mb-6">
                  <Shield className="w-3.5 h-3.5" /> AES-256 Encrypted
                </div>
                <div className="w-full max-w-xs space-y-3">
                  {/* PIN display */}
                  <div className="flex justify-center gap-2 mb-1">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${i < vaultPin.length ? "bg-neon-gold shadow-neon-gold scale-110" : "bg-muted"}`} />
                    ))}
                  </div>
                  {/* Numpad */}
                  <div className="glass-card neon-border-gold rounded-2xl p-2">
                    <div className="grid grid-cols-3 gap-1">
                      {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((num, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (num === "⌫") setVaultPin((p) => p.slice(0, -1));
                            else if (typeof num === "number" && vaultPin.length < 6) {
                              const next = vaultPin + num;
                              setVaultPin(next);
                              if (next.length === 6) {
                                if (next === "123456") { setVaultLocked(false); setPinError(false); setVaultPin(""); }
                                else { setPinError(true); setTimeout(() => setVaultPin(""), 500); }
                              }
                            }
                          }}
                          className={`py-4 rounded-xl text-lg font-bold transition-all duration-150 ${
                            num === "" ? "pointer-events-none" : "hover:bg-neon-gold/20 active:scale-95 active:bg-neon-gold/30"
                          } ${num === "⌫" ? "text-neon-gold" : ""}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  {pinError && <p className="text-red-400 text-xs text-center animate-pulse">Incorrect PIN. Demo: 123456</p>}
                  <p className="text-[11px] text-muted-foreground/50 text-center">Fingerprint / FaceID available on supported devices</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-neon-gold" />
                    <span className="font-semibold gradient-text-gold">Vault Unlocked</span>
                    <span className="text-xs text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full">🟢 AES-256</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => fileInput.current?.click()} className="text-xs text-neon-cyan hover:underline flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Add
                    </button>
                    <button onClick={() => setVaultLocked(true)} className="text-xs text-red-400 hover:underline flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Lock
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square cursor-pointer group neon-border-gold">
                      <img src={`https://picsum.photos/seed/${i + 100}/300/300`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-neon-gold/80 rounded-full flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-black" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gallery Grid/List */}
        {activeTab !== "vault" && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground font-medium">{filtered.length} items</p>
                {selectedItems.size > 0 && (
                  <span className="text-xs text-neon-cyan font-semibold bg-neon-cyan/10 px-2 py-0.5 rounded-full">{selectedItems.size} selected</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedItems.size > 0 && (
                  <>
                    <button className="p-1.5 rounded-lg hover:bg-muted"><Share2 className="w-4 h-4 text-neon-cyan" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-muted"><Download className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => setSelectedItems(new Set())} className="p-1.5 rounded-lg hover:bg-red-400/10"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </>
                )}
                <div className="flex gap-1 text-xs text-muted-foreground">
                  <span>{GALLERY_ITEMS.filter((g) => g.type === "image").length} photos</span>
                  <span>·</span>
                  <span>{GALLERY_ITEMS.filter((g) => g.type === "video").length} videos</span>
                </div>
              </div>
            </div>

            {/* Drop zone hint */}
            <div
              className="mb-3 border-2 border-dashed border-border/40 rounded-xl p-4 text-center cursor-pointer hover:border-neon-cyan/40 transition-colors group"
              onClick={() => fileInput.current?.click()}
            >
              <Upload className="w-5 h-5 text-muted-foreground group-hover:text-neon-cyan mx-auto mb-1 transition-colors" />
              <p className="text-xs text-muted-foreground group-hover:text-neon-cyan transition-colors">
                Click or drag & drop to upload · Chunked 5MB · No size limit
              </p>
            </div>

            {view === "grid" ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer group transition-transform duration-150 ${selectedItems.has(item.id) ? "ring-2 ring-neon-cyan scale-[0.97]" : "hover:scale-[1.02]"}`}
                    onClick={() => setLightboxItem(item)}
                    onContextMenu={(e) => { e.preventDefault(); toggleSelect(item.id); }}
                  >
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {item.type === "video" && (
                      <div className="absolute bottom-1.5 left-1.5 bg-black/60 rounded px-1.5 py-0.5 text-white text-[10px] flex items-center gap-1">
                        <Video className="w-2.5 h-2.5" /> 0:{Math.floor(Math.random() * 55 + 5)}
                      </div>
                    )}
                    {selectedItems.has(item.id) && (
                      <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-neon-cyan rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((item) => (
                  <div key={item.id} className="glass-card rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-muted transition-colors">
                    <img src={item.thumbnail} alt={item.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {item.type === "video" ? <Video className="w-3 h-3" /> : item.type === "audio" ? <Music className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                          {item.type}
                        </span>
                        <span>·</span>
                        <span>{item.size}</span>
                        <span>·</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <button className="p-1 rounded-xl hover:bg-muted-foreground/10">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxItem(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxItem.thumbnail} alt={lightboxItem.title} className="w-full rounded-2xl" />
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">{lightboxItem.title}</p>
                <p className="text-xs text-muted-foreground">{lightboxItem.size} · {lightboxItem.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <Download className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
