"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";

/** True after Zustand persist has rehydrated from storage (avoids auth-guard flash). */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const api = useAuthStore.persist;
    if (!api) {
      setHydrated(true);
      return;
    }

    setHydrated(api.hasHydrated());
    return api.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  return hydrated;
}
