import { useState, useRef } from "react";
import { ArrowLeft, Upload, Film, Music, Type, Sliders, Scissors, Merge, Download, Play, Pause, SkipBack, SkipForward, Volume2, Zap, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

type StudioTab = "edit" | "audio" | "text" | "filters" | "export";

const FILTERS = [
  { id: "none", name: "Original", preview: "bg-gradient-to-br from-gray-800 to-gray-900" },
  { id: "vivid", name: "Vivid", preview: "bg-gradient-to-br from-cyan-600 to-purple-700" },
  { id: "warm", name: "Warm", preview: "bg-gradient-to-br from-orange-500 to-red-600" },
  { id: "cool", name: "Cool", preview: "bg-gradient-to-br from-blue-500 to-indigo-700" },
  { id: "mono", name: "Mono", preview: "bg-gradient-to-br from-gray-600 to-gray-800" },
  { id: "golden", name: "Golden", preview: "bg-gradient-to-br from-yellow-500 to-amber-600" },
  { id: "neon", name: "Neon", preview: "bg-gradient-to-br from-green-400 to-cyan-500" },
  { id: "vintage", name: "Vintage", preview: "bg-gradient-to-br from-amber-700 to-orange-900" },
];

const TRANSITIONS = ["Cut", "Fade", "Slide", "Zoom", "Wipe", "Dissolve", "Flash", "Spin"];
const TEXT_STYLES = ["Title", "Subtitle", "Caption", "Neon Glow", "Shadow Bold", "Outline", "Sticker"];

export default function ESStudioPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StudioTab>("edit");
  const [hasMedia, setHasMedia] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(34);
  const [trimStart, setTrimStart] = useState(10);
  const [trimEnd, setTrimEnd] = useState(80);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [selectedTransition, setSelectedTransition] = useState("Fade");
  const [textOverlay, setTextOverlay] = useState("");
  const [textStyle, setTextStyle] = useState("Title");
  const [volume, setVolume] = useState(80);
  const [resolution, setResolution] = useState("1080p");
  const [bgMusic, setBgMusic] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImport = () => fileInput.current?.click();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setHasMedia(true);
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => { setPublishing(false); setPublished(true); }, 2500);
  };

  const TABS: { id: StudioTab; label: string; icon: React.ReactNode }[] = [
    { id: "edit", label: "Edit", icon: <Scissors className="w-4 h-4" /> },
    { id: "audio", label: "Audio", icon: <Music className="w-4 h-4" /> },
    { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
    { id: "filters", label: "Filters", icon: <Sliders className="w-4 h-4" /> },
    { id: "export", label: "Export", icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors text-neon-cyan">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg gradient-text-cyan">ES Studio</h1>
              <p className="text-[10px] text-muted-foreground">Ever Smart Creator Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleImport} className="px-3 py-1.5 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-neon-cyan" /> Import
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || published}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                published ? "bg-neon-green/20 text-neon-green border border-neon-green/30" :
                "btn-glow-cyan text-black"
              }`}
            >
              {published ? "✓ Published" : publishing ? "Publishing..." : <><Zap className="w-4 h-4" /> Publish</>}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mt-3 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === t.id ? "btn-glow-cyan text-black" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <input ref={fileInput} type="file" accept="video/*,image/*,audio/*" className="hidden" onChange={handleFileSelect} />

      <div className="flex-1 px-4 py-4 max-w-3xl mx-auto w-full space-y-4">
        {/* Preview Canvas */}
        <div className="relative glass-card neon-border-cyan rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {hasMedia ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 relative">
              <Film className="w-16 h-16 text-muted-foreground/30 absolute" />
              {textOverlay && (
                <div className={`absolute bottom-6 left-0 right-0 text-center px-6 ${
                  textStyle === "Neon Glow" ? "text-neon-cyan drop-shadow-[0_0_12px_#00D4FF]" :
                  textStyle === "Title" ? "text-white font-black text-2xl drop-shadow-lg" :
                  "text-white font-semibold text-lg"
                }`}>
                  {textOverlay}
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{
                  filter:
                    selectedFilter === "vivid" ? "saturate(1.8) contrast(1.1)" :
                    selectedFilter === "warm" ? "sepia(0.4) saturate(1.3)" :
                    selectedFilter === "cool" ? "hue-rotate(20deg) saturate(1.2)" :
                    selectedFilter === "mono" ? "grayscale(1)" :
                    selectedFilter === "golden" ? "sepia(0.6) saturate(1.4)" :
                    selectedFilter === "neon" ? "saturate(2) brightness(1.1)" :
                    selectedFilter === "vintage" ? "sepia(0.7) contrast(0.9)" : "none"
                }}
              />
              {/* Play overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white fill-white ml-1" />}
                </div>
              </button>
            </div>
          ) : (
            <button onClick={handleImport} className="w-full h-full flex flex-col items-center justify-center gap-3 group">
              <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 neon-border-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                <Film className="w-8 h-8 text-neon-cyan" />
              </div>
              <div className="text-center">
                <p className="font-bold text-base gradient-text-cyan">Import Media</p>
                <p className="text-muted-foreground text-xs mt-1">MP4, WebM, MKV, MOV, AVI</p>
                <p className="text-muted-foreground text-xs">720p · 1080p · 4K · UHD+</p>
              </div>
            </button>
          )}
        </div>

        {/* Player Controls */}
        {hasMedia && (
          <div className="glass-card rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-3 justify-center">
              <button className="text-muted-foreground hover:text-foreground transition-colors"><SkipBack className="w-5 h-5" /></button>
              <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full btn-glow-cyan flex items-center justify-center">
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors"><SkipForward className="w-5 h-5" /></button>
              <div className="flex items-center gap-1.5 ml-4">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-20 h-1 accent-cyan-400" />
              </div>
              <span className="text-xs text-muted-foreground ml-auto">0:34 / 2:14</span>
            </div>
            {/* Progress */}
            <div className="relative h-3 bg-muted rounded-full cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
            }}>
              <div className="h-full rounded-full gradient-bg-primary" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-neon-cyan border-2 border-neon-cyan" style={{ left: `calc(${progress}% - 8px)` }} />
            </div>
          </div>
        )}

        {/* EDIT TAB */}
        {activeTab === "edit" && hasMedia && (
          <div className="space-y-4">
            {/* Timeline Trimmer */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-neon-cyan" /> Trim & Cut
              </h3>
              <div className="relative h-12 bg-muted rounded-xl overflow-hidden mb-2">
                <div className="absolute inset-y-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border-l-2 border-r-2 border-neon-cyan rounded"
                  style={{ left: `${trimStart}%`, right: `${100 - trimEnd}%` }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-neon-cyan font-bold">{((trimEnd - trimStart) * 1.34).toFixed(1)}s selected</span>
                  </div>
                </div>
                {/* Waveform decorative */}
                <div className="absolute inset-0 flex items-end gap-px px-1">
                  {Array.from({ length: 60 }, (_, i) => (
                    <div key={i} className="flex-1 bg-muted-foreground/20 rounded-t" style={{ height: `${30 + Math.sin(i * 0.5) * 20}%` }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Start: {(trimStart * 0.134).toFixed(1)}s</label>
                  <input type="range" min={0} max={trimEnd - 5} value={trimStart} onChange={(e) => setTrimStart(+e.target.value)} className="w-full accent-cyan-400" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">End: {(trimEnd * 0.134).toFixed(1)}s</label>
                  <input type="range" min={trimStart + 5} max={100} value={trimEnd} onChange={(e) => setTrimEnd(+e.target.value)} className="w-full accent-purple-400" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 rounded-xl bg-muted text-xs font-semibold hover:bg-neon-cyan/10 transition-colors">Split Clip</button>
                <button className="flex-1 py-2 rounded-xl bg-muted text-xs font-semibold hover:bg-red-400/10 text-red-400 transition-colors">Delete Selected</button>
              </div>
            </div>

            {/* Transitions */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Merge className="w-4 h-4 text-neon-purple" /> Transitions
              </h3>
              <div className="flex gap-2 flex-wrap">
                {TRANSITIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTransition(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedTransition === t ? "bg-neon-purple text-white shadow-neon-purple" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neon-gold" /> Resolution & Quality
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {["720p", "1080p", "4K", "UHD+"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setResolution(r)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      resolution === r ? "bg-neon-gold text-black" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">AI-enhanced upscaling available for 4K and UHD+</p>
            </div>
          </div>
        )}

        {/* AUDIO TAB */}
        {activeTab === "audio" && hasMedia && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-neon-cyan" /> Audio Mixer
              </h3>
              {[
                { label: "Original Audio", val: 80, color: "#00D4FF" },
                { label: "Background Music", val: 40, color: "#8B5CF6" },
                { label: "Voiceover", val: 0, color: "#00FF88" },
              ].map((track) => (
                <div key={track.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{track.label}</span>
                    <span style={{ color: track.color }}>{track.val}%</span>
                  </div>
                  <input type="range" min={0} max={100} defaultValue={track.val} className="w-full" style={{ accentColor: track.color }} />
                </div>
              ))}
            </div>
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Music className="w-4 h-4 text-neon-purple" /> Background Music
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Calm Oud Melody", duration: "2:34", genre: "Islamic" },
                  { name: "Nasheed Beat", duration: "3:12", genre: "Islamic" },
                  { name: "Ambient Cinematic", duration: "4:05", genre: "Cinematic" },
                  { name: "Upbeat Electronic", duration: "2:58", genre: "Electronic" },
                  { name: "Nature Sounds", duration: "5:00", genre: "Ambient" },
                ].map((track) => (
                  <button
                    key={track.name}
                    onClick={() => setBgMusic(track.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      bgMusic === track.name ? "bg-neon-purple/10 border border-neon-purple/30" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgMusic === track.name ? "bg-neon-purple text-white" : "bg-muted-foreground/20"}`}>
                      {bgMusic === track.name ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-xs">{track.name}</p>
                      <p className="text-[10px] text-muted-foreground">{track.genre} · {track.duration}</p>
                    </div>
                    {bgMusic === track.name && <span className="text-neon-purple text-xs">✓ Selected</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEXT TAB */}
        {activeTab === "text" && hasMedia && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Type className="w-4 h-4 text-neon-green" /> Text Overlay
              </h3>
              <input
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                placeholder="Type your overlay text..."
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-neon-green/50 mb-3"
              />
              <div className="grid grid-cols-2 gap-2">
                {TEXT_STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTextStyle(s)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                      textStyle === s ? "bg-neon-green text-black" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-neon-gold" /> Stickers & Emojis
              </h3>
              <div className="flex flex-wrap gap-2">
                {["🔥", "✨", "💯", "🚀", "🕌", "📖", "🌟", "💪", "🙏", "❤️", "🌍", "⚡", "🎯", "🏆", "💎"].map((em) => (
                  <button key={em} onClick={() => setTextOverlay((t) => t + em)} className="text-2xl hover:scale-125 transition-transform">
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FILTERS TAB */}
        {activeTab === "filters" && hasMedia && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-neon-purple" /> Visual Filters
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.id)}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${selectedFilter === f.id ? "scale-105" : ""}`}
                  >
                    <div className={`w-full aspect-square rounded-xl ${f.preview} ${selectedFilter === f.id ? "ring-2 ring-neon-cyan shadow-neon-cyan" : ""}`} />
                    <span className={`text-[10px] font-semibold ${selectedFilter === f.id ? "text-neon-cyan" : "text-muted-foreground"}`}>{f.name}</span>
                  </button>
                ))}
              </div>
              <h3 className="font-semibold text-sm mb-3">Manual Adjustments</h3>
              {[
                { label: "Brightness", val: 50 },
                { label: "Contrast", val: 50 },
                { label: "Saturation", val: 50 },
                { label: "Sharpness", val: 30 },
                { label: "Vignette", val: 20 },
              ].map((adj) => (
                <div key={adj.label} className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{adj.label}</span>
                  <input type="range" min={0} max={100} defaultValue={adj.val} className="flex-1 accent-purple-400" />
                  <span className="text-xs text-muted-foreground w-8 text-right">{adj.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPORT TAB */}
        {activeTab === "export" && hasMedia && (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-sm">Export Settings</h3>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Resolution</span>
                <span className="text-sm font-bold text-neon-cyan">{resolution}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Format</span>
                <span className="text-sm font-bold text-neon-purple">MP4 (H.264)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Filter</span>
                <span className="text-sm font-bold text-neon-gold">{FILTERS.find(f => f.id === selectedFilter)?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Transition</span>
                <span className="text-sm font-bold text-neon-green">{selectedTransition}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Background Music</span>
                <span className="text-sm font-bold">{bgMusic ?? "None"}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handlePublish} disabled={published}
                className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${published ? "bg-neon-green/20 text-neon-green" : "btn-glow-cyan text-black"}`}>
                <Zap className="w-4 h-4" /> {published ? "Published!" : "Publish to Videos"}
              </button>
              <button className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-neon-purple/20 text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/30 transition-colors">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        )}

        {/* Empty state for tabs when no media */}
        {!hasMedia && activeTab !== "edit" && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-semibold text-sm mb-1">No Media Imported</p>
            <p className="text-xs text-muted-foreground mb-4">Import a video or image first to use {activeTab} tools</p>
            <button onClick={handleImport} className="btn-glow-cyan text-black px-5 py-2 rounded-xl text-sm font-bold">
              Import Media
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
