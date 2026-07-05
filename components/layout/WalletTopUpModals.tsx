"use client";

import { SwitchToProductionModal } from "@/components/layout/SwitchToProductionModal";
import { WalletFundingModal } from "@/components/layout/WalletFundingModal";
import { useUiStore } from "@/store/ui.store";

export function WalletTopUpModals() {
  const walletTopUpModal = useUiStore((state) => state.walletTopUpModal);
  const closeWalletTopUp = useUiStore((state) => state.closeWalletTopUp);
  const confirmSwitchToProduction = useUiStore((state) => state.confirmSwitchToProduction);

  return (
    <>
      <SwitchToProductionModal
        open={walletTopUpModal === "switch-production"}
        onClose={closeWalletTopUp}
        onSwitch={confirmSwitchToProduction}
      />
      <WalletFundingModal
        open={walletTopUpModal === "funding"}
        onClose={closeWalletTopUp}
      />
    </>
  );
}
