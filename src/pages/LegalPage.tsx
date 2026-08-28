import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Globe, AlertTriangle, BookOpen } from "lucide-react";

const LEGAL_CONTENT: Record<string, { title: string; icon: React.ReactNode; color: string; content: React.ReactNode }> = {
  privacy: {
    title: "Privacy Policy",
    icon: <Lock className="w-6 h-6" />,
    color: "#00D4FF",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p className="text-foreground font-semibold">Last Updated: August 2025</p>
        <Section t="1. Data We Collect">
          UniEdge collects information necessary to provide our services, including: account registration data (name, phone, email), messages and media (encrypted end-to-end with AES-256), usage analytics (anonymized), and device information for optimization.
        </Section>
        <Section t="2. How We Use Your Data">
          We use your data to provide and improve our services, send important notifications, ensure security and prevent fraud, and comply with legal obligations. We never sell your personal data to third parties.
        </Section>
        <Section t="3. Data Security">
          All messages are encrypted using AES-256 encryption. Sensitive data is stored with Row Level Security (RLS) policies. We comply with GDPR and CCPA regulations. Gallery# Vault uses biometric authentication for additional protection.
        </Section>
        <Section t="4. Your Rights">
          You have the right to access, correct, or delete your personal data at any time. You may request data export or account deletion by contacting us at dr.mirfan5577@gmail.com.
        </Section>
        <Section t="5. Cookies">
          We use essential cookies for session management and optional analytics cookies to improve your experience. You can control cookie preferences in your browser settings.
        </Section>
        <Section t="6. Children's Privacy">
          UniEdge is not intended for children under 13. We do not knowingly collect personal information from children under 13.
        </Section>
        <Section t="7. Contact">
          For privacy concerns: dr.mirfan5577@gmail.com | WhatsApp: 0300-4737757
        </Section>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    icon: <BookOpen className="w-6 h-6" />,
    color: "#8B5CF6",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p className="text-foreground font-semibold">Effective: August 2025</p>
        <Section t="1. Acceptance">
          By using UniEdge, you agree to these Terms of Service. If you do not agree, please do not use the platform.
        </Section>
        <Section t="2. User Responsibilities">
          You are responsible for all activity on your account. You must not use UniEdge to share illegal content, spam, harassment, hate speech, or content that violates copyright law.
        </Section>
        <Section t="3. Prohibited Content">
          The following is strictly prohibited: illegal content, adult content without age verification, hate speech, terrorism promotion, copyright infringement, malware distribution.
        </Section>
        <Section t="4. Account Termination">
          We reserve the right to suspend or terminate accounts that violate these terms, with or without prior notice. You may appeal any moderation decision within 30 days.
        </Section>
        <Section t="5. Dispute Resolution">
          Disputes shall be resolved through binding arbitration under the laws of Pakistan. Class action lawsuits are not permitted.
        </Section>
        <Section t="6. Limitation of Liability">
          UniEdge and SMART WORLD ORDER are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
        </Section>
        <Section t="7. Modifications">
          We may update these terms periodically. Continued use of UniEdge after changes constitutes acceptance of the new terms.
        </Section>
      </div>
    ),
  },
  disclaimer: {
    title: "Disclaimer & Warnings",
    icon: <AlertTriangle className="w-6 h-6" />,
    color: "#FFD700",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <Section t="Service Disclaimer">
          UniEdge is provided "AS IS" and "AS AVAILABLE" without any warranty, express or implied. We do not guarantee uninterrupted, error-free, or completely secure service.
        </Section>
        <Section t="Content Disclaimer">
          UniEdge does not endorse, verify, or take responsibility for user-generated content. Content posted by users does not reflect the views of SMART WORLD ORDER or its founders.
        </Section>
        <Section t="Islamic Content Notice">
          The Islamic content in I-Hub is sourced from established open-source databases (Tanzil, Sunnah.com API, Aladhan API). For religious rulings (fatwas), please consult qualified Islamic scholars.
        </Section>
        <Section t="Media Upload Warning">
          Users are responsible for ensuring they have the rights to upload any content. Uploading copyrighted material without permission is strictly prohibited and may result in account suspension.
        </Section>
        <Section t="Call & Messaging Warning">
          While we provide end-to-end encryption, no digital communication system is 100% secure. Do not share sensitive information (passwords, banking details) via any messaging platform.
        </Section>
      </div>
    ),
  },
  dmca: {
    title: "DMCA Policy",
    icon: <Shield className="w-6 h-6" />,
    color: "#FF006E",
    content: (
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <Section t="Copyright Infringement Policy">
          UniEdge complies with the Digital Millennium Copyright Act (DMCA). We respond to notices of alleged copyright infringement and will remove content upon receipt of a valid DMCA notice.
        </Section>
        <Section t="Filing a DMCA Notice">
          To file a DMCA takedown request, please contact us at: dr.mirfan5577@gmail.com with the subject line "DMCA Takedown Request". Include: your contact information, description of the copyrighted work, URL of the infringing content, and a statement of good faith belief.
        </Section>
        <Section t="Counter-Notice">
          If you believe your content was removed in error, you may file a DMCA counter-notice. We will restore removed content within 10-14 business days unless the copyright holder files a court action.
        </Section>
        <Section t="Repeat Infringers">
          UniEdge has a policy of terminating accounts of repeat copyright infringers, consistent with DMCA requirements.
        </Section>
      </div>
    ),
  },
  vision: {
    title: "Vision & Mission",
    icon: <Globe className="w-6 h-6" />,
    color: "#00FF88",
    content: (
      <div className="space-y-5 text-sm leading-relaxed">
        <div className="glass-card neon-border-green rounded-2xl p-5 text-center">
          <p className="text-3xl mb-2">🌟</p>
          <h2 className="font-display font-bold text-xl gradient-text-green mb-2">Vision by Dr M Irfan Qadir Thaheem</h2>
          <p className="text-muted-foreground text-sm italic">"Connecting the global Muslim Ummah and all communities through technology, knowledge, and faith."</p>
        </div>
        <Section t="Our Vision">
          UniEdge envisions a world where communities are connected beyond boundaries — where technology serves humanity, knowledge flows freely, and digital tools empower people of all backgrounds to communicate, create, and grow. As the successor to the Unifeel platform, UniEdge builds on a foundation of trust, innovation, and Islamic values.
        </Section>
        <Section t="Our Mission">
          To build a world-class, privacy-first social media and content platform that combines the best of WhatsApp and YouTube, enriched with Islamic features, creator tools, and a commitment to serving the global Muslim community and beyond.
        </Section>
        <Section t="Core Values">
          <ul className="list-none space-y-1">
            {["🕌 Faith-centered — Rooted in Islamic principles", "🔒 Privacy-first — AES-256 encryption, no data selling", "🌍 Global — Multilingual, multicultural platform", "⚡ Innovation — AI-powered, 4K media, cutting-edge UX", "🤝 Community — Building the Ummah and beyond"].map((v) => (
              <li key={v} className="text-muted-foreground">{v}</li>
            ))}
          </ul>
        </Section>
        <div className="glass-card rounded-2xl p-4 text-center border border-neon-green/20">
          <p className="font-bold text-neon-green">SMART WORLD ORDER</p>
          <p className="text-muted-foreground text-xs mt-1">© 2025 All Rights Reserved</p>
          <p className="text-xs mt-2 text-muted-foreground">UniEdge is a product of SMART WORLD ORDER, founded by Dr M Irfan Qadir Thaheem. Successor to the Unifeel Platform.</p>
        </div>
      </div>
    ),
  },
};

function Section({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-foreground mb-1">{t}</h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

export default function LegalPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const content = type ? LEGAL_CONTENT[type] : null;

  if (!content) {
    return (
      <div className="min-h-screen px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neon-cyan mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="space-y-3">
          {Object.entries(LEGAL_CONTENT).map(([key, item]) => (
            <button
              key={key}
              onClick={() => navigate(`/legal/${key}`)}
              className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 hover:bg-muted transition-colors text-left"
              style={{ borderLeft: `3px solid ${item.color}` }}
            >
              <div style={{ color: item.color }}>{item.icon}</div>
              <span className="font-semibold">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="glass-card border-b border-border sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-xl hover:bg-muted transition-colors" style={{ color: content.color }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div style={{ color: content.color }}>{content.icon}</div>
          <h1 className="font-display font-bold text-lg" style={{ color: content.color }}>{content.title}</h1>
        </div>
      </div>
      <div className="px-4 py-5 max-w-2xl mx-auto">{content.content}</div>
    </div>
  );
}
