import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import type { TabId } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TAB_ORDER: TabId[] = ["videos", "shorts", "news", "social", "islamic", "settings"];

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const { theme, layoutMode } = useThemeStore();
  const [isDesktop, setIsDesktop] = useState(
    layoutMode === "desktop" || (layoutMode === "auto" && window.innerWidth >= 1024)
  );

  // Touch swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeThreshold = 60;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (layoutMode === "auto") setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [layoutMode]);

  useEffect(() => {
    if (layoutMode === "desktop") setIsDesktop(true);
    else if (layoutMode === "mobile") setIsDesktop(false);
    else setIsDesktop(window.innerWidth >= 1024);
  }, [layoutMode]);

  const enabledTabs = useThemeStore((s) => s.adminConfig.enabledTabs);

  const navigateBySwipe = (direction: "left" | "right") => {
    const ordered = TAB_ORDER.filter((t) => enabledTabs.includes(t));
    const currentIdx = ordered.indexOf(activeTab);
    if (direction === "left" && currentIdx < ordered.length - 1) {
      onTabChange(ordered[currentIdx + 1]);
    } else if (direction === "right" && currentIdx > 0) {
      onTabChange(ordered[currentIdx - 1]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger horizontal swipe if horizontal movement > vertical
    if (Math.abs(dx) > swipeThreshold && Math.abs(dx) > Math.abs(dy) * 1.5) {
      navigateBySwipe(dx < 0 ? "left" : "right");
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard arrow navigation (desktop)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") navigateBySwipe("left");
      if (e.key === "ArrowLeft") navigateBySwipe("right");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeTab, enabledTabs]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {isDesktop && (
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Swipe indicator dots — mobile only */}
        {!isDesktop && (
          <SwipeIndicator activeTab={activeTab} enabledTabs={enabledTabs} onTabChange={onTabChange} />
        )}

        <main
          className="flex-1 overflow-y-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="page-enter">{children}</div>
        </main>

        {!isDesktop && (
          <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        )}
      </div>
    </div>
  );
}

function SwipeIndicator({
  activeTab,
  enabledTabs,
  onTabChange,
}: {
  activeTab: TabId;
  enabledTabs: TabId[];
  onTabChange: (tab: TabId) => void;
}) {
  const ordered = TAB_ORDER.filter((t) => enabledTabs.includes(t));
  const currentIdx = ordered.indexOf(activeTab);

  const TAB_COLORS: Record<TabId, string> = {
    videos: "#00D4FF",
    shorts: "#8B5CF6",
    news: "#00FF88",
    social: "#FF006E",
    islamic: "#FFD700",
    settings: "#94A3B8",
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-1.5 bg-transparent">
      {ordered.map((tab, idx) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className="transition-all duration-300"
          style={{
            width: idx === currentIdx ? "20px" : "6px",
            height: "6px",
            borderRadius: "3px",
            backgroundColor: idx === currentIdx ? TAB_COLORS[tab] : "rgba(148, 163, 184, 0.3)",
            boxShadow: idx === currentIdx ? `0 0 6px ${TAB_COLORS[tab]}` : "none",
          }}
        />
      ))}
    </div>
  );
}
