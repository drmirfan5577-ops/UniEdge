import { useState, useCallback } from "react";
import {
  Search, Volume2, ChevronRight, BookOpen, Compass, Bell, MapPin,
  Calendar, Clock, Star, Play, Pause, ArrowLeft, ChevronDown, ChevronUp
} from "lucide-react";
import { MOCK_SURAHS, MOCK_PRAYER_TIMES, MORNING_AZKAR } from "@/constants/mockData";
import { QuranPlayer } from "@/components/features/QuranPlayer";

type ITab = "quran" | "hadith" | "azkar" | "prayer" | "dua" | "calendar";

interface SurahVerse {
  number: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

const ALL_VERSES: Record<number, SurahVerse[]> = {
  1: [
    { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", transliteration: "Bismillahir-rahmanir-rahim", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
    { number: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", transliteration: "Alhamdu lillahi rabb il-alamin", translation: "All praise is due to Allah, Lord of the worlds." },
    { number: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", transliteration: "Ar-rahmanir-rahim", translation: "The Entirely Merciful, the Especially Merciful." },
    { number: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", transliteration: "Maliki yawmid-din", translation: "Sovereign of the Day of Recompense." },
    { number: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", transliteration: "Iyyaka nabudu wa iyyaka nastain", translation: "It is You we worship and You we ask for help." },
    { number: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", transliteration: "Ihdinas-siratal-mustaqim", translation: "Guide us to the straight path." },
    { number: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", transliteration: "Sirat-alladhina anamta alayhim ghayril-maghdubi alayhim wa lad-dallin", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked anger or gone astray." },
  ],
  112: [
    { number: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", transliteration: "Qul huwa Allahu ahad", translation: "Say: He is Allah, the One." },
    { number: 2, arabic: "اللَّهُ الصَّمَدُ", transliteration: "Allahu samad", translation: "Allah, the Eternal, Absolute." },
    { number: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", transliteration: "Lam yalid wa lam yulad", translation: "He begets not, nor is He begotten." },
    { number: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", transliteration: "Wa lam yakun lahu kufuwan ahad", translation: "And there is none comparable to Him." },
  ],
  113: [
    { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", transliteration: "Qul auzu birabbil falaq", translation: "Say: I seek refuge with the Lord of the dawn." },
    { number: 2, arabic: "مِن شَرِّ مَا خَلَقَ", transliteration: "Min sharri ma khalaq", translation: "From the evil of what He created." },
    { number: 3, arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", transliteration: "Wa min sharri ghasiqin iza waqab", translation: "And from the evil of the darkening night when it settles." },
    { number: 4, arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", transliteration: "Wa min sharrin naffasati fil-uqad", translation: "And from the evil of those who blow on knots." },
    { number: 5, arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", transliteration: "Wa min sharri hasidin iza hasad", translation: "And from the evil of an envier when he envies." },
  ],
  114: [
    { number: 1, arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", transliteration: "Qul auzu birabbin-nas", translation: "Say: I seek refuge with the Lord of mankind." },
    { number: 2, arabic: "مَلِكِ النَّاسِ", transliteration: "Malikin-nas", translation: "The Sovereign of mankind." },
    { number: 3, arabic: "إِلَٰهِ النَّاسِ", transliteration: "Ilahin-nas", translation: "The God of mankind." },
    { number: 4, arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", transliteration: "Min sharril waswasil khannas", translation: "From the evil of the retreating whisperer." },
    { number: 5, arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", transliteration: "Alladhi yuwaswisu fi sudurin-nas", translation: "Who whispers into the breasts of mankind." },
    { number: 6, arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ", transliteration: "Minal jinnati wan-nas", translation: "From among the jinn and mankind." },
  ],
};

const EVENING_AZKAR = [
  { id: 10, arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ", transliteration: "Amsayna wa amsal-mulku lillahi wal-hamdu lillah", translation: "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.", count: 1, virtue: "Evening remembrance, gratitude to Allah" },
  { id: 11, arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا", transliteration: "Allahumma bika amsayna wa bika asbahna", translation: "O Allah, by Your leave we have reached the evening and by Your leave we reach the morning.", count: 1, virtue: "Protection and reliance on Allah" },
  { id: 12, arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", count: 3, virtue: "Protection from all harm" },
  { id: 13, arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ", transliteration: "Bismillahilladhi la yadurru maasmihi shayun", translation: "In the name of Allah with whose name nothing is harmed on earth nor in the heavens.", count: 3, virtue: "Protection from harm throughout the night" },
];

const DUAS = [
  { cat: "Morning & Evening", count: 44, emoji: "🌅", color: "#FFD700", items: ["Ayatul Kursi — Protection", "Last 3 Surahs (×3) — Protection", "Bismillah (100×) — Daily protection", "Sayyidul Istighfar — Forgiveness"] },
  { cat: "Before Sleep", count: 12, emoji: "🌙", color: "#8B5CF6", items: ["Al-Ikhlas, Al-Falaq, An-Nas (×3)", "Ayatul Kursi", "Subhanallah (×33), Alhamdulillah (×33), Allahu Akbar (×34)"] },
  { cat: "After Prayer", count: 28, emoji: "🕌", color: "#00D4FF", items: ["Astaghfirullah (×3)", "Subhanallah (×33), Alhamdulillah (×33), Allahu Akbar (×33)", "Ayatul Kursi"] },
  { cat: "Eating & Drinking", count: 8, emoji: "🍽️", color: "#00FF88", items: ["Bismillah", "Alhamdulillah after eating"] },
  { cat: "Travelling", count: 15, emoji: "✈️", color: "#F97316", items: ["Subhanalladhi sakhkhara lana hadha", "Allahumma hawwin alayna safarana"] },
  { cat: "Seeking Forgiveness", count: 18, emoji: "🤲", color: "#FF006E", items: ["Sayyidul Istighfar", "Astaghfirullaha wa atubu ilayh (×100)"] },
  { cat: "Quran & Learning", count: 10, emoji: "📖", color: "#FFD700", items: ["Rabbi zidni ilma", "Rabb ishrah li sadri"] },
  { cat: "Health & Protection", count: 22, emoji: "🛡️", color: "#00FF88", items: ["Auzu bi kalimatillah tammati min sharri ma khalaq", "Bismillahi alladhi la yadhurru maasmihi shayun"] },
];

const HADITH_BOOKS = [
  { name: "Sahih Al-Bukhari", arabic: "صحيح البخاري", hadith: "7563", author: "Imam Al-Bukhari", color: "#FFD700",
    featured: { text: "Actions are judged by intentions, and every person will get the reward according to what he has intended.", narrator: "Umar ibn Al-Khattab (RA)", ref: "Bukhari 1" } },
  { name: "Sahih Muslim", arabic: "صحيح مسلم", hadith: "7500", author: "Imam Muslim", color: "#00D4FF",
    featured: { text: "None of you truly believes until he loves for his brother what he loves for himself.", narrator: "Anas ibn Malik (RA)", ref: "Muslim 45" } },
  { name: "Sunan Abu Dawood", arabic: "سنن أبي داود", hadith: "5274", author: "Imam Abu Dawood", color: "#00FF88",
    featured: { text: "Seek knowledge from the cradle to the grave.", narrator: "Prophet ﷺ", ref: "Abu Dawood" } },
  { name: "Jami At-Tirmidhi", arabic: "جامع الترمذي", hadith: "3956", author: "Imam At-Tirmidhi", color: "#8B5CF6",
    featured: { text: "The best of you are those who learn the Quran and teach it.", narrator: "Uthman ibn Affan (RA)", ref: "Tirmidhi 2907" } },
  { name: "Sunan An-Nasai", arabic: "سنن النسائي", hadith: "5758", author: "Imam An-Nasai", color: "#F97316",
    featured: { text: "Make things easy and do not make them difficult.", narrator: "Abu Musa Al-Ashari (RA)", ref: "Nasai" } },
  { name: "Sunan Ibn Majah", arabic: "سنن ابن ماجه", hadith: "4341", author: "Imam Ibn Majah", color: "#FF006E",
    featured: { text: "Cleanliness is half of faith.", narrator: "Abu Malik Al-Ashari (RA)", ref: "Ibn Majah 281" } },
];

const HIJRI_MONTHS = ["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Shaban","Ramadan","Shawwal","Dhul Qadah","Dhul Hijjah"];

export default function IslamicPage() {
  const [activeTab, setActiveTab] = useState<ITab>("quran");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedMorningAzkar, setCheckedMorningAzkar] = useState<Set<number>>(new Set());
  const [checkedEveningAzkar, setCheckedEveningAzkar] = useState<Set<number>>(new Set());
  const [azkarType, setAzkarType] = useState<"morning" | "evening">("morning");
  const [openSurah, setOpenSurah] = useState<number | null>(null);
  const [openHadith, setOpenHadith] = useState<string | null>(null);
  const [openDua, setOpenDua] = useState<string | null>(null);
  const [qiblaAngle] = useState(Math.floor(Math.random() * 360));

  const TABS: { id: ITab; label: string; emoji: string }[] = [
    { id: "quran", label: "Quran", emoji: "📖" },
    { id: "hadith", label: "Hadith", emoji: "📚" },
    { id: "azkar", label: "Azkar", emoji: "🤲" },
    { id: "prayer", label: "Prayer", emoji: "🕌" },
    { id: "dua", label: "Dua", emoji: "🙏" },
    { id: "calendar", label: "Hijri", emoji: "📅" },
  ];

  const prayerList = [
    { name: "Fajr", time: MOCK_PRAYER_TIMES.fajr, emoji: "🌙", color: "#8B5CF6" },
    { name: "Sunrise", time: MOCK_PRAYER_TIMES.sunrise, emoji: "🌅", color: "#F97316" },
    { name: "Dhuhr", time: MOCK_PRAYER_TIMES.dhuhr, emoji: "☀️", color: "#FFD700" },
    { name: "Asr", time: MOCK_PRAYER_TIMES.asr, emoji: "🌤️", color: "#00D4FF" },
    { name: "Maghrib", time: MOCK_PRAYER_TIMES.maghrib, emoji: "🌆", color: "#FF006E" },
    { name: "Isha", time: MOCK_PRAYER_TIMES.isha, emoji: "⭐", color: "#00FF88" },
  ];

  const filteredSurahs = MOCK_SURAHS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arabicName.includes(searchQuery) ||
      s.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.id).includes(searchQuery)
  );

  const azkarList = azkarType === "morning" ? MORNING_AZKAR : EVENING_AZKAR;
  const checkedAzkar = azkarType === "morning" ? checkedMorningAzkar : checkedEveningAzkar;
  const setCheckedAzkar = azkarType === "morning" ? setCheckedMorningAzkar : setCheckedEveningAzkar;

  const toggleAzkar = useCallback((id: number) => {
    setCheckedAzkar((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, [setCheckedAzkar]);

  return (
    <div className="min-h-screen islamic-pattern">
      <div className="glass-card border-b border-neon-gold/30 sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕌</span>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text-gold leading-tight">I-Hub</h1>
              <p className="text-[10px] text-neon-gold/70">Islamic Knowledge Center</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-neon-gold">{MOCK_PRAYER_TIMES.date}</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
              <MapPin className="w-2.5 h-2.5" />{MOCK_PRAYER_TIMES.location}
            </p>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchQuery(""); setOpenSurah(null); }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id ? "bg-neon-gold text-black shadow-neon-gold" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">

        {/* ════ QURAN with Audio Player ════ */}
        {activeTab === "quran" && (
          <div>
            {openSurah ? (
              <div>
                <button onClick={() => setOpenSurah(null)} className="flex items-center gap-2 text-neon-gold hover:underline mb-4 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back to Surah List
                </button>
                {(() => {
                  const surah = MOCK_SURAHS.find((s) => s.id === openSurah);
                  const verses = ALL_VERSES[openSurah] ?? [];
                  if (!surah) return null;
                  return (
                    <div className="space-y-4">
                      {/* Quran Audio Player */}
                      <QuranPlayer
                        surah={surah}
                        verses={verses}
                      />

                      {/* Verses display (when no built-in verses) */}
                      {verses.length === 0 && (
                        <div className="glass-card neon-border-gold rounded-2xl p-6 text-center">
                          <p className="text-neon-gold text-2xl mb-2" style={{ fontFamily: "serif" }}>{surah.arabicName}</p>
                          <p className="text-muted-foreground text-sm">Audio streaming available via reciter</p>
                          <p className="text-xs text-muted-foreground mt-1">Full verse text for {surah.verses} ayaat</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div>
                {/* Hero */}
                <div className="glass-card neon-border-gold rounded-2xl p-5 mb-5 text-center">
                  <p className="text-neon-gold text-2xl font-bold mb-1" style={{ fontFamily: "serif" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                  <p className="text-muted-foreground text-xs mb-3">In the name of Allah, the Most Gracious, the Most Merciful</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center"><p className="text-xl font-bold text-neon-gold">114</p><p className="text-[10px] text-muted-foreground">Surahs</p></div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center"><p className="text-xl font-bold text-neon-gold">6,236</p><p className="text-[10px] text-muted-foreground">Verses</p></div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center"><p className="text-xl font-bold text-neon-gold">30</p><p className="text-[10px] text-muted-foreground">Juz</p></div>
                  </div>
                  {/* Audio CDN info */}
                  <div className="mt-3 px-3 py-2 bg-neon-cyan/5 rounded-xl border border-neon-cyan/20">
                    <p className="text-[10px] text-neon-cyan">🎵 Audio: Al-Quran Cloud CDN · 5 reciters · Per-verse streaming</p>
                  </div>
                </div>

                {/* Shortcuts for surahs with audio */}
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                  {[1, 112, 113, 114].map((id) => {
                    const s = MOCK_SURAHS.find((s) => s.id === id);
                    if (!s) return null;
                    return (
                      <button key={id} onClick={() => setOpenSurah(id)}
                        className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-neon-gold/10 border border-neon-gold/20 hover:bg-neon-gold/20 transition-colors">
                        <span className="text-neon-gold text-xs font-bold">{id}</span>
                        <div className="text-left">
                          <p className="text-xs font-semibold">{s.name}</p>
                          <p className="text-[9px] text-muted-foreground">{s.verses} v</p>
                        </div>
                        <Play className="w-3 h-3 text-neon-gold" />
                      </button>
                    );
                  })}
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Surah by name, number or meaning..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-neon-gold/50 placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  {filteredSurahs.map((surah) => (
                    <button key={surah.id} onClick={() => setOpenSurah(surah.id)}
                      className="w-full glass-card rounded-xl p-3 flex items-center gap-3 hover:bg-muted transition-all neon-border-gold group text-left">
                      <div className="w-10 h-10 rounded-xl gradient-bg-gold flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-xs">{surah.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{surah.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{surah.revelation}</span>
                          {ALL_VERSES[surah.id] && <span className="text-[9px] text-neon-cyan bg-neon-cyan/10 px-1.5 py-0.5 rounded">🎵 Audio</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{surah.meaning}</span><span>·</span><span>{surah.verses} verses</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-neon-gold text-lg" style={{ fontFamily: "serif" }}>{surah.arabicName}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-neon-gold transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ PRAYER TIMES ════ */}
        {activeTab === "prayer" && (
          <div className="space-y-4">
            <div className="glass-card neon-border-gold rounded-2xl p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Next Prayer</p>
              <h2 className="font-display font-bold text-3xl gradient-text-gold mb-1">Asr</h2>
              <p className="text-2xl font-bold mb-1">{MOCK_PRAYER_TIMES.asr}</p>
              <div className="flex items-center justify-center gap-1.5 text-neon-green text-sm">
                <Clock className="w-4 h-4" /><span>In 1 hour 28 minutes</span>
              </div>
              <div className="mt-3 h-1.5 bg-muted rounded-full">
                <div className="h-full gradient-bg-gold rounded-full" style={{ width: "62%" }} />
              </div>
            </div>

            <div className="glass-card neon-border-gold rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-base gradient-text-gold">Prayer Times</h3>
                  <p className="text-xs text-muted-foreground">{MOCK_PRAYER_TIMES.date}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neon-cyan bg-neon-cyan/10 px-2.5 py-1.5 rounded-full">
                  <MapPin className="w-3.5 h-3.5" />{MOCK_PRAYER_TIMES.location}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {prayerList.map((p) => (
                  <div key={p.name} className="rounded-xl p-3 flex items-center gap-3 transition-all"
                    style={{ background: `${p.color}12`, border: `1px solid ${p.color}30` }}>
                    <span className="text-xl">{p.emoji}</span>
                    <div>
                      <p className="font-semibold text-xs" style={{ color: p.color }}>{p.name}</p>
                      <p className="font-bold text-base">{p.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Qibla Compass */}
            <div className="glass-card neon-border-gold rounded-2xl p-5 text-center">
              <h3 className="font-bold gradient-text-gold text-base mb-3">Qibla Direction</h3>
              <div className="relative w-28 h-28 mx-auto mb-3">
                <div className="absolute inset-0 rounded-full neon-border-gold bg-muted/30 flex items-center justify-center">
                  <div className="absolute inset-2 rounded-full border border-border/30 flex items-center justify-center">
                    <div className="w-1 h-12 rounded-full"
                      style={{ background: "linear-gradient(to top, #FF006E, #FFD700)", transform: `rotate(${qiblaAngle}deg)`, transformOrigin: "center bottom" }} />
                  </div>
                  {["N","E","S","W"].map((d, i) => (
                    <span key={d} className="absolute text-[10px] font-bold text-muted-foreground"
                      style={{ top: i===0?"4px":i===2?"auto":"50%", bottom: i===2?"4px":"auto", left: i===3?"4px":i===1?"auto":"50%", right: i===1?"4px":"auto", transform: i===0||i===2?"translateX(-50%)":"translateY(-50%)" }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground text-xs mb-1">Toward Makkah Al-Mukarramah</p>
              <p className="text-neon-gold text-sm font-bold">{qiblaAngle}° {qiblaAngle<90?"NE":qiblaAngle<180?"SE":qiblaAngle<270?"SW":"NW"}</p>
            </div>
          </div>
        )}

        {/* ════ AZKAR ════ */}
        {activeTab === "azkar" && (
          <div>
            <div className="flex gap-2 mb-4">
              {["morning","evening"].map((t) => (
                <button key={t} onClick={() => setAzkarType(t as "morning"|"evening")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    azkarType === t ? t==="morning"?"bg-neon-gold text-black shadow-neon-gold":"bg-neon-purple text-white shadow-neon-purple" : "bg-muted text-muted-foreground"
                  }`}>
                  {t==="morning"?"🌅 Morning (Sabah)":"🌙 Evening (Masa)"}
                </button>
              ))}
            </div>
            <div className="glass-card neon-border-gold rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm gradient-text-gold">{azkarType==="morning"?"Morning Azkar":"Evening Azkar"}</p>
                <p className="text-xs text-muted-foreground">Daily remembrance of Allah ﷻ</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-neon-gold">{checkedAzkar.size}/{azkarList.length}</p>
                <p className="text-[10px] text-muted-foreground">completed</p>
              </div>
            </div>
            <div className="mb-4 h-2 bg-muted rounded-full">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${azkarList.length?(checkedAzkar.size/azkarList.length)*100:0}%`, background: "linear-gradient(135deg, #FFD700, #FF8C00)" }} />
            </div>
            <div className="space-y-3">
              {azkarList.map((azkar) => {
                const done = checkedAzkar.has(azkar.id);
                return (
                  <div key={azkar.id} className={`glass-card rounded-2xl p-4 transition-all ${done?"opacity-60":"neon-border-gold"}`}>
                    <p className="text-right text-xl leading-loose text-neon-gold mb-2" style={{ fontFamily:"serif", direction:"rtl" }}>{azkar.arabic}</p>
                    <p className="text-muted-foreground text-xs italic mb-1">{azkar.transliteration}</p>
                    <p className="text-sm mb-3 leading-relaxed">{azkar.translation}</p>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-neon-gold bg-neon-gold/10 px-2 py-0.5 rounded-full">×{azkar.count}</span>
                        <p className="text-[10px] text-muted-foreground">{azkar.virtue}</p>
                      </div>
                      <button onClick={() => toggleAzkar(azkar.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${done?"bg-neon-green/20 text-neon-green scale-110":"bg-muted hover:bg-neon-gold/20 hover:text-neon-gold"}`}>
                        {done?"✓":"○"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {checkedAzkar.size===azkarList.length&&azkarList.length>0&&(
              <div className="glass-card neon-border-gold rounded-2xl p-5 text-center mt-4">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-bold gradient-text-gold text-base">MashAllah! All Azkar Complete</p>
                <button onClick={()=>setCheckedAzkar(new Set())} className="mt-3 text-xs text-neon-cyan hover:underline">Reset for tomorrow</button>
              </div>
            )}
          </div>
        )}

        {/* ════ HADITH ════ */}
        {activeTab === "hadith" && (
          <div className="space-y-3">
            <div className="glass-card neon-border-gold rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
                <span className="text-xs font-bold text-neon-gold uppercase tracking-wide">Hadith of the Day</span>
              </div>
              <p className="text-base font-semibold leading-relaxed mb-2 italic">
                "The best of you are those who are best to their families, and I am the best of you to my family."
              </p>
              <p className="text-xs text-muted-foreground">— Narrated by A'isha (RA) · Tirmidhi 3895</p>
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1">Sihah Sittah — The Six Authentic Collections</div>
            {HADITH_BOOKS.map((book) => (
              <div key={book.name}>
                <button onClick={() => setOpenHadith(openHadith===book.name?null:book.name)}
                  className="w-full glass-card rounded-xl p-4 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                  style={{ borderLeft: `3px solid ${book.color}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${book.color}20` }}>
                    <BookOpen className="w-5 h-5" style={{ color:book.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{book.name}</p>
                    <p className="text-xs text-muted-foreground">{book.author} · {book.hadith} Hadith</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-lg" style={{ fontFamily:"serif", color:book.color }}>{book.arabic}</span>
                    {openHadith===book.name?<ChevronUp className="w-4 h-4 text-muted-foreground"/>:<ChevronDown className="w-4 h-4 text-muted-foreground"/>}
                  </div>
                </button>
                {openHadith===book.name&&(
                  <div className="glass-card rounded-xl p-4 mx-2 mt-1 space-y-3">
                    <div className="p-3 rounded-xl" style={{ background:`${book.color}10`, border:`1px solid ${book.color}30` }}>
                      <p className="text-sm italic leading-relaxed mb-2">"{book.featured.text}"</p>
                      <p className="text-xs text-muted-foreground">— {book.featured.narrator} · {book.featured.ref}</p>
                    </div>
                    <button className="w-full py-2 rounded-xl text-xs font-semibold" style={{ background:`${book.color}20`, color:book.color }}>
                      Browse All {book.hadith} Hadith →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ════ DUA ════ */}
        {activeTab === "dua" && (
          <div className="space-y-3">
            <div className="glass-card neon-border-gold rounded-2xl p-4 mb-2">
              <h2 className="font-bold gradient-text-gold text-base mb-1">Dua Collection</h2>
              <p className="text-xs text-muted-foreground">Authentic supplications · {DUAS.reduce((a,d)=>a+d.count,0)} total</p>
            </div>
            {DUAS.map((d) => (
              <div key={d.cat}>
                <button onClick={()=>setOpenDua(openDua===d.cat?null:d.cat)}
                  className="w-full glass-card rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors text-left"
                  style={{ borderLeft:`3px solid ${d.color}` }}>
                  <span className="text-xl">{d.emoji}</span>
                  <div className="flex-1"><p className="font-semibold text-sm">{d.cat}</p><p className="text-xs text-muted-foreground">{d.count} Duas</p></div>
                  {openDua===d.cat?<ChevronUp className="w-4 h-4 text-muted-foreground"/>:<ChevronRight className="w-4 h-4 text-muted-foreground"/>}
                </button>
                {openDua===d.cat&&(
                  <div className="glass-card rounded-xl mx-2 mt-0.5 p-3 space-y-2">
                    {d.items.map((item,i)=>(
                      <div key={i} className="flex items-start gap-2 py-1.5 border-b border-border last:border-0">
                        <span className="text-neon-gold text-xs mt-0.5">•</span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item}</p>
                      </div>
                    ))}
                    <button className="w-full py-2 rounded-xl text-xs font-semibold mt-1" style={{ background:`${d.color}15`, color:d.color }}>
                      View All {d.count} Duas →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ════ HIJRI CALENDAR ════ */}
        {activeTab === "calendar" && (
          <div className="space-y-4">
            <div className="glass-card neon-border-gold rounded-2xl p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Islamic Date (Approximate)</p>
              <p className="text-4xl font-bold text-neon-gold mb-1">28</p>
              <p className="text-xl font-bold gradient-text-gold mb-1">Safar 1447 AH</p>
              <p className="text-sm text-muted-foreground">{MOCK_PRAYER_TIMES.date}</p>
            </div>
            <div className="glass-card neon-border-gold rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <button className="p-2 rounded-xl hover:bg-muted text-neon-gold">◀</button>
                <h3 className="font-bold gradient-text-gold">Safar 1447 AH</h3>
                <button className="p-2 rounded-xl hover:bg-muted text-neon-gold">▶</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["S","M","T","W","T","F","S"].map((d,i)=>(
                  <span key={`${d}-${i}`} className="text-[10px] text-muted-foreground font-semibold py-1">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {[...Array(3).fill(""), ...Array(29).fill(0).map((_,i)=>i+1)].map((d,i)=>(
                  <button key={i} className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                    d===""?"":d===28?"bg-neon-gold text-black font-bold":d===1?"text-neon-gold border border-neon-gold/30":"hover:bg-muted"
                  }`}>{d}</button>
                ))}
              </div>
            </div>
            <div className="glass-card neon-border-gold rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-neon-gold" /> Upcoming Islamic Events</h3>
              {[
                { name:"Rabi al-Awwal Begins", date:"Oct 2025", note:"Mawlid an-Nabi Month", color:"#FFD700" },
                { name:"Mawlid an-Nabi ﷺ", date:"12 Rabi al-Awwal", note:"Birth of Prophet Muhammad ﷺ", color:"#00FF88" },
                { name:"Rajab Begins", date:"Jan 2026", note:"Sacred Month", color:"#8B5CF6" },
                { name:"Laylat al-Miraj", date:"27 Rajab", note:"Night Journey of the Prophet ﷺ", color:"#00D4FF" },
                { name:"Ramadan 1447 AH", date:"Mar 2026", note:"Month of Fasting", color:"#FF006E" },
              ].map((ev)=>(
                <div key={ev.name} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor:ev.color }} />
                  <div className="flex-1"><p className="font-semibold text-sm">{ev.name}</p><p className="text-xs text-muted-foreground">{ev.note}</p></div>
                  <span className="text-[11px] font-medium flex-shrink-0" style={{ color:ev.color }}>{ev.date}</span>
                </div>
              ))}
            </div>
            <div className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-3">📅 Hijri Months</h3>
              <div className="grid grid-cols-2 gap-2">
                {HIJRI_MONTHS.map((month,i)=>(
                  <div key={month} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted transition-colors">
                    <span className="text-xs text-neon-gold font-bold w-5">{i+1}.</span>
                    <span className="text-xs font-medium">{month}</span>
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
