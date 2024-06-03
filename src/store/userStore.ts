'use client'
// userStore.ts
import {create} from 'zustand';
interface User {
  _id?: string;
  username?: string;
  isVerified?: boolean;
  isAcceptingMessage?: boolean;
}
interface State {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const userStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
