import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const MOCK_ME: User = {
  id: "me",
  name: "Dr. M Irfan",
  subName: "UniEdge Founder",
  title: "Admin",
  avatar: "https://i.pravatar.cc/150?img=1",
  isVerified: true,
  isOnline: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: MOCK_ME,
      isLoggedIn: true,
      login: (user) => set({ currentUser: user, isLoggedIn: true }),
      logout: () => set({ currentUser: null, isLoggedIn: false }),
    }),
    { name: "uniedge-auth" }
  )
);
