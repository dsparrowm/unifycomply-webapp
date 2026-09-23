import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SettingsAppState = {
  selectedAppIdByTenant: Record<string, string>;
  setSelectedAppId: (tenantId: string, appId: string) => void;
};

export const useSettingsAppStore = create<SettingsAppState>()(
  persist(
    (set) => ({
      selectedAppIdByTenant: {},
      setSelectedAppId: (tenantId, appId) =>
        set((state) => ({
          selectedAppIdByTenant: {
            ...state.selectedAppIdByTenant,
            [tenantId]: appId,
          },
        })),
    }),
    {
      name: "unifycomply-settings-app",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      partialize: (state) => ({
        selectedAppIdByTenant: state.selectedAppIdByTenant,
      }),
    },
  ),
);
