import { useState } from "react";
import { Shield, Lock, Eye, EyeOff, Users, BarChart3, Settings, Layers, AlertTriangle, ChevronRight, Power, RefreshCw } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "UniEdge@Admin2025!";

export default function AdminPage() {
  const { adminUnlocked, setAdminUnlocked, adminConfig, updateAdminConfig } = useThemeStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [step, setStep] = useState<"password" | "2fa" | "dashboard">(adminUnlocked ? "dashboard" : "password");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setStep("2fa");
      setError("");
    } else {
      setError("Incorrect password. Access denied.");
    }
  };

  const handle2FA = () => {
    if (twoFACode === "123456") {
      setAdminUnlocked(true);
      setStep("dashboard");
      setError("");
    } else {
      setError("Invalid 2FA code. Use 123456 for demo.");
    }
  };

  if (step === "password") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-neon-purple/20 neon-border-purple flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-neon-purple" />
            </div>
            <h1 className="font-display font-bold text-2xl gradient-text-cyan mb-1">Admin Access</h1>
            <p className="text-muted-foreground text-sm">Supreme Admin Panel · Strongly Protected</p>
          </div>

          <div className="glass-card neon-border-purple rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password..."
                  className="w-full pl-9 pr-10 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/50 placeholder:text-muted-foreground"
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handlePasswordSubmit}
              className="w-full btn-glow-purple text-white py-3 rounded-xl font-semibold"
            >
              Verify Password
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-2 rounded-xl text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Back to Settings
            </button>

            <p className="text-[11px] text-muted-foreground/60 text-center">
              Demo password: UniEdge@Admin2025!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "2fa") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-neon-cyan/20 neon-border-cyan flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
              <Shield className="w-10 h-10 text-neon-cyan" />
            </div>
            <h1 className="font-display font-bold text-2xl gradient-text-cyan mb-1">Two-Factor Auth</h1>
            <p className="text-muted-foreground text-sm">Enter the 6-digit verification code</p>
          </div>

          <div className="glass-card neon-border-cyan rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                Authenticator Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full text-center text-2xl font-bold tracking-[0.5em] py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 placeholder:text-muted-foreground placeholder:tracking-normal"
                onKeyDown={(e) => e.key === "Enter" && handle2FA()}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button onClick={handle2FA} className="w-full btn-glow-cyan text-black py-3 rounded-xl font-semibold">
              Verify & Enter
            </button>

            <p className="text-[11px] text-muted-foreground/60 text-center">Demo code: 123456</p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  const SECTIONS = [
    { id: "overview", label: "Overview", emoji: "📊" },
    { id: "features", label: "Features", emoji: "🔧" },
    { id: "users", label: "Users", emoji: "👥" },
    { id: "navigation", label: "Navigation", emoji: "🧭" },
    { id: "branding", label: "Branding", emoji: "🎨" },
    { id: "moderation", label: "Moderation", emoji: "🛡️" },
  ];

  return (
    <div className="min-h-screen">
      {/* Admin Header */}
      <div className="glass-card border-b neon-border-purple sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-neon-purple" />
            <div>
              <h1 className="font-display font-bold text-lg gradient-text-cyan">Supreme Admin Panel</h1>
              <p className="text-[10px] text-neon-green">🟢 Authenticated — Full Access</p>
            </div>
          </div>
          <button
            onClick={() => { setAdminUnlocked(false); navigate(-1); }}
            className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 transition-colors"
          >
            Lock & Exit
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-1 mt-3 overflow-x-auto no-scrollbar">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeSection === s.id ? "btn-glow-purple text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-3xl mx-auto space-y-4">
        {activeSection === "overview" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total Users", value: "128.4K", icon: "👥", color: "#00D4FF" },
                { label: "Active Today", value: "12.8K", icon: "🟢", color: "#00FF88" },
                { label: "Videos Uploaded", value: "34.2K", icon: "🎥", color: "#8B5CF6" },
                { label: "Messages/Day", value: "2.1M", icon: "💬", color: "#FF006E" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-3 text-center" style={{ borderLeft: `3px solid ${stat.color}` }}>
                  <p className="text-2xl mb-1">{stat.icon}</p>
                  <p className="font-bold text-lg" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3">⚡ Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Push Update", icon: "📡", action: () => alert("Update pushed to all users!") },
                  { label: "Clear Cache", icon: "🗑️", action: () => alert("Cache cleared!") },
                  { label: "Backup Now", icon: "💾", action: () => alert("Backup initiated!") },
                  { label: "Maintenance Mode", icon: "🔧", action: () => updateAdminConfig({ maintenanceMode: !adminConfig.maintenanceMode }) },
                ].map((a) => (
                  <button key={a.label} onClick={a.action} className="flex items-center gap-2 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-sm font-medium text-left">
                    <span className="text-xl">{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* App info */}
            <div className="glass-card rounded-2xl p-4 space-y-2">
              <h3 className="font-semibold text-sm mb-2">ℹ️ App Configuration</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">App Name</span>
                <span className="font-medium text-neon-cyan">{adminConfig.appName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tagline</span>
                <span className="font-medium">{adminConfig.tagline}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">{adminConfig.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Maintenance Mode</span>
                <span className={`font-bold ${adminConfig.maintenanceMode ? "text-red-400" : "text-neon-green"}`}>
                  {adminConfig.maintenanceMode ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Tabs</span>
                <span className="font-medium">{adminConfig.enabledTabs.length}/6</span>
              </div>
            </div>
          </>
        )}

        {activeSection === "features" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Feature Toggle Manager</p>
            {[
              { name: "Videos Tab", key: "videos_enabled", desc: "Long-form video streaming", on: true },
              { name: "Shorts Tab", key: "shorts_enabled", desc: "TikTok-style short videos", on: true },
              { name: "News Feed", key: "news_enabled", desc: "ES News & RSS integration", on: true },
              { name: "Live Chat", key: "chat_enabled", desc: "Real-time messaging", on: true },
              { name: "I-Hub", key: "islamic_enabled", desc: "Islamic Hub features", on: true },
              { name: "Voice Calls", key: "calls_enabled", desc: "WebRTC voice calling", on: true },
              { name: "Video Calls", key: "video_calls_enabled", desc: "WebRTC video calling", on: true },
              { name: "Gallery# Vault", key: "vault_enabled", desc: "Encrypted media vault", on: true },
              { name: "ES Studio", key: "studio_enabled", desc: "Creator video studio", on: false },
              { name: "Status Updates", key: "status_enabled", desc: "24h disappearing stories", on: true },
              { name: "Communities", key: "communities_enabled", desc: "Group communities", on: true },
              { name: "Chunked Upload", key: "upload_enabled", desc: "No-limit file upload", on: true },
            ].map((feat) => (
              <FeatureToggleRow key={feat.key} name={feat.name} desc={feat.desc} defaultOn={feat.on} />
            ))}
          </div>
        )}

        {activeSection === "users" && (
          <div className="space-y-3">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3">👥 User Management</h3>
              {[
                { name: "Ahmed Hassan", role: "Verified User", status: "Active", joined: "Jan 2025" },
                { name: "Sara Al-Rashid", role: "Creator", status: "Active", joined: "Feb 2025" },
                { name: "Muhammad Yusuf", role: "Developer", status: "Active", joined: "Mar 2025" },
                { name: "Fatima Malik", role: "User", status: "Suspended", joined: "Apr 2025" },
                { name: "Omar Khalid", role: "Creator", status: "Active", joined: "May 2025" },
              ].map((u) => (
                <div key={u.name} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role} · Joined {u.joined}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      u.status === "Active" ? "bg-neon-green/10 text-neon-green" : "bg-red-400/10 text-red-400"
                    }`}>{u.status}</span>
                    <button className="text-xs text-neon-cyan hover:underline">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "navigation" && (
          <div className="glass-card rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-1">🧭 Tab Visibility Manager</h3>
            <p className="text-xs text-muted-foreground mb-4">Toggle which tabs appear in the navigation bar</p>
            {(["videos", "shorts", "news", "social", "islamic", "settings"] as const).map((tab) => {
              const icons: Record<string, string> = { videos: "🎥", shorts: "⚡", news: "📰", social: "🌐", islamic: "🕌", settings: "⚙️" };
              const labels: Record<string, string> = { videos: "Videos", shorts: "Shorts", news: "News", social: "Social", islamic: "I-Hub", settings: "Settings" };
              const enabled = adminConfig.enabledTabs.includes(tab);
              return (
                <div key={tab} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <span className="font-medium text-sm">{icons[tab]} {labels[tab]}</span>
                  <button
                    onClick={() => {
                      const newTabs = enabled
                        ? adminConfig.enabledTabs.filter((t) => t !== tab)
                        : [...adminConfig.enabledTabs, tab];
                      if (newTabs.length > 0) updateAdminConfig({ enabledTabs: newTabs });
                    }}
                    className={`relative w-11 h-6 rounded-full transition-all duration-200 ${enabled ? "bg-neon-cyan" : "bg-muted-foreground/30"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${enabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeSection === "branding" && (
          <div className="glass-card rounded-2xl p-4 space-y-4">
            <h3 className="font-semibold text-sm">🎨 Branding Configuration</h3>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">App Name</label>
              <input
                value={adminConfig.appName}
                onChange={(e) => updateAdminConfig({ appName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tagline</label>
              <input
                value={adminConfig.tagline}
                onChange={(e) => updateAdminConfig({ tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Version</label>
              <input
                value={adminConfig.version}
                onChange={(e) => updateAdminConfig({ version: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <p className="text-xs text-neon-cyan">Changes apply instantly across all users.</p>
          </div>
        )}

        {activeSection === "moderation" && (
          <div className="space-y-3">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3">🛡️ Content Moderation</h3>
              <div className="space-y-2">
                {[
                  { label: "Flagged Content", count: "12 pending", color: "#FF006E" },
                  { label: "DMCA Requests", count: "3 pending", color: "#FFD700" },
                  { label: "Reported Users", count: "7 reports", color: "#F97316" },
                  { label: "Spam Detected", count: "Auto-removed 44", color: "#00FF88" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted">
                    <span className="font-medium text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: item.color }}>{item.count}</span>
                      <button className="text-xs text-neon-cyan hover:underline">Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureToggleRow({ name, desc, defaultOn }: { name: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${on ? "bg-neon-green/10 text-neon-green" : "bg-muted-foreground/20 text-muted-foreground"}`}>
          {on ? "Enabled" : "Disabled"}
        </span>
        <button
          onClick={() => setOn(!on)}
          className={`relative w-11 h-6 rounded-full transition-all duration-200 ${on ? "bg-neon-cyan" : "bg-muted-foreground/30"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-5" : "left-0.5"}`} />
        </button>
      </div>
    </div>
  );
}
