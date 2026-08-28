import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward,
  Settings, Download, Share2, X, Subtitles, PictureInPicture, RotateCcw,
  ChevronDown, Wifi, Zap
} from "lucide-react";

export interface MediaSource {
  url: string;
  title: string;
  artist?: string;
  thumbnail?: string;
  type?: "video" | "audio";
  duration?: number;
}

interface ESMediaPlayerProps {
  source: MediaSource;
  onClose?: () => void;
  autoPlay?: boolean;
  className?: string;
  compact?: boolean;
}

const RESOLUTIONS = ["Auto", "4K UHD+", "2K", "1080p", "720p", "480p", "360p"];
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function ESMediaPlayer({ source, onClose, autoPlay = false, className = "", compact = false }: ESMediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAudio = source.type === "audio" || (!source.url.match(/\.(mp4|webm|mkv|mov|avi|ogg)(\?|$)/i) && source.url.match(/\.(mp3|aac|opus|flac|wav|m4a)(\?|$)/i));
  const mediaRef = isAudio ? audioRef : videoRef;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [resolution, setResolution] = useState("Auto");
  const [speed, setSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showResMenu, setShowResMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
    el.playbackRate = speed;

    const handlers = {
      timeupdate: () => setCurrentTime(el.currentTime),
      loadedmetadata: () => setDuration(el.duration),
      progress: () => {
        if (el.buffered.length > 0) setBuffered((el.buffered.end(el.buffered.length - 1) / el.duration) * 100);
      },
      waiting: () => setIsLoading(true),
      canplay: () => setIsLoading(false),
      playing: () => { setIsPlaying(true); setIsLoading(false); },
      pause: () => setIsPlaying(false),
      ended: () => setIsPlaying(false),
      error: () => setError("Media format not supported or source unavailable"),
    };

    Object.entries(handlers).forEach(([evt, fn]) => el.addEventListener(evt, fn));
    if (autoPlay) el.play().catch(() => {});
    return () => { Object.entries(handlers).forEach(([evt, fn]) => el.removeEventListener(evt, fn)); };
  }, [source.url, autoPlay, volume, muted, speed, mediaRef]);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    el.volume = volume;
  }, [volume, mediaRef]);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    el.muted = muted;
  }, [muted, mediaRef]);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    el.playbackRate = speed;
  }, [speed, mediaRef]);

  const togglePlay = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (isPlaying) el.pause(); else el.play().catch(() => {});
    resetHideTimer();
  }, [isPlaying, mediaRef, resetHideTimer]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = mediaRef.current;
    if (!el || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration, mediaRef]);

  const skip = useCallback((secs: number) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(duration, el.currentTime + secs));
    resetHideTimer();
  }, [duration, mediaRef, resetHideTimer]);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const handlePiP = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (document.pictureInPictureElement) document.exitPictureInPicture().catch(() => {});
    else el.requestPictureInPicture?.().catch(() => {});
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-2xl overflow-hidden select-none group ${className}`}
      style={{ aspectRatio: isAudio ? "unset" : "16/9" }}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
      onClick={(e) => { if (e.target === containerRef.current || (e.target as HTMLElement).tagName === "VIDEO") togglePlay(); }}
    >
      {/* Media element */}
      {isAudio ? (
        <audio ref={audioRef} src={source.url} preload="metadata" className="hidden" crossOrigin="anonymous" />
      ) : (
        <video
          ref={videoRef}
          src={source.url}
          preload="metadata"
          className="w-full h-full object-contain bg-black"
          crossOrigin="anonymous"
          playsInline
        />
      )}

      {/* Audio mode visual */}
      {isAudio && (
        <div className="flex flex-col items-center justify-center py-8 px-6 min-h-[180px]"
          style={{ background: "linear-gradient(135deg, #0D0D2B 0%, #1a0a2e 100%)" }}>
          {source.thumbnail ? (
            <img src={source.thumbnail} alt={source.title} className="w-24 h-24 rounded-2xl object-cover mb-4 shadow-neon-cyan" />
          ) : (
            <div className="w-24 h-24 rounded-2xl gradient-bg-primary flex items-center justify-center mb-4 shadow-neon-cyan">
              <Volume2 className="w-10 h-10 text-white" />
            </div>
          )}
          <p className="font-bold text-base text-white text-center mb-1">{source.title}</p>
          {source.artist && <p className="text-sm text-white/60 text-center">{source.artist}</p>}
          {isPlaying && (
            <div className="flex items-end gap-0.5 mt-3">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className="w-1.5 rounded-full bg-neon-cyan animate-pulse"
                  style={{ height: `${8 + Math.sin(i * 0.8 + Date.now() * 0.001) * 10}px`, animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white text-sm text-center px-6">
          <Zap className="w-8 h-8 text-red-400 mb-2" />
          <p className="font-semibold mb-1">Playback Error</p>
          <p className="text-white/60 text-xs">{error}</p>
          <button onClick={() => { setError(null); mediaRef.current?.load(); }} className="mt-3 px-4 py-1.5 rounded-full bg-neon-cyan text-black text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Big play/pause center */}
      {!isPlaying && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" onClick={togglePlay}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-neon-cyan pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`absolute inset-x-0 bottom-0 transition-all duration-300 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-8 px-3 pb-3">

          {/* Progress bar */}
          <div
            ref={progressRef}
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/prog"
            onClick={seek}
          >
            {/* Buffered */}
            <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full" style={{ width: `${buffered}%` }} />
            {/* Played */}
            <div className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg, #00D4FF, #8B5CF6)" }} />
            {/* Thumb */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-neon-cyan opacity-0 group-hover/prog:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercent}% - 7px)` }} />
          </div>

          {/* Control row */}
          <div className="flex items-center gap-1.5">
            <button onClick={() => skip(-10)} className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={togglePlay} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button onClick={() => skip(10)} className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Volume */}
            <button onClick={() => setMuted(!muted)} className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors">
              {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
              onChange={(e) => { setVolume(+e.target.value); setMuted(+e.target.value === 0); }}
              className="w-16 h-1 accent-cyan-400 hidden sm:block"
            />

            {/* Time */}
            <span className="text-white text-xs ml-1 flex-shrink-0 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Resolution badge */}
            <button
              onClick={() => { setShowResMenu(!showResMenu); setShowSpeedMenu(false); setShowSettings(false); }}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-neon-cyan bg-neon-cyan/10 hover:bg-neon-cyan/20 flex items-center gap-1 transition-colors flex-shrink-0"
            >
              <Wifi className="w-2.5 h-2.5" /> {resolution}
            </button>

            {/* Speed */}
            <button
              onClick={() => { setShowSpeedMenu(!showSpeedMenu); setShowResMenu(false); setShowSettings(false); }}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-neon-purple bg-neon-purple/10 hover:bg-neon-purple/20 transition-colors flex-shrink-0"
            >
              {speed}×
            </button>

            {/* PiP */}
            {!isAudio && (
              <button onClick={handlePiP} className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors hidden sm:block">
                <PictureInPicture className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Fullscreen */}
            {!isAudio && (
              <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            )}

            {onClose && (
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resolution menu */}
      {showResMenu && (
        <div className="absolute bottom-20 right-4 glass-card neon-border-cyan rounded-xl overflow-hidden z-20 min-w-[120px]" onClick={(e) => e.stopPropagation()}>
          <p className="text-[10px] text-muted-foreground px-3 pt-2 pb-1 uppercase tracking-wide font-semibold">Quality</p>
          {RESOLUTIONS.map((r) => (
            <button key={r} onClick={() => { setResolution(r); setShowResMenu(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted transition-colors flex items-center justify-between ${resolution === r ? "text-neon-cyan" : "text-foreground"}`}>
              {r} {resolution === r && "✓"}
            </button>
          ))}
        </div>
      )}

      {/* Speed menu */}
      {showSpeedMenu && (
        <div className="absolute bottom-20 right-20 glass-card neon-border-purple rounded-xl overflow-hidden z-20 min-w-[100px]" onClick={(e) => e.stopPropagation()}>
          <p className="text-[10px] text-muted-foreground px-3 pt-2 pb-1 uppercase tracking-wide font-semibold">Speed</p>
          {SPEEDS.map((s) => (
            <button key={s} onClick={() => { setSpeed(s); setShowSpeedMenu(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted transition-colors flex items-center justify-between ${speed === s ? "text-neon-purple" : "text-foreground"}`}>
              {s}× {speed === s && "✓"}
            </button>
          ))}
        </div>
      )}

      {/* Title overlay */}
      {!isAudio && (
        <div className={`absolute inset-x-0 top-0 transition-all duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => e.stopPropagation()}>
          <div className="bg-gradient-to-b from-black/70 to-transparent px-4 pt-3 pb-6">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm truncate">{source.title}</p>
                {source.artist && <p className="text-white/60 text-xs">{source.artist}</p>}
              </div>
              <div className="flex gap-1.5 flex-shrink-0 ml-2">
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
