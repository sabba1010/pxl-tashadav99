import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export interface AppSettings {
  registrationFee: number;
  depositRate: number;    // NGN per 1 USD for deposits
  withdrawRate: number;   // NGN per 1 USD for withdrawals
  buyerDepositRate: number;
  sellerWithdrawalRate: number;
  ngnToUsdRate: number;   // alias for depositRate (legacy)
}

const DEFAULT_SETTINGS: AppSettings = {
  registrationFee: 15,
  depositRate: 1500,
  withdrawRate: 1400,
  buyerDepositRate: 0,
  sellerWithdrawalRate: 0,
  ngnToUsdRate: 1500,
};

/**
 * useSettings — fetches global platform settings from the admin-controlled API.
 * Admin can change depositRate / withdrawRate; all users see the updated rate automatically.
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/settings`);
        const data = await res.json();
        if (data.success && data.settings) {
          const s = data.settings;
          setSettings({
            registrationFee: s.registrationFee ?? DEFAULT_SETTINGS.registrationFee,
            depositRate: s.depositRate ?? s.ngnToUsdRate ?? DEFAULT_SETTINGS.depositRate,
            withdrawRate: s.withdrawRate ?? DEFAULT_SETTINGS.withdrawRate,
            buyerDepositRate: s.buyerDepositRate ?? DEFAULT_SETTINGS.buyerDepositRate,
            sellerWithdrawalRate: s.sellerWithdrawalRate ?? DEFAULT_SETTINGS.sellerWithdrawalRate,
            ngnToUsdRate: s.depositRate ?? s.ngnToUsdRate ?? DEFAULT_SETTINGS.ngnToUsdRate,
          });
        }
      } catch (err) {
        console.error("useSettings: failed to fetch settings", err);
        setError("Failed to load platform settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
