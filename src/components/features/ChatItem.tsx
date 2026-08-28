import { Mic, Volume2, VolumeX } from "lucide-react";
import type { Chat } from "@/types";

interface Props {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export function ChatItem({ chat, isActive, onClick }: Props) {
  const partner = chat.participants[0];
  const name = chat.isGroup ? chat.groupName : partner?.name;
  const avatar = chat.isGroup ? chat.groupIcon : partner?.avatar;

  const statusIcon = {
    sent: "✓",
    delivered: "✓✓",
    read: <span className="text-neon-cyan text-xs">✓✓</span>,
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors duration-150 ${
        isActive ? "bg-muted border-l-2 border-neon-cyan" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {chat.unreadCount > 0 ? (
          <div className="status-ring">
            <img src={avatar} alt={name ?? ""} className="w-12 h-12 rounded-full block" />
          </div>
        ) : (
          <img src={avatar} alt={name ?? ""} className="w-12 h-12 rounded-full" />
        )}
        {!chat.isGroup && partner?.isOnline && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-neon-green rounded-full border-2 border-background" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-semibold text-sm truncate ${chat.isPinned ? "text-neon-cyan" : ""}`}>
            {name}
            {chat.isGroup && <span className="text-muted-foreground ml-1 text-xs">({chat.participants.length + 1})</span>}
          </span>
          <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">
            {chat.lastMessage?.timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate flex-1">
            {chat.lastMessage?.type === "voice" ? (
              <span className="flex items-center gap-1">
                <Mic className="w-3 h-3 text-neon-purple flex-shrink-0" />
                {chat.lastMessage.content}
              </span>
            ) : (
              <span className="truncate">{chat.lastMessage?.content}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            {chat.isMuted && <VolumeX className="w-3 h-3 text-muted-foreground" />}
            {chat.isPinned && <span className="text-neon-gold text-xs">📌</span>}
            {chat.unreadCount > 0 ? (
              <span className="bg-neon-green text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
              </span>
            ) : (
              chat.lastMessage?.status && (
                <span className="text-[11px]">
                  {statusIcon[chat.lastMessage.status]}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
