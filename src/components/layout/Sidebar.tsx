import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import type { TabId } from "@/types";

const TABS: { id: TabId; label: string; emoji: string; color: string; desc: string }[] = [
  { id: "videos", label: "Videos", emoji: "🎥", color: "#00D4FF", desc: "Long-form & Live" },
  { id: "shorts", label: "Shorts", emoji: "⚡", color: "#8B5CF6", desc: "Quick clips" },
  { id: "news", label: "News", emoji: "📰", color: "#00FF88", desc: "ES News" },
  { id: "social", label: "Social", emoji: "🌐", color: "#FF006E", desc: "Chats & Updates" },
  { id: "islamic", label: "I-Hub", emoji: "🕌", color: "#FFD700", desc: "Islamic features" },
  { id: "settings", label: "Settings", emoji: "⚙️", color: "#94A3B8", desc: "Preferences" },
];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Sidebar({ activeTab, onTabChange }: Props) {
  const { currentUser } = useAuthStore();
  const { adminConfig } = useThemeStore();
  const enabledTabs = TABS.filter((t) => adminConfig.enabledTabs.includes(t.id));

  return (
    <aside className="w-64 flex flex-col glass-card border-r border-border h-full overflow-y-auto no-scrollbar">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-neon-cyan text-white font-bold text-lg">
            U
          </div>
          <div>
            <h1 className="font-display font-bold text-lg gradient-text-cyan">
              {adminConfig.appName}
            </h1>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {adminConfig.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {enabledTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? "scale-[1.01]"
                  : "hover:bg-muted opacity-70 hover:opacity-100"
              }`}
              style={
                isActive
                  ? {
                      background: `${tab.color}14`,
                      borderLeft: `3px solid ${tab.color}`,
                      boxShadow: `0 0 16px ${tab.color}22`,
                    }
                  : {}
              }
            >
              <span className="text-2xl">{tab.emoji}</span>
              <div>
                <div
                  className="font-semibold text-sm leading-tight"
                  style={{ color: isActive ? tab.color : undefined }}
                >
                  {tab.label}
                </div>
                <div className="text-[11px] text-muted-foreground">{tab.desc}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      {currentUser && (
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="status-ring">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full block"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{currentUser.name}</div>
              <div className="text-[11px] text-neon-cyan truncate">{currentUser.title}</div>
            </div>
            {currentUser.isVerified && (
              <span className="text-neon-cyan text-xs">✓</span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
