import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { getCurrentStoredLanguage, translate } from "@/lib/i18n";

export const PRO_PLAN_NAME = "BankHub Pro";
export const PRO_PLAN_PRICE_RUPEES = 10;
export const PRO_PLAN_VALIDITY_DAYS = 30;

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const PRO_STORAGE_EVENT = "bankhub:pro-subscription-sync";
const RAZORPAY_SCRIPT_ID = "bankhub-razorpay-checkout";
const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const PROFILE_STORAGE_KEY = "bankHubProProfileId";

const STORAGE_KEYS = {
  isPro: "isPro",
  planName: "planName",
  paymentId: "paymentId",
  subscriptionStartDate: "subscriptionStartDate",
  subscriptionExpiryDate: "subscriptionExpiryDate",
} as const;

type NoticeKind = "success" | "error" | "info";
type SubscriptionStatus = "loading" | "inactive" | "active" | "expired";
type PaymentStatus = "idle" | "creating_order" | "opening" | "verifying" | "success" | "failed";

type RazorpaySuccessPayload = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

type RazorpayFailurePayload = {
  error?: {
    description?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
};

type RazorpayOptions = {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (payload: RazorpaySuccessPayload) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  retry?: {
    enabled: boolean;
    max_count?: number;
  };
  callback_url?: string;
  redirect?: boolean;
};

type RazorpayInstance = {
  on?: (eventName: "payment.failed", handler: (payload: RazorpayFailurePayload) => void) => void;
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export type StoredProSubscription = {
  isPro: boolean;
  planName: string;
  paymentId: string;
  subscriptionStartDate: string;
  subscriptionExpiryDate: string;
};

type CreateOrderResponse = {
  ok: boolean;
  keyId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  callbackUrl?: string;
  message?: string;
};

type PremiumStatusResponse = {
  ok: boolean;
  isPro: boolean;
  status: SubscriptionStatus;
  subscription: StoredProSubscription | null;
  message?: string;
};

type ProNotice = {
  kind: NoticeKind;
  title: string;
  description: string;
};

type ProSubscriptionContextValue = {
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
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

function t(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const language = getCurrentStoredLanguage();
  const translated = translate(language, key);
  return translated === key ? fallback : translated;
}

function formatDateLabel(value: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function getDaysRemaining(expiryDate: string) {
  if (!expiryDate) return 0;
  const expiry = new Date(expiryDate).getTime();
  if (Number.isNaN(expiry)) return 0;
  const remaining = expiry - Date.now();
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / DAY_IN_MS);
}

function getOrCreateProfileId() {
  if (typeof window === "undefined") return null;

  const existing = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (existing) return existing;

  const nextProfileId = crypto.randomUUID?.() || `profile_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(PROFILE_STORAGE_KEY, nextProfileId);
  return nextProfileId;
}

function writeStoredSubscription(subscription: StoredProSubscription) {
  window.localStorage.setItem(STORAGE_KEYS.isPro, subscription.isPro ? "true" : "false");
  window.localStorage.setItem(STORAGE_KEYS.planName, subscription.planName);
  window.localStorage.setItem(STORAGE_KEYS.paymentId, subscription.paymentId);
  window.localStorage.setItem(STORAGE_KEYS.subscriptionStartDate, subscription.subscriptionStartDate);
  window.localStorage.setItem(STORAGE_KEYS.subscriptionExpiryDate, subscription.subscriptionExpiryDate);
}

function clearStoredSubscription() {
  window.localStorage.setItem(STORAGE_KEYS.isPro, "false");
  window.localStorage.removeItem(STORAGE_KEYS.paymentId);
  window.localStorage.removeItem(STORAGE_KEYS.subscriptionStartDate);
  window.localStorage.removeItem(STORAGE_KEYS.subscriptionExpiryDate);
  window.localStorage.setItem(STORAGE_KEYS.planName, PRO_PLAN_NAME);
}

function markStoredSubscriptionExpired(subscription: StoredProSubscription) {
  writeStoredSubscription({ ...subscription, isPro: false });
}

async function fetchPremiumStatus(profileId: string): Promise<PremiumStatusResponse> {
  const response = await fetch(`/api/pro/status?profileId=${encodeURIComponent(profileId)}`, {
    headers: { accept: "application/json" },
  });
  const payload = await response.json().catch(() => null) as PremiumStatusResponse | null;
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message || "Premium status could not be fetched.");
  }
  return payload;
}

async function createPaymentOrder(profileId: string, source: string): Promise<CreateOrderResponse> {
  const returnPath = typeof window !== "undefined"
    ? `${window.location.pathname}${window.location.search}`
    : "/dashboard";
  console.info("[BankHub Pro] order creation requested", { profileId, source });
  const response = await fetch("/api/pro/create-order", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({ profileId, source, returnPath }),
  });
  const payload = await response.json().catch(() => null) as CreateOrderResponse | null;
  console.info("[BankHub Pro] order creation response", {
    profileId,
    order_id: payload?.orderId || "",
    ok: response.ok && Boolean(payload?.ok),
    status: response.status,
    message: payload?.message || "",
  });
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message || "Order creation failed.");
  }
  return payload;
}

async function verifyPaymentOnBackend(profileId: string, payload: RazorpaySuccessPayload): Promise<PremiumStatusResponse> {
  console.info("[BankHub Pro] payment success callback received", {
    profileId,
    payment_id: payload.razorpay_payment_id || "",
    order_id: payload.razorpay_order_id || "",
    has_signature: Boolean(payload.razorpay_signature),
  });
  const response = await fetch("/api/pro/verify-payment", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      profileId,
      razorpay_payment_id: payload.razorpay_payment_id,
      razorpay_order_id: payload.razorpay_order_id,
      razorpay_signature: payload.razorpay_signature,
    }),
  });
  const verification = await response.json().catch(() => null) as PremiumStatusResponse | null;
  console.info("[BankHub Pro] signature verification response", {
    profileId,
    payment_id: payload.razorpay_payment_id || "",
    order_id: payload.razorpay_order_id || "",
    verification_result: response.ok && Boolean(verification?.ok) ? "verified" : "failed",
    premium_active: Boolean(verification?.isPro),
    message: verification?.message || "",
  });
  if (!response.ok || !verification?.ok || !verification.isPro || !verification.subscription) {
    throw new Error(verification?.message || "Verification Failed");
  }
  return verification;
}

let razorpayScriptPromise: Promise<void> | null = null;

function ensureRazorpayLoaded() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout is only available in the browser."));
  }

  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Razorpay checkout failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay checkout failed to load."));
    document.body.appendChild(script);
  }).catch((error) => {
    razorpayScriptPromise = null;
    throw error;
  });

  return razorpayScriptPromise;
}

function broadcastProSync() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PRO_STORAGE_EVENT));
}

export function ProSubscriptionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>("loading");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [subscription, setSubscription] = useState<StoredProSubscription | null>(null);
  const [notice, setNotice] = useState<ProNotice | null>(null);
  const expiryToastRef = useRef<string>("");

  const clearNotice = useCallback(() => setNotice(null), []);

  const applyVerifiedStatus = useCallback((payload: PremiumStatusResponse) => {
    if (!payload.subscription) {
      clearStoredSubscription();
      setSubscription(null);
      setStatus(payload.status === "expired" ? "expired" : "inactive");
      return;
    }

    const nextStatus = payload.status;
    if (nextStatus === "expired" && payload.subscription.isPro) {
      markStoredSubscriptionExpired(payload.subscription);
      const expiredNotice = {
        kind: "error" as const,
        title: t("subscription.messages.expiredTitle", "Your Pro Subscription has expired."),
        description: t("subscription.messages.expiredDescription", "Renew for ₹10."),
      };
      setNotice(expiredNotice);
      if (expiryToastRef.current !== payload.subscription.subscriptionExpiryDate) {
        expiryToastRef.current = payload.subscription.subscriptionExpiryDate;
        toast.error(expiredNotice.title, { description: expiredNotice.description });
      }
      setSubscription({ ...payload.subscription, isPro: false });
      setStatus("expired");
      return;
    }

    if (nextStatus === "active") {
      writeStoredSubscription(payload.subscription);
    } else {
      clearStoredSubscription();
    }
    setSubscription(payload.subscription);
    setStatus(nextStatus);
  }, []);

  const syncFromBackend = useCallback(async () => {
    const profileId = getOrCreateProfileId();
    if (!profileId) {
      setSubscription(null);
      setStatus("inactive");
      return;
    }

    try {
      const payload = await fetchPremiumStatus(profileId);
      console.info("[BankHub Pro] startup premium status restored", {
        profileId,
        status: payload.status,
        payment_id: payload.subscription?.paymentId || "",
        premium_active: payload.isPro,
      });
      applyVerifiedStatus(payload);
    } catch (error) {
      console.error("[BankHub Pro] startup premium status fetch failed", error);
      clearStoredSubscription();
      setSubscription(null);
      setStatus("inactive");
    }
  }, [applyVerifiedStatus]);

  const consumePaymentRedirect = useCallback(async () => {
    if (typeof window === "undefined") return false;

    const url = new URL(window.location.href);
    const proPayment = url.searchParams.get("proPayment");
    if (!proPayment) return false;

    const profileId = getOrCreateProfileId();
    url.searchParams.delete("proPayment");
    url.searchParams.delete("paymentId");
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);

    if (!profileId) return true;

    if (proPayment === "success") {
      try {
        const payload = await fetchPremiumStatus(profileId);
        applyVerifiedStatus(payload);
        setPaymentStatus(payload.isPro ? "success" : "failed");
        if (payload.isPro) {
          const successNotice = {
            kind: "success" as const,
            title: t("subscription.messages.successTitle", "Payment Successful"),
            description: t("subscription.messages.premiumActivated", "Premium Activated"),
          };
          setNotice(successNotice);
          toast.success(successNotice.title, { description: successNotice.description });
          broadcastProSync();
        }
      } catch (error) {
        console.error("[BankHub Pro] payment redirect success could not restore premium status", error);
      }
      return true;
    }

    const verificationNotice = {
      kind: "error" as const,
      title: t("subscription.messages.verificationFailedTitle", "Verification Failed"),
      description: t("subscription.messages.verificationFailedDescription", "Payment was received, but premium activation could not be verified. Please try again."),
    };
    setPaymentStatus("failed");
    setNotice(verificationNotice);
    toast.error(verificationNotice.title, { description: verificationNotice.description });
    return true;
  }, [applyVerifiedStatus]);

  useEffect(() => {
    void (async () => {
      const consumedRedirect = await consumePaymentRedirect();
      if (!consumedRedirect) {
        await syncFromBackend();
      }
    })();
  }, [consumePaymentRedirect, syncFromBackend]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageSync = () => void syncFromBackend();
    window.addEventListener(PRO_STORAGE_EVENT, handleStorageSync);
    window.addEventListener("storage", handleStorageSync);
    return () => {
      window.removeEventListener(PRO_STORAGE_EVENT, handleStorageSync);
      window.removeEventListener("storage", handleStorageSync);
    };
  }, [syncFromBackend]);

  const openCheckout = useCallback(async (source = "dashboard") => {
    if (typeof window === "undefined") return;

    const profileId = getOrCreateProfileId();
    if (!profileId) {
      const errorNotice = {
        kind: "error" as const,
        title: t("subscription.messages.unavailableTitle", "Payment Failed"),
        description: t("subscription.messages.unavailableDescription", "Razorpay checkout is not configured."),
      };
      setPaymentStatus("failed");
      setNotice(errorNotice);
      toast.error(errorNotice.title, { description: errorNotice.description });
      return;
    }

    try {
      setPaymentStatus("creating_order");
      const order = await createPaymentOrder(profileId, source);
      if (!order.keyId || !order.orderId || !order.amount || !order.currency || !order.callbackUrl) {
        throw new Error(order.message || "Order creation failed.");
      }

      setPaymentStatus("opening");
      await ensureRazorpayLoaded();

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout is unavailable.");
      }

      let settled = false;
      const razorpay = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: PRO_PLAN_NAME,
        description: t("subscription.checkout.description", "BankHub Pro subscription for 30 days"),
        notes: {
          planName: PRO_PLAN_NAME,
          validity: `${PRO_PLAN_VALIDITY_DAYS} days`,
          source,
        },
        theme: {
          color: "#004958",
        },
        retry: {
          enabled: true,
          max_count: 2,
        },
        callback_url: order.callbackUrl,
        redirect: true,
        handler: async (payload) => {
          settled = true;
          setPaymentStatus("verifying");
          try {
            const verifiedStatus = await verifyPaymentOnBackend(profileId, payload);
            applyVerifiedStatus(verifiedStatus);
            setPaymentStatus("success");
            broadcastProSync();

            const successNotice = {
              kind: "success" as const,
              title: t("subscription.messages.successTitle", "Payment Successful"),
              description: t("subscription.messages.premiumActivated", "Premium Activated"),
            };
            console.info("[BankHub Pro] premium activation result", {
              profileId,
              payment_id: payload.razorpay_payment_id || "",
              order_id: payload.razorpay_order_id || "",
              premium_active: true,
            });
            setNotice(successNotice);
            toast.success(successNotice.title, { description: successNotice.description });
          } catch (error) {
            console.error("[BankHub Pro] verification failed after payment success", {
              profileId,
              payment_id: payload.razorpay_payment_id || "",
              order_id: payload.razorpay_order_id || "",
              error,
            });
            setPaymentStatus("failed");
            const verificationNotice = {
              kind: "error" as const,
              title: t("subscription.messages.verificationFailedTitle", "Verification Failed"),
              description: t("subscription.messages.verificationFailedDescription", "Payment was received, but premium activation could not be verified. Please try again."),
            };
            setNotice(verificationNotice);
            toast.error(verificationNotice.title, { description: verificationNotice.description });
          }
        },
        modal: {
          ondismiss: () => {
            if (!settled) setPaymentStatus("idle");
          },
        },
      });

      razorpay.on?.("payment.failed", (payload) => {
        settled = true;
        console.error("[BankHub Pro] payment failure callback received", {
          profileId,
          payment_id: payload.error?.metadata?.payment_id || "",
          order_id: payload.error?.metadata?.order_id || order.orderId,
          reason: payload.error?.reason || "",
          description: payload.error?.description || "",
        });
        const failedNotice = {
          kind: "error" as const,
          title: t("subscription.messages.failedTitle", "Payment Failed"),
          description: t("subscription.messages.failedDescription", "Please Try Again"),
        };
        setPaymentStatus("failed");
        setNotice(failedNotice);
        toast.error(failedNotice.title, { description: failedNotice.description });
      });

      razorpay.open();
    } catch (error) {
      console.error("BankHub Pro checkout failed", error);
      const failedNotice = {
        kind: "error" as const,
        title: t("subscription.messages.failedTitle", "Payment Failed"),
        description: t("subscription.messages.checkoutLoadDescription", "Please Try Again"),
      };
      setPaymentStatus("failed");
      setNotice(failedNotice);
      toast.error(failedNotice.title, { description: failedNotice.description });
    }
  }, []);

  const value = useMemo<ProSubscriptionContextValue>(() => {
    const expiryDateLabel = formatDateLabel(subscription?.subscriptionExpiryDate || "");
    const startDateLabel = formatDateLabel(subscription?.subscriptionStartDate || "");

    return {
      status,
      paymentStatus,
      isReady: status !== "loading",
      isPro: status === "active",
      subscription,
      validUntilLabel: expiryDateLabel,
      startDateLabel,
      expiryDateLabel,
      daysRemaining: getDaysRemaining(subscription?.subscriptionExpiryDate || ""),
      notice,
      clearNotice,
      openCheckout,
    };
  }, [clearNotice, notice, openCheckout, paymentStatus, status, subscription]);

  return <ProSubscriptionContext.Provider value={value}>{children}</ProSubscriptionContext.Provider>;
}

export function useProSubscription() {
  const context = useContext(ProSubscriptionContext);
  if (!context) {
    throw new Error("useProSubscription must be used within ProSubscriptionProvider.");
  }
  return context;
}
