import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  ChevronDown, Mic, List, Star, Share2, RefreshCw
} from "lucide-react";

interface QuranVerse {
  number: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

interface Surah {
  id: number;
  name: string;
  arabicName: string;
  verses: number;
  revelation: "Makkah" | "Madinah";
  meaning: string;
}

interface QuranPlayerProps {
  surah: Surah;
  verses: QuranVerse[];
  onClose?: () => void;
}

const RECITERS = [
  { id: "ar.alafasy", name: "Mishary Al-Afasy", flag: "🇰🇼", style: "Murattal" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais", flag: "🇸🇦", style: "Hafs" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", flag: "🇪🇬", style: "Murattal" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi", flag: "🇪🇬", style: "Mujawwad" },
  { id: "ar.muhammadayyoub", name: "Muhammad Ayyoub", flag: "🇸🇦", style: "Murattal" },
];

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

// Build Al-Quran Cloud audio URL
function getAyahAudioUrl(reciterId: string, surahId: number, verseId: number): string {
  const num = String(surahId * 1000 + verseId).padStart(6, "0");
  // Try multiple CDN formats
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${num}.mp3`;
}

export function QuranPlayer({ surah, verses, onClose }: QuranPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [muted, setMuted] = useState(false);
  const [reciter, setReciter] = useState(RECITERS[0]);
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [repeat, setRepeat] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const currentVerse = verses[currentVerseIdx];
  const audioUrl = currentVerse ? getAyahAudioUrl(reciter.id, surah.id, currentVerse.number) : "";

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = muted;

    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMeta = () => setDuration(el.duration);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => { setIsLoading(false); setAudioError(false); };
    const onPlaying = () => { setIsPlaying(true); setIsLoading(false); };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (repeat) { el.currentTime = 0; el.play().catch(() => {}); }
      else if (autoPlay && currentVerseIdx < verses.length - 1) {
        setCurrentVerseIdx((i) => i + 1);
      } else { setIsPlaying(false); }
    };
    const onError = () => { setAudioError(true); setIsLoading(false); setIsPlaying(false); };

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("loadedmetadata", onLoadedMeta);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("loadedmetadata", onLoadedMeta);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [volume, muted, repeat, autoPlay, currentVerseIdx, verses.length]);

  // Auto-play new verse when idx changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !isPlaying) return;
    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);
    el.load();
    el.play().catch(() => {});
  }, [currentVerseIdx, reciter.id]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) el.pause();
    else { setAudioError(false); el.play().catch(() => { setAudioError(true); }); }
  }, [isPlaying]);

  const prevVerse = () => { if (currentVerseIdx > 0) setCurrentVerseIdx((i) => i - 1); };
  const nextVerse = () => { if (currentVerseIdx < verses.length - 1) setCurrentVerseIdx((i) => i + 1); };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="glass-card neon-border-gold rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(15,10,30,0.95) 0%, rgba(20,15,40,0.95) 100%)" }}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" crossOrigin="anonymous" />

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-neon-gold/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-bg-gold flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-sm">{surah.id}</span>
            </div>
            <div>
              <h3 className="font-bold text-sm gradient-text-gold">{surah.name}</h3>
              <p className="text-[10px] text-muted-foreground">{surah.meaning} · {surah.verses} verses</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-neon-gold text-xl" style={{ fontFamily: "serif" }}>{surah.arabicName}</p>
          </div>
        </div>
      </div>

      {/* Current Verse Display */}
      <div className="px-4 py-4">
        {currentVerse ? (
          <div className="glass-card rounded-xl p-4 neon-border-gold mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full gradient-bg-gold flex items-center justify-center text-black text-[10px] font-bold flex-shrink-0">
                {currentVerse.number}
              </span>
              <span className="text-[11px] text-neon-gold font-semibold">
                Verse {currentVerse.number} of {verses.length}
              </span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 ml-auto">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="w-1 bg-neon-gold rounded-full animate-pulse"
                      style={{ height: `${6 + Math.sin(i * 1.2) * 6}px`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
              )}
            </div>
            <p className="text-right text-xl leading-loose text-neon-gold mb-2" style={{ fontFamily: "serif", direction: "rtl" }}>
              {currentVerse.arabic}
            </p>
            <p className="text-xs text-muted-foreground italic mb-1">{currentVerse.transliteration}</p>
            <p className="text-sm text-foreground leading-relaxed">{currentVerse.translation}</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-4 neon-border-gold mb-4 text-center">
            <p className="text-muted-foreground text-sm">Select a verse to begin recitation</p>
          </div>
        )}

        {/* Error fallback */}
        {audioError && (
          <div className="bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
            <span className="text-red-400 text-xs">⚠ Audio CDN unavailable. Check internet or try another reciter.</span>
            <button onClick={() => { setAudioError(false); audioRef.current?.load(); }}
              className="ml-auto text-neon-cyan text-xs hover:underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-3">
          <div className="relative h-1.5 bg-muted rounded-full cursor-pointer" onClick={seekTo}>
            <div className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #FFD700, #FF8C00)" }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-neon-gold shadow-neon-gold"
              style={{ left: `calc(${progress}% - 7px)` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            onClick={() => setRepeat(!repeat)}
            className={`p-2 rounded-xl transition-colors ${repeat ? "text-neon-gold bg-neon-gold/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            title="Repeat verse"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={prevVerse}
            disabled={currentVerseIdx === 0}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center disabled:opacity-30 hover:bg-muted/80 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full gradient-bg-gold flex items-center justify-center shadow-neon-gold hover:scale-105 transition-transform"
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 text-black" />
            ) : (
              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={nextVerse}
            disabled={currentVerseIdx === verses.length - 1}
            className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center disabled:opacity-30 hover:bg-muted/80 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Volume + Auto-play */}
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={(e) => { setVolume(+e.target.value); setMuted(+e.target.value === 0); }}
            className="flex-1 h-1 accent-yellow-400" />
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors flex-shrink-0 ${autoPlay ? "bg-neon-gold text-black" : "bg-muted text-muted-foreground"}`}
          >
            Auto-Play {autoPlay ? "ON" : "OFF"}
          </button>
        </div>

        {/* Reciter selector */}
        <div className="relative">
          <button
            onClick={() => setShowReciterMenu(!showReciterMenu)}
            className="w-full glass-card rounded-xl px-3 py-2.5 flex items-center gap-2 hover:bg-muted transition-colors"
          >
            <Mic className="w-4 h-4 text-neon-gold flex-shrink-0" />
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold truncate">{reciter.flag} {reciter.name}</p>
              <p className="text-[10px] text-muted-foreground">{reciter.style} · Reciter</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showReciterMenu ? "rotate-180" : ""}`} />
          </button>

          {showReciterMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 glass-card neon-border-gold rounded-xl overflow-hidden z-20">
              {RECITERS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setReciter(r); setShowReciterMenu(false); setAudioError(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted ${reciter.id === r.id ? "bg-neon-gold/10 text-neon-gold" : "text-foreground"}`}
                >
                  <span>{r.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.style}</p>
                  </div>
                  {reciter.id === r.id && <span className="text-neon-gold text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Verse List */}
        {verses.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <List className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Verse List</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {verses.map((v, i) => (
                <button
                  key={v.number}
                  onClick={() => { setCurrentVerseIdx(i); setAudioError(false); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                    i === currentVerseIdx ? "bg-neon-gold/10 border border-neon-gold/30" : "hover:bg-muted"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ background: i === currentVerseIdx ? "#FFD700" : "var(--muted)", color: i === currentVerseIdx ? "black" : "inherit" }}>
                    {v.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{v.translation.substring(0, 60)}...</p>
                  </div>
                  {i === currentVerseIdx && isPlaying && (
                    <div className="w-3 h-3 rounded-full bg-neon-gold animate-pulse flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
