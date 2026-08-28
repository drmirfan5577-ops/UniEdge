import { useState } from "react";
import { Moon, Sun, Zap, Monitor, Smartphone, ChevronRight, Shield, User, Bell, Lock, Info, ExternalLink, Mail, Globe, Phone, Film, Image } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import type { Theme, LayoutMode } from "@/types";

export default function SettingsPage() {
  const { theme, setTheme, layoutMode, setLayoutMode, adminUnlocked } = useThemeStore();
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const THEMES: { id: Theme; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { id: "super-bright", label: "Super Bright", desc: "Vibrant neon, luminous 24/7", icon: <Zap className="w-5 h-5" />, color: "#00D4FF" },
    { id: "light", label: "Light Mode", desc: "Clean white/gray interface", icon: <Sun className="w-5 h-5" />, color: "#F97316" },
    { id: "ultra-light", label: "Ultra Light", desc: "Pure white, minimal shadows", icon: <Sun className="w-5 h-5" />, color: "#94A3B8" },
    { id: "dark", label: "Dark Mode", desc: "OLED black, muted neon", icon: <Moon className="w-5 h-5" />, color: "#8B5CF6" },
  ];

  const LAYOUTS: { id: LayoutMode; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: "auto", label: "Auto Detect", desc: "Adapts to your device width", icon: <Monitor className="w-5 h-5" /> },
    { id: "mobile", label: "Force Mobile", desc: "Mobile layout always", icon: <Smartphone className="w-5 h-5" /> },
    { id: "desktop", label: "Force Desktop", desc: "Desktop layout always", icon: <Monitor className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="glass-card border-b border-border sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <h1 className="font-display font-bold text-xl gradient-text-cyan">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto space-y-5">
        {/* Profile */}
        {currentUser && (
          <div className="glass-card neon-border-cyan rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="status-ring">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-full block" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg">{currentUser.name}</h2>
                  {currentUser.isVerified && <span className="text-neon-cyan text-sm">✓</span>}
                </div>
                <p className="text-sm text-neon-cyan">{currentUser.subName}</p>
                <p className="text-xs text-muted-foreground">{currentUser.title}</p>
              </div>
              <button className="p-2 rounded-xl hover:bg-muted transition-colors">
                <User className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Theme */}
        <Section title="🎨 Display Theme" subtitle="Choose your visual style">
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-xl text-left transition-all duration-200 ${
                  theme === t.id ? "ring-2 scale-[1.02]" : "bg-muted hover:bg-muted/80"
                }`}
                style={
                  theme === t.id
                    ? { ringColor: t.color, background: `${t.color}14`, boxShadow: `0 0 16px ${t.color}30` }
                    : {}
                }
              >
                <div className="flex items-center gap-2 mb-1" style={{ color: theme === t.id ? t.color : undefined }}>
                  {t.icon}
                  <span className="font-semibold text-xs">{t.label}</span>
                  {theme === t.id && <span className="ml-auto text-xs">✓</span>}
                </div>
                <p className="text-[11px] text-muted-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        </Section>

        {/* Layout */}
        <Section title="📐 Layout Mode" subtitle="Control how the app is displayed">
          <div className="space-y-2">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLayoutMode(l.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                  layoutMode === l.id ? "bg-neon-cyan/10 border border-neon-cyan/30" : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div className={layoutMode === l.id ? "text-neon-cyan" : "text-muted-foreground"}>
                  {l.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${layoutMode === l.id ? "text-neon-cyan" : ""}`}>{l.label}</p>
                  <p className="text-xs text-muted-foreground">{l.desc}</p>
                </div>
                {layoutMode === l.id && <span className="text-neon-cyan text-sm">✓</span>}
              </button>
            ))}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="🔔 Notifications">
          {[
            { label: "Messages", desc: "New chat messages", default: true },
            { label: "Updates/Stories", desc: "Friend status updates", default: true },
            { label: "Video uploads", desc: "Channels you follow", default: false },
            { label: "Islamic reminders", desc: "Prayer times, Azkar", default: true },
          ].map((item) => (
            <ToggleRow key={item.label} label={item.label} desc={item.desc} defaultOn={item.default} />
          ))}
        </Section>

        {/* Privacy */}
        <Section title="🔒 Privacy & Security">
          {[
            { icon: <Lock className="w-4 h-4" />, label: "Gallery# Vault", desc: "Biometric lock for private media", color: "#FF006E" },
            { icon: <Shield className="w-4 h-4" />, label: "AES-256 Encryption", desc: "End-to-end message encryption", color: "#00FF88" },
            { icon: <User className="w-4 h-4" />, label: "Account Privacy", desc: "Control who sees your profile", color: "#00D4FF" },
            { icon: <Bell className="w-4 h-4" />, label: "Blocked Contacts", desc: "Manage blocked users", color: "#8B5CF6" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-muted transition-colors text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}20`, color: item.color }}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </Section>

        {/* Quick Access Tools */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/studio")}
            className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-muted transition-colors neon-border-cyan"
          >
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
              <Film className="w-5 h-5 text-neon-cyan" />
            </div>
            <p className="font-bold text-xs gradient-text-cyan">ES Studio</p>
            <p className="text-[10px] text-muted-foreground text-center">Creator video editor</p>
          </button>
          <button
            onClick={() => navigate("/gallery")}
            className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-muted transition-colors neon-border-gold"
          >
            <div className="w-10 h-10 rounded-xl bg-neon-gold/20 flex items-center justify-center">
              <Image className="w-5 h-5 text-neon-gold" />
            </div>
            <p className="font-bold text-xs gradient-text-gold">Gallery#</p>
            <p className="text-[10px] text-muted-foreground text-center">Media vault & uploads</p>
          </button>
        </div>

        {/* Admin Panel */}
        <button
          onClick={() => navigate("/admin")}
          className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 hover:bg-muted transition-colors neon-border-purple"
        >
          <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-neon-purple" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold gradient-text-cyan">Supreme Admin Panel</p>
            <p className="text-xs text-muted-foreground">
              {adminUnlocked ? "🟢 Unlocked — Command & Control Center" : "🔐 Protected — Strong Password + 2FA Required"}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-neon-purple" />
        </button>

        {/* About / Legal */}
        <Section title="ℹ️ About UniEdge">
          {[
            { label: "Privacy Policy", icon: <Lock className="w-4 h-4" />, path: "/legal/privacy" },
            { label: "Terms of Service", icon: <Info className="w-4 h-4" />, path: "/legal/terms" },
            { label: "Disclaimer & Warnings", icon: <Shield className="w-4 h-4" />, path: "/legal/disclaimer" },
            { label: "DMCA Policy", icon: <ExternalLink className="w-4 h-4" />, path: "/legal/dmca" },
            { label: "Vision & Mission", icon: <Globe className="w-4 h-4" />, path: "/legal/vision" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
            >
              <div className="text-muted-foreground">{item.icon}</div>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </Section>

        {/* Contact */}
        <div className="glass-card neon-border-gold rounded-2xl p-4">
          <h3 className="font-semibold text-sm gradient-text-gold mb-3">📬 Contact Us</h3>
          <div className="space-y-2">
            <a href="https://wa.me/03004737757" className="flex items-center gap-2 text-sm text-neon-green hover:underline">
              <Phone className="w-4 h-4" /> WhatsApp: 0300-4737757
            </a>
            <a href="mailto:dr.mirfan5577@gmail.com" className="flex items-center gap-2 text-sm text-neon-cyan hover:underline">
              <Mail className="w-4 h-4" /> dr.mirfan5577@gmail.com
            </a>
            <a href="https://drmirfan5577-ops.github.io/SmartWorldOrder" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-neon-purple hover:underline">
              <Globe className="w-4 h-4" /> SmartWorldOrder.github.io
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pb-4 space-y-1">
          <p className="font-display font-bold gradient-text-cyan text-sm">UniEdge v1.0.0</p>
          <p>Connect Beyond Boundaries</p>
          <p>© 2025 SMART WORLD ORDER · Vision by Dr M Irfan Qadir Thaheem</p>
          <p>Successor to the Unifeel Platform</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-semibold text-sm">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="p-3 space-y-1">{children}</div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-muted transition-colors">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${on ? "bg-neon-cyan shadow-neon-cyan" : "bg-muted-foreground/30"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
