import { useState } from "react";
import { Phone, ArrowRight, Shield, Eye, EyeOff, CheckCircle, User, Camera } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import type { User as UserType } from "@/types";

type AuthStep = "welcome" | "phone" | "otp" | "profile" | "done";

const DEMO_PHONE = "03001234567";
const DEMO_OTP = "123456";

interface AuthPageProps {
  onAuthComplete: () => void;
}

export default function AuthPage({ onAuthComplete }: AuthPageProps) {
  const { login } = useAuthStore();
  const [step, setStep] = useState<AuthStep>("welcome");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [subName, setSubName] = useState("");
  const [showOtpHint, setShowOtpHint] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendOtp = () => {
    if (phone.length < 10) { setError("Enter a valid phone number."); return; }
    setError("");
    setStep("otp");
    let t = 30;
    setResendTimer(t);
    const interval = setInterval(() => {
      t--;
      setResendTimer(t);
      if (t === 0) clearInterval(interval);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join("");
    if (code === DEMO_OTP) {
      setError("");
      setStep("profile");
    } else {
      setError("Incorrect code. Demo OTP: 123456");
    }
  };

  const handleOtpDigit = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val;
    setOtpDigits(next);
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleGoogleLogin = () => {
    const user: UserType = {
      id: "google-user",
      name: "Google User",
      subName: "UniEdge Member",
      title: "Member",
      avatar: "https://i.pravatar.cc/150?img=8",
      isVerified: true,
      isOnline: true,
    };
    login(user);
    onAuthComplete();
  };

  const handleCompleteProfile = () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    const user: UserType = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      subName: subName.trim() || "UniEdge Member",
      title: "Member",
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      phone,
      isVerified: true,
      isOnline: true,
    };
    login(user);
    setStep("done");
    setTimeout(() => onAuthComplete(), 1500);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #080814 0%, #0D0D2B 50%, #080814 100%)" }}
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "#00D4FF" }} />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full opacity-10 blur-3xl" style={{ background: "#8B5CF6" }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl gradient-bg-primary flex items-center justify-center mx-auto mb-4 shadow-neon-cyan animate-float">
            <span className="text-4xl font-black text-white font-display">U</span>
          </div>
          <h1 className="font-display font-black text-4xl gradient-text-cyan mb-1">UniEdge</h1>
          <p className="text-muted-foreground text-sm">Connect Beyond Boundaries</p>
          <p className="text-neon-gold/60 text-xs mt-1" style={{ fontFamily: "serif" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>

        {/* WELCOME */}
        {step === "welcome" && (
          <div className="space-y-4">
            <div className="glass-card neon-border-cyan rounded-2xl p-6 text-center">
              <h2 className="font-display font-bold text-xl gradient-text-cyan mb-2">Welcome to UniEdge</h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                The next generation social platform combining messaging, videos, and Islamic features — all in one.
              </p>
              <button
                onClick={() => setStep("phone")}
                className="w-full btn-glow-cyan text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 mb-3"
              >
                <Phone className="w-5 h-5" />
                Continue with Phone
              </button>
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-white/10 border border-white/20 hover:bg-white/15 transition-all flex items-center justify-center gap-2"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Continue with Google
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground/60">
              By continuing, you agree to UniEdge's Terms of Service and Privacy Policy
            </p>
          </div>
        )}

        {/* PHONE INPUT */}
        {step === "phone" && (
          <div className="glass-card neon-border-cyan rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-display font-bold text-xl gradient-text-cyan mb-1">Enter Your Number</h2>
              <p className="text-muted-foreground text-sm">We'll send you a verification code</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 py-3 rounded-xl bg-muted border border-border text-sm font-medium">
                  🇵🇰 +92
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                  placeholder="3001234567"
                  className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 placeholder:text-muted-foreground"
                  maxLength={10}
                />
              </div>
            </div>
            {error && <p className="text-red-400 text-xs flex items-center gap-1"><Shield className="w-3 h-3" />{error}</p>}
            <button onClick={handleSendOtp} className="w-full btn-glow-cyan text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              Send OTP <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-muted-foreground/50 text-center">Demo: any 10-digit number. OTP: 123456</p>
            <button onClick={() => setStep("welcome")} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
          </div>
        )}

        {/* OTP VERIFICATION */}
        {step === "otp" && (
          <div className="glass-card neon-border-cyan rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-display font-bold text-xl gradient-text-cyan mb-1">Verify Code</h2>
              <p className="text-muted-foreground text-sm">Enter the 6-digit code sent to <span className="text-foreground font-medium">+92 {phone}</span></p>
            </div>
            <div>
              <div className="flex gap-2 justify-center">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigit(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && idx > 0) {
                        document.getElementById(`otp-${idx - 1}`)?.focus();
                      }
                    }}
                    className={`w-11 h-14 text-center text-xl font-bold rounded-xl bg-muted border focus:outline-none transition-all duration-200 ${
                      digit ? "border-neon-cyan text-neon-cyan shadow-neon-cyan" : "border-border"
                    } focus:ring-2 focus:ring-neon-cyan/50`}
                  />
                ))}
              </div>
            </div>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button onClick={handleVerifyOtp} className="w-full btn-glow-cyan text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Verify & Continue
            </button>
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-xs text-muted-foreground">Resend in <span className="text-neon-cyan font-semibold">{resendTimer}s</span></p>
              ) : (
                <button onClick={handleSendOtp} className="text-xs text-neon-cyan hover:underline">Resend Code</button>
              )}
            </div>
            <button onClick={() => setStep("phone")} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">← Change Number</button>
          </div>
        )}

        {/* PROFILE SETUP */}
        {step === "profile" && (
          <div className="glass-card neon-border-cyan rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-display font-bold text-xl gradient-text-cyan mb-1">Set Up Profile</h2>
              <p className="text-muted-foreground text-sm">Tell the community who you are</p>
            </div>
            <div className="flex justify-center">
              <div className="relative cursor-pointer group">
                <div className="w-20 h-20 rounded-full gradient-bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-neon-cyan">
                  {name ? name[0]?.toUpperCase() : <User className="w-8 h-8" />}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Display Name *</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Bio / Sub-name</label>
              <input
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. Developer, Student, Creator..."
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 placeholder:text-muted-foreground"
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button onClick={handleCompleteProfile} className="w-full btn-glow-cyan text-black py-3.5 rounded-xl font-bold">
              Complete Setup →
            </button>
          </div>
        )}

        {/* DONE */}
        {step === "done" && (
          <div className="glass-card neon-border-cyan rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-4 shadow-neon-green animate-glow-pulse">
              <CheckCircle className="w-10 h-10 text-neon-green" />
            </div>
            <h2 className="font-display font-bold text-xl gradient-text-green mb-2">Welcome Aboard!</h2>
            <p className="text-muted-foreground text-sm">Alhamdulillah, your account is verified and ready.</p>
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-bg-green animate-pulse rounded-full w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
