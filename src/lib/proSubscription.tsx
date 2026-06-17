import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

export const PRO_PLAN_NAME = "BankHub Pro";
export const PRO_PLAN_PRICE_RUPEES = 0;
export const PRO_PLAN_VALIDITY_DAYS = 9999;

export type StoredProSubscription = {
  isPro: boolean;
  planName: string;
  paymentId: string;
  subscriptionStartDate: string;
  subscriptionExpiryDate: string;
};

type ProNotice = {
  kind: "success" | "error" | "info";
  title: string;
  description: string;
};

type ProSubscriptionContextValue = {
  status: "active" | "loading" | "inactive" | "expired";
  paymentStatus: "idle" | "creating_order" | "opening" | "verifying" | "success" | "failed";
  isReady: boolean;
  isPro: boolean;
  subscription: StoredProSubscription | null;
  validUntilLabel: string;
  startDateLabel: string;
  expiryDateLabel: string;
  daysRemaining: number;
  notice: ProNotice | null;
  clearNotice: () => void;
  openCheckout: (source?: string) => Promise<void>;
};

const ProSubscriptionContext = createContext<ProSubscriptionContextValue | null>(null);

const DEFAULT_SUBSCRIPTION: StoredProSubscription = {
  isPro: true,
  planName: PRO_PLAN_NAME,
  paymentId: "lifetime_free",
  subscriptionStartDate: new Date().toISOString(),
  subscriptionExpiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 100).toISOString(),
};

export function ProSubscriptionProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ProSubscriptionContextValue>(() => ({
    status: "active",
    paymentStatus: "idle",
    isReady: true,
    isPro: true,
    subscription: DEFAULT_SUBSCRIPTION,
    validUntilLabel: "Lifetime Free",
    startDateLabel: "-",
    expiryDateLabel: "-",
    daysRemaining: 99999,
    notice: null,
    clearNotice: () => {},
    openCheckout: async () => {},
  }), []);

  return (
    <ProSubscriptionContext.Provider value={value}>
      {children}
    </ProSubscriptionContext.Provider>
  );
}

export function useProSubscription() {
  const context = useContext(ProSubscriptionContext);
  if (!context) {
    throw new Error("useProSubscription must be used within ProSubscriptionProvider.");
  }
  return context;
}
