import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { AppLayout } from "@/components/layout/AppLayout";
import VideosPage from "@/pages/VideosPage";
import ShortsPage from "@/pages/ShortsPage";
import NewsPage from "@/pages/NewsPage";
import SocialPage from "@/pages/SocialPage";
import IslamicPage from "@/pages/IslamicPage";
import SettingsPage from "@/pages/SettingsPage";
import AuthPage from "@/pages/AuthPage";
import type { TabId } from "@/types";
import heroBanner from "@/assets/hero-banner.jpg";

export default function Index() {
  const { theme, activeTab, setActiveTab } = useThemeStore();
  const { isLoggedIn } = useAuthStore();
  const [splashDone, setSplashDone] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // After splash, check auth
  const handleSplashDone = () => {
    setSplashDone(true);
    if (!isLoggedIn) setShowAuth(true);
  };

  if (!splashDone) {
    return <SplashScreen onDone={handleSplashDone} heroBanner={heroBanner} />;
  }

  if (showAuth) {
    return <AuthPage onAuthComplete={() => setShowAuth(false)} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case "videos": return <VideosPage />;
      case "shorts": return <ShortsPage />;
      case "news": return <NewsPage />;
      case "social": return <SocialPage />;
      case "islamic": return <IslamicPage />;
      case "settings": return <SettingsPage />;
      default: return <VideosPage />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={(tab: TabId) => setActiveTab(tab)}>
      {renderPage()}
    </AppLayout>
  );
}

function SplashScreen({ onDone, heroBanner }: { onDone: () => void; heroBanner: string }) {
  const [phase, setPhase] = useState<"logo" | "tagline" | "fade">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 1000);
    const t2 = setTimeout(() => setPhase("fade"), 2500);
    const t3 = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ${phase === "fade" ? "opacity-0" : "opacity-100"}`}
      style={{ background: "linear-gradient(135deg, #0A0A1A 0%, #0D0D2B 50%, #0A0A1A 100%)" }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full opacity-20 animate-pulse" style={{ background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full opacity-15 animate-pulse" style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)", animationDelay: "0.5s" }} />
      </div>

      <div className={`relative z-10 text-center transition-all duration-500 ${phase === "logo" ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}>
        <div className="w-24 h-24 rounded-3xl gradient-bg-primary flex items-center justify-center mx-auto mb-6 shadow-neon-cyan animate-float">
          <span className="text-5xl font-display font-black text-white">U</span>
        </div>
        <h1 className="font-display font-black text-5xl gradient-text-cyan mb-2 tracking-tight">UniEdge</h1>
        <p className={`text-muted-foreground text-lg font-medium transition-all duration-500 ${phase === "tagline" || phase === "fade" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          Connect Beyond Boundaries
        </p>
        <div className="mt-8 w-48 h-1 bg-muted/40 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full rounded-full gradient-bg-primary transition-all"
            style={{ width: phase === "logo" ? "20%" : phase === "tagline" ? "80%" : "100%", transitionDuration: "1.5s" }}
          />
        </div>
        <p className="text-neon-gold/60 text-sm mt-4" style={{ fontFamily: "serif" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
      </div>
      <p className="absolute bottom-8 text-muted-foreground/40 text-xs">
        Successor to the Unifeel Platform · SMART WORLD ORDER
      </p>
    </div>
  );
}
