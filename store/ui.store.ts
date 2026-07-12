import { create } from "zustand";

export type AppEnvironment = "sandbox" | "production";
export type WalletTopUpModal = "closed" | "switch-production" | "funding";

type UiState = {
  environment: AppEnvironment;
  setEnvironment: (environment: AppEnvironment) => void;
  walletTopUpModal: WalletTopUpModal;
  requestWalletTopUp: () => void;
  closeWalletTopUp: () => void;
  confirmSwitchToProduction: () => void;
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiState>((set, get) => ({
  environment: "sandbox",
  setEnvironment: (environment) => set({ environment }),
  walletTopUpModal: "closed",
  requestWalletTopUp: () => {
    const { environment } = get();
    set({
      walletTopUpModal: environment === "sandbox" ? "switch-production" : "funding",
    });
  },
  closeWalletTopUp: () => set({ walletTopUpModal: "closed" }),
  confirmSwitchToProduction: () =>
    set({ environment: "production", walletTopUpModal: "funding" }),
  sidebarOpen: false,
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
