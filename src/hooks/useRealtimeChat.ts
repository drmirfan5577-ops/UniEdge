import { useState, useEffect, useRef, useCallback } from "react";
import { supabase, type SupabaseMessage } from "@/lib/supabase";

const DEMO_CHAT_ID = "demo-chat-00000000-0000-0000-0000-000000000001";
const DEMO_USER_ID = "demo-user";

const SEED_MESSAGES: Omit<SupabaseMessage, "id" | "created_at">[] = [
  { chat_id: DEMO_CHAT_ID, sender_id: "partner", content: "Assalamu Alaikum! 👋 Welcome to UniEdge real-time chat!", type: "text", status: "read", is_deleted: false, reactions: [], media_url: null, reply_to: null },
  { chat_id: DEMO_CHAT_ID, sender_id: DEMO_USER_ID, content: "Wa Alaikum Assalam wa Rahmatullahi wa Barakatuh! 🙏", type: "text", status: "read", is_deleted: false, reactions: [], media_url: null, reply_to: null },
  { chat_id: DEMO_CHAT_ID, sender_id: "partner", content: "MashAllah, the real-time backend is connected! 🚀", type: "text", status: "read", is_deleted: false, reactions: [], media_url: null, reply_to: null },
  { chat_id: DEMO_CHAT_ID, sender_id: DEMO_USER_ID, content: "Alhamdulillah! UniEdge is now powered by OnSpace Cloud 💪", type: "text", status: "delivered", is_deleted: false, reactions: [], media_url: null, reply_to: null },
];

export interface LocalMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "doc" | "voice";
  media_url: string | null;
  reply_to: string | null;
  status: "sent" | "delivered" | "read";
  is_deleted: boolean;
  reactions: { emoji: string; user_id: string }[];
  created_at: string;
  starred?: boolean;
  isPending?: boolean;
}

export function useRealtimeChat(chatId: string = DEMO_CHAT_ID) {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load messages — use localStorage as fallback for demo
  const loadMessages = useCallback(async () => {
    const stored = localStorage.getItem(`uniedge-chat-${chatId}`);
    if (stored) {
      const parsed: LocalMessage[] = JSON.parse(stored);
      if (parsed.length > 0) { setMessages(parsed); setIsConnected(true); return; }
    }
    // Seed demo messages
    const seeded: LocalMessage[] = SEED_MESSAGES.map((m, i) => ({
      ...m,
      id: `seed-${i}`,
      sender_id: m.sender_id ?? DEMO_USER_ID,
      created_at: new Date(Date.now() - (SEED_MESSAGES.length - i) * 60000).toISOString(),
    }));
    setMessages(seeded);
    localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(seeded));
    setIsConnected(true);
  }, [chatId]);

  useEffect(() => {
    loadMessages();

    // Try real-time Supabase subscription
    const channel = supabase.channel(`chat:${chatId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        const msg = payload.new as SupabaseMessage;
        const localMsg: LocalMessage = { ...msg, sender_id: msg.sender_id ?? "unknown" };
        setMessages((prev) => {
          if (prev.some((m) => m.id === localMsg.id)) return prev;
          const next = [...prev, localMsg];
          localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(next));
          return next;
        });
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setIsConnected(true);
      });

    channelRef.current = channel;
    return () => { channel.unsubscribe(); };
  }, [chatId, loadMessages]);

  const sendMessage = useCallback(async (content: string, type: LocalMessage["type"] = "text", replyTo?: string) => {
    if (!content.trim() && type === "text") return;
    const tempId = `local-${Date.now()}`;
    const newMsg: LocalMessage = {
      id: tempId,
      chat_id: chatId,
      sender_id: DEMO_USER_ID,
      content,
      type,
      media_url: null,
      reply_to: replyTo ?? null,
      status: "sent",
      is_deleted: false,
      reactions: [],
      created_at: new Date().toISOString(),
      isPending: true,
    };

    setMessages((prev) => {
      const next = [...prev, newMsg];
      localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(next));
      return next;
    });

    // Try insert into Supabase
    const { data, error } = await supabase.from("chat_messages").insert({
      chat_id: chatId,
      sender_id: null, // anonymous for demo
      content,
      type,
      reply_to: replyTo ?? null,
      status: "sent",
    }).select().single();

    if (!error && data) {
      setMessages((prev) => {
        const next = prev.map((m) => m.id === tempId ? { ...data, sender_id: DEMO_USER_ID, isPending: false } : m);
        localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(next));
        return next;
      });
    } else {
      // Mark as delivered locally
      setMessages((prev) => {
        const next = prev.map((m) => m.id === tempId ? { ...m, status: "delivered" as const, isPending: false } : m);
        localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(next));
        return next;
      });
    }

    // Simulate AI reply
    setIsTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "JazakAllah Khair! 🙏 May Allah bless you.",
        "SubhanAllah, that's wonderful! In-sha-Allah.",
        "MashAllah! UniEdge is the best platform 🔥",
        "Alhamdulillah! Keep going, you're doing great 💪",
        "In-sha-Allah, may Allah make it easy for you! 🌟",
        "Barakallah feek! Looking forward to more features.",
        "Allahu Akbar! The future of social media is here 🚀",
      ];
      const reply: LocalMessage = {
        id: `reply-${Date.now()}`,
        chat_id: chatId,
        sender_id: "partner",
        content: replies[Math.floor(Math.random() * replies.length)],
        type: "text",
        media_url: null,
        reply_to: null,
        status: "read",
        is_deleted: false,
        reactions: [],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => {
        const next = [...prev, reply];
        localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(next));
        return next;
      });
    }, 1200 + Math.random() * 1200);
  }, [chatId]);

  const addReaction = useCallback((msgId: string, emoji: string) => {
    setMessages((prev) => {
      const next = prev.map((m) =>
        m.id === msgId
          ? { ...m, reactions: [...m.reactions.filter((r) => r.user_id !== DEMO_USER_ID), { emoji, user_id: DEMO_USER_ID }] }
          : m
      );
      localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(next));
      return next;
    });
  }, [chatId]);

  const toggleStar = useCallback((msgId: string) => {
    setMessages((prev) => {
      const next = prev.map((m) => m.id === msgId ? { ...m, starred: !m.starred } : m);
      localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(next));
      return next;
    });
  }, [chatId]);

  const deleteMessage = useCallback((msgId: string) => {
    setMessages((prev) => {
      const next = prev.filter((m) => m.id !== msgId);
      localStorage.setItem(`uniedge-chat-${chatId}`, JSON.stringify(next));
      return next;
    });
  }, [chatId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(`uniedge-chat-${chatId}`);
  }, [chatId]);

  return { messages, isConnected, isTyping, sendMessage, addReaction, toggleStar, deleteMessage, clearChat };
}
