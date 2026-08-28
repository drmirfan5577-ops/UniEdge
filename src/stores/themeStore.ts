import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, LayoutMode, TabId, AdminConfig } from "@/types";

interface ThemeState {
  theme: Theme;
  layoutMode: LayoutMode;
  activeTab: TabId;
  adminUnlocked: boolean;
  adminConfig: AdminConfig;
  setTheme: (theme: Theme) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setActiveTab: (tab: TabId) => void;
  setAdminUnlocked: (v: boolean) => void;
  updateAdminConfig: (config: Partial<AdminConfig>) => void;
}

const defaultAdminConfig: AdminConfig = {
  enabledTabs: ["videos", "shorts", "news", "social", "islamic", "settings"],
  tabOrder: ["videos", "shorts", "news", "social", "islamic", "settings"],
  appName: "UniEdge",
  tagline: "Connect Beyond Boundaries",
  version: "1.0.0",
  maintenanceMode: false,
  customTabs: [],
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "super-bright",
      layoutMode: "auto",
      activeTab: "videos",
      adminUnlocked: false,
      adminConfig: defaultAdminConfig,
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute("data-theme", theme);
      },
      setLayoutMode: (layoutMode) => set({ layoutMode }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setAdminUnlocked: (adminUnlocked) => set({ adminUnlocked }),
      updateAdminConfig: (config) =>
        set((state) => ({ adminConfig: { ...state.adminConfig, ...config } })),
    }),
    { name: "uniedge-theme" }
  )
);
