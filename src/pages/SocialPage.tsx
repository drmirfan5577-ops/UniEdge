import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, Plus, Phone, Video, MoreVertical, Send, Smile, Paperclip, Mic,
  ArrowLeft, CheckCheck, Reply, Star, Forward, Trash2, X, Users, Wifi,
  WifiOff, Shield, Image as ImageIcon, FileText, Lock, Edit3
} from "lucide-react";
import { ChatItem } from "@/components/features/ChatItem";
import { MOCK_CHATS, MOCK_STATUSES, MOCK_USERS } from "@/constants/mockData";
import { useRealtimeChat, type LocalMessage } from "@/hooks/useRealtimeChat";
import type { Chat } from "@/types";

type SocialTab = "chats" | "updates" | "communities" | "calls";
const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "✨", "💯", "🕌"];

export default function SocialPage() {
  const [socialTab, setSocialTab] = useState<SocialTab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<LocalMessage | null>(null);
  const [contextMsg, setContextMsg] = useState<LocalMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isConnected, isTyping, sendMessage, addReaction, toggleStar, deleteMessage, clearChat } = useRealtimeChat();

  const SOCIAL_TABS: { id: SocialTab; label: string; emoji: string }[] = [
    { id: "chats", label: "Chats", emoji: "💬" },
    { id: "updates", label: "Updates", emoji: "🔵" },
    { id: "communities", label: "Communities", emoji: "👥" },
    { id: "calls", label: "Calls", emoji: "📞" },
  ];

  const filteredChats = MOCK_CHATS.filter((c) => {
    const name = c.isGroup ? c.groupName : c.participants[0]?.name;
    return !searchQuery || name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    sendMessage(message.trim(), "text", replyTo?.id);
    setMessage("");
    setReplyTo(null);
    setShowEmojiPicker(false);
  }, [message, replyTo, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (activeChat) {
    const partner = activeChat.participants[0];
    const name = activeChat.isGroup ? activeChat.groupName : partner?.name;
    const avatar = activeChat.isGroup ? activeChat.groupIcon : partner?.avatar;

    return (
      <div className="flex flex-col h-screen">
        {/* Chat Header */}
        <div className="glass-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setActiveChat(null)} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-neon-cyan" />
          </button>
          <div className="status-ring">
            <img src={avatar} alt={name ?? ""} className="w-9 h-9 rounded-full block" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm truncate">{name}</p>
              {isConnected ? (
                <div className="flex items-center gap-1 text-[10px] text-neon-green flex-shrink-0">
                  <Wifi className="w-2.5 h-2.5" /> Live
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] text-neon-gold flex-shrink-0">
                  <WifiOff className="w-2.5 h-2.5" /> Local
                </div>
              )}
            </div>
            <p className="text-xs text-neon-green">
              {isTyping ? (
                <span className="text-neon-cyan animate-pulse">✍ Typing...</span>
              ) : (
                activeChat.isGroup ? `${activeChat.participants.length + 1} members` :
                partner?.isOnline ? "🟢 Online" : `Last seen recently`
              )}
            </p>
          </div>
          <div className="flex gap-1">
            <button className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
              <Phone className="w-4 h-4 text-neon-green" />
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
              <Video className="w-4 h-4 text-neon-cyan" />
            </button>
            <button
              onClick={clearChat}
              className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Backend status banner */}
        <div className={`px-4 py-1.5 text-xs flex items-center gap-1.5 ${isConnected ? "bg-neon-green/10 text-neon-green" : "bg-neon-gold/10 text-neon-gold"}`}>
          {isConnected ? <><Wifi className="w-3 h-3" /> OnSpace Cloud Connected — Messages sync in real-time</> : <><WifiOff className="w-3 h-3" /> Offline mode — Messages saved locally</>}
        </div>

        {/* Context Menu */}
        {contextMsg && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pb-4" onClick={() => setContextMsg(null)}>
            <div className="glass-card neon-border-cyan rounded-2xl p-4 w-64 space-y-3 mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-around">
                {EMOJI_LIST.map((em) => (
                  <button key={em} onClick={() => { addReaction(contextMsg.id, em); setContextMsg(null); }} className="text-xl hover:scale-125 transition-transform">
                    {em}
                  </button>
                ))}
              </div>
              <div className="border-t border-border pt-2 space-y-1">
                <button onClick={() => { setReplyTo(contextMsg); setContextMsg(null); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted text-sm">
                  <Reply className="w-4 h-4 text-neon-cyan" /> Reply
                </button>
                <button onClick={() => { toggleStar(contextMsg.id); setContextMsg(null); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted text-sm">
                  <Star className={`w-4 h-4 ${contextMsg.starred ? "text-neon-gold fill-neon-gold" : "text-muted-foreground"}`} />
                  {contextMsg.starred ? "Unstar" : "Star"} Message
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted text-sm">
                  <Forward className="w-4 h-4 text-neon-purple" /> Forward
                </button>
                {contextMsg.sender_id === "demo-user" && (
                  <button onClick={() => { deleteMessage(contextMsg.id); setContextMsg(null); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-400/10 text-sm text-red-400">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5"
          style={{ paddingBottom: replyTo ? "130px" : "90px" }}>
          <div className="text-center mb-2">
            <span className="text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> End-to-end encrypted · AES-256
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender_id === "demo-user";
            const replyOriginal = msg.reply_to ? messages.find((m) => m.id === msg.reply_to) : null;
            const time = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} group`}>
                <div className={`max-w-[78%] space-y-1 ${isMe ? "items-end" : "items-start"} flex flex-col`}
                  onContextMenu={(e) => { e.preventDefault(); setContextMsg(msg); }}>
                  {replyOriginal && (
                    <div className={`px-3 py-1.5 rounded-t-xl rounded-b text-xs border-l-2 border-neon-cyan bg-muted/60 max-w-full ${isMe ? "self-end" : "self-start"}`}>
                      <p className="text-neon-cyan font-semibold text-[10px]">{replyOriginal.sender_id === "demo-user" ? "You" : name}</p>
                      <p className="text-muted-foreground truncate max-w-[200px]">{replyOriginal.content}</p>
                    </div>
                  )}
                  <div className={`px-4 py-2.5 text-sm cursor-pointer active:scale-[0.98] transition-transform ${
                    isMe ? "bubble-sent text-white" : "bubble-received text-foreground"
                  } ${msg.starred ? "ring-1 ring-neon-gold/50" : ""} ${msg.isPending ? "opacity-70" : ""}`}>
                    <p className="leading-relaxed break-words">{msg.content}</p>
                    {msg.reactions.length > 0 && (
                      <div className="flex gap-0.5 mt-1 flex-wrap">
                        {[...new Set(msg.reactions.map((r) => r.emoji))].map((em) => {
                          const count = msg.reactions.filter((r) => r.emoji === em).length;
                          return (
                            <span key={em} className="text-sm bg-black/20 rounded-full px-1.5 py-0.5">
                              {em}{count > 1 ? ` ${count}` : ""}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <div className={`flex items-center gap-1 mt-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
                      {msg.starred && <Star className="w-2.5 h-2.5 text-neon-gold fill-neon-gold" />}
                      <span className="text-[10px] opacity-60">{time}</span>
                      {isMe && (
                        <CheckCheck className={`w-3.5 h-3.5 ${
                          msg.status === "read" ? "text-neon-cyan" :
                          msg.status === "delivered" ? "text-white/70" : "text-white/40"
                        }`} />
                      )}
                    </div>
                  </div>

                  {/* Quick reaction on hover */}
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${isMe ? "justify-end" : "justify-start"}`}>
                    {["👍","❤️","🔥"].map((em) => (
                      <button key={em} onClick={() => addReaction(msg.id, em)}
                        className="text-sm w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center hover:scale-110 transition-transform">
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bubble-received px-4 py-3">
                <div className="flex gap-1 items-end">
                  {[0,1,2].map((i) => (
                    <span key={i} className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply preview */}
        {replyTo && (
          <div className="glass-card border-t border-neon-cyan/20 px-4 py-2 flex items-center gap-2">
            <div className="flex-1 min-w-0 pl-3 border-l-2 border-neon-cyan">
              <p className="text-[11px] text-neon-cyan font-semibold">{replyTo.sender_id === "demo-user" ? "You" : name}</p>
              <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-muted-foreground hover:text-foreground p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="glass-card border-t border-border px-3 py-2">
            <div className="flex flex-wrap gap-1">
              {["😀","😂","😍","🥰","😎","🤩","😭","😱","🙏","🔥","💯","❤️","💪","🚀","✨","🌟","🕌","📖","🤲","💎","👑","🎯","⚡","🌍"].map((em) => (
                <button key={em} onClick={() => { setMessage((m) => m + em); setShowEmojiPicker(false); inputRef.current?.focus(); }}
                  className="text-lg w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center hover:scale-110 transition-transform">
                  {em}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="glass-card border-t border-border px-3 py-3 flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-3 py-2 border border-border focus-within:ring-2 focus-within:ring-primary/50">
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <Smile className={`w-5 h-5 ${showEmojiPicker ? "text-neon-gold" : "text-muted-foreground"}`} />
          </button>
          {message.trim() ? (
            <button onClick={handleSend} className="w-10 h-10 rounded-xl btn-glow-cyan flex items-center justify-center flex-shrink-0">
              <Send className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button className="w-10 h-10 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center hover:bg-neon-purple/30 transition-colors flex-shrink-0">
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-card border-b border-border sticky top-0 z-30 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <div>
              <h1 className="font-display font-bold text-xl gradient-text-cyan">Social</h1>
              <div className="flex items-center gap-1 text-[10px]">
                {isConnected ? (
                  <><span className="w-1.5 h-1.5 bg-neon-green rounded-full" /><span className="text-neon-green">OnSpace Cloud Live</span></>
                ) : (
                  <><span className="w-1.5 h-1.5 bg-neon-gold rounded-full" /><span className="text-neon-gold">Offline Mode</span></>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-xl hover:bg-muted transition-colors">
              <Edit3 className="w-5 h-5 text-neon-cyan" />
            </button>
          </div>
        </div>
        {showSearch && (
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}
        <div className="flex gap-1">
          {SOCIAL_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setSocialTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                socialTab === tab.id ? "btn-glow-cyan text-black" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {/* Chats */}
        {socialTab === "chats" && (
          <div>
            {/* Encryption banner */}
            <div className="px-4 py-2 bg-neon-green/5 border-b border-neon-green/10 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-neon-green" />
              <span className="text-[11px] text-neon-green">All messages are end-to-end encrypted with AES-256</span>
            </div>
            {filteredChats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} isActive={false}
                onClick={() => setActiveChat(chat)} />
            ))}
            {filteredChats.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">No chats found</p>
              </div>
            )}
          </div>
        )}

        {/* Updates */}
        {socialTab === "updates" && (
          <div className="px-4 py-4">
            <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wide">Recent Updates — 24h Stories</p>
            <div className="space-y-3">
              {MOCK_STATUSES.map((status) => (
                <div key={status.id} className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.005] transition-all">
                  <div className="flex items-center gap-3 p-3">
                    <div className="status-ring">
                      <img src={status.user.avatar} alt={status.user.name} className="w-12 h-12 rounded-full block" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{status.user.name}</p>
                      <p className="text-xs text-muted-foreground">{status.timestamp} · 👁 {status.viewCount} views</p>
                    </div>
                    <button className="p-1 rounded-xl hover:bg-muted"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                  {status.type === "image" && status.mediaUrl && (
                    <img src={status.mediaUrl} alt="" className="w-full h-44 object-cover" />
                  )}
                  {status.type === "text" && (
                    <div className="h-36 flex items-center justify-center px-6 text-center" style={{ background: status.bgColor }}>
                      <p className="text-white font-bold text-base drop-shadow-lg leading-relaxed">{status.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="mt-4 w-full glass-card neon-border-cyan rounded-2xl p-4 flex items-center gap-3 hover:bg-muted transition-colors">
              <div className="w-12 h-12 rounded-full gradient-bg-primary flex items-center justify-center flex-shrink-0 shadow-neon-cyan">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Add to Updates</p>
                <p className="text-xs text-muted-foreground">Share photos, videos, or text. Disappears in 24h.</p>
              </div>
            </button>
          </div>
        )}

        {/* Communities */}
        {socialTab === "communities" && (
          <div className="px-4 py-4 space-y-3">
            <div className="glass-card neon-border-cyan rounded-2xl p-4 mb-2">
              <h3 className="font-semibold text-sm mb-1 gradient-text-cyan">Discover Communities</h3>
              <p className="text-xs text-muted-foreground">Connect with like-minded people worldwide</p>
            </div>
            {[
              { name: "UniEdge Official 🚀", members: "128K", icon: "https://i.pravatar.cc/40?img=5", desc: "Official announcements & updates", color: "#00D4FF" },
              { name: "Islamic Circle 🕌", members: "45K", icon: "https://i.pravatar.cc/40?img=7", desc: "Islamic knowledge & discussions", color: "#FFD700" },
              { name: "Tech Innovators ⚡", members: "23K", icon: "https://i.pravatar.cc/40?img=9", desc: "Latest in technology & AI", color: "#8B5CF6" },
              { name: "Global Muslims 🌍", members: "112K", icon: "https://i.pravatar.cc/40?img=11", desc: "Ummah worldwide", color: "#00FF88" },
              { name: "Creators Hub 🎥", members: "34K", icon: "https://i.pravatar.cc/40?img=14", desc: "Content creators & tips", color: "#FF006E" },
            ].map((c) => (
              <div key={c.name} className="glass-card rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-muted transition-colors" style={{ borderLeft: `3px solid ${c.color}` }}>
                <img src={c.icon} alt={c.name} className="w-12 h-12 rounded-2xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.desc}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: c.color }}><Users className="w-2.5 h-2.5 inline mr-0.5" />{c.members} members</p>
                </div>
                <button className="px-3 py-1.5 rounded-full btn-glow-cyan text-black text-xs font-bold flex-shrink-0">Join</button>
              </div>
            ))}
          </div>
        )}

        {/* Calls */}
        {socialTab === "calls" && (
          <div className="px-4 py-4 space-y-2">
            <div className="flex gap-2 mb-3">
              <button className="flex-1 py-2 rounded-xl btn-glow-cyan text-black text-xs font-bold">All Calls</button>
              <button className="flex-1 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-medium">Missed</button>
            </div>
            {MOCK_USERS.slice(0, 6).map((user, i) => (
              <div key={user.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {i % 3 === 0 ? "📥 Incoming" : i % 3 === 1 ? "📤 Outgoing" : "📵 Missed"} · {i === 0 ? "Just now" : i === 1 ? "Today, 9:12 AM" : "Yesterday"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-full bg-neon-green/20 text-neon-green flex items-center justify-center hover:bg-neon-green/30 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center hover:bg-neon-cyan/30 transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
