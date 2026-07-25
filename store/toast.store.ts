"use client";

import { create } from "zustand";

export type ToastTone = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  tone: ToastTone;
  message: string;
};

type ToastState = {
  toasts: ToastItem[];
  push: (tone: ToastTone, message: string) => string;
  dismiss: (id: string) => void;
};

const MAX_TOASTS = 4;
const DEFAULT_DURATION_MS = 4200;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (tone, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, tone, message }].slice(-MAX_TOASTS),
    }));
    window.setTimeout(() => {
      get().dismiss(id);
    }, DEFAULT_DURATION_MS);
    return id;
  },
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
