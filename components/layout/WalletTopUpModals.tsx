"use client";

import { SwitchToProductionModal } from "@/components/layout/SwitchToProductionModal";
import { WalletFundingModal } from "@/components/layout/WalletFundingModal";
import { useSwitchDomain } from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";
import { useAuthStore } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";

export function WalletTopUpModals() {
  const walletTopUpModal = useUiStore((state) => state.walletTopUpModal);
  const closeWalletTopUp = useUiStore((state) => state.closeWalletTopUp);
  const confirmSwitchToProduction = useUiStore((state) => state.confirmSwitchToProduction);
  const setDomain = useAuthStore((state) => state.setDomain);
  const switchDomainMutation = useSwitchDomain();

  const handleSwitch = async () => {
    try {
      await runAction(() => switchDomainMutation.mutateAsync("production"), {
        success: "Switched to production",
        error: "Could not switch to production",
      });
      setDomain("production");
      confirmSwitchToProduction();
    } catch {
      // Toast already shown by runAction
    }
  };

  return (
    <>
      <SwitchToProductionModal
        open={walletTopUpModal === "switch-production"}
        onClose={closeWalletTopUp}
        onSwitch={() => {
          void handleSwitch();
        }}
      />
      <WalletFundingModal
        open={walletTopUpModal === "funding"}
        onClose={closeWalletTopUp}
      />
    </>
  );
}
