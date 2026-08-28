import { useThemeStore } from "@/stores/themeStore";
import type { TabId } from "@/types";

const TABS: { id: TabId; label: string; emoji: string; color: string }[] = [
  { id: "videos", label: "Videos", emoji: "🎥", color: "#00D4FF" },
  { id: "shorts", label: "Shorts", emoji: "⚡", color: "#8B5CF6" },
  { id: "news", label: "News", emoji: "📰", color: "#00FF88" },
  { id: "social", label: "Social", emoji: "🌐", color: "#FF006E" },
  { id: "islamic", label: "I-Hub", emoji: "🕌", color: "#FFD700" },
  { id: "settings", label: "Settings", emoji: "⚙️", color: "#94A3B8" },
];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: Props) {
  const { adminConfig } = useThemeStore();
  const enabledTabs = TABS.filter((t) => adminConfig.enabledTabs.includes(t.id));

  return (
    <nav className="glass-card border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1">
        {enabledTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all duration-200 min-w-[52px] min-h-[52px] ${
                isActive ? "scale-110" : "opacity-60 hover:opacity-90"
              }`}
              style={
                isActive
                  ? {
                      background: `${tab.color}18`,
                      boxShadow: `0 0 12px ${tab.color}44`,
                    }
                  : {}
              }
            >
              <span className="text-xl leading-none mb-0.5">{tab.emoji}</span>
              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? tab.color : undefined }}
              >
                {tab.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-0 w-6 h-0.5 rounded-full"
                  style={{ backgroundColor: tab.color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
