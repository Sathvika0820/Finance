const PRO_PLAN_NAME = "BankHub Pro";
const PRO_PLAN_PRICE_RUPEES = 10;
const PRO_PLAN_VALIDITY_DAYS = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const DB_PATH = ".data/bankhub-pro-subscriptions.json";

type SubscriptionRecord = {
  isPro: boolean;
  planName: string;
  paymentId: string;
  orderId: string;
  profileId: string;
  subscriptionStartDate: string;
  subscriptionExpiryDate: string;
};

type OrderRecord = {
  amount: number;
  createdAt: string;
  currency: "INR";
  orderId: string;
  profileId: string;
  status: "created" | "verified" | "failed";
};

type SubscriptionDb = {
  orders: Record<string, OrderRecord>;
  subscriptions: Record<string, SubscriptionRecord>;
};

type EnvLike = Record<string, unknown> | undefined | null;

const memoryDb: SubscriptionDb = {
  orders: {},
  subscriptions: {},
};

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, {
    headers: {
      "cache-control": "no-store",
      ...(init?.headers || {}),
    },
    ...init,
  });
}

function getEnvValue(env: unknown, key: string) {
  const envRecord = env && typeof env === "object" ? env as EnvLike : null;
  const fromRuntimeEnv = envRecord?.[key];
  if (typeof fromRuntimeEnv === "string" && fromRuntimeEnv.trim()) return fromRuntimeEnv.trim();

  const processEnv = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const fromProcess = processEnv?.[key];
  return typeof fromProcess === "string" && fromProcess.trim() ? fromProcess.trim() : "";
}

function getRazorpayKeys(env: unknown) {
  return {
    keyId: getEnvValue(env, "RAZORPAY_KEY_ID") || getEnvValue(env, "VITE_RAZORPAY_KEY_ID"),
    keySecret: getEnvValue(env, "RAZORPAY_KEY_SECRET"),
  };
}

function describeMissingRazorpayKeys(keyId: string, keySecret: string) {
  const missing = [
    !keyId ? "RAZORPAY_KEY_ID" : "",
    !keySecret ? "RAZORPAY_KEY_SECRET" : "",
  ].filter(Boolean);

  return missing.length
    ? `Razorpay server configuration is missing: ${missing.join(", ")}.`
    : "";
}

function normalizeProfileId(value: unknown) {
  const profileId = String(value || "").trim();
  return /^[A-Za-z0-9_-]{12,80}$/.test(profileId) ? profileId : "";
}

async function readRequestJson(request: Request) {
  try {
    return await request.json() as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function readRequestFields(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return await readRequestJson(request);
  }

  if (
    contentType.includes("application/x-www-form-urlencoded")
    || contentType.includes("multipart/form-data")
  ) {
    try {
      const form = await request.formData();
      return Object.fromEntries(form.entries()) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  return await readRequestJson(request);
}

async function loadFileDb(): Promise<SubscriptionDb | null> {
  try {
    const fs = await import("node:fs/promises");
    const raw = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SubscriptionDb>;
    return {
      orders: parsed.orders || {},
      subscriptions: parsed.subscriptions || {},
    };
  } catch {
    return null;
  }
}

async function saveFileDb(db: SubscriptionDb) {
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.warn("[BankHub Pro] database file save failed; using memory store fallback", error);
  }
}

async function readDb(): Promise<SubscriptionDb> {
  const fileDb = await loadFileDb();
  if (!fileDb) return memoryDb;
  memoryDb.orders = fileDb.orders;
  memoryDb.subscriptions = fileDb.subscriptions;
  return memoryDb;
}

async function writeDb(db: SubscriptionDb) {
  memoryDb.orders = db.orders;
  memoryDb.subscriptions = db.subscriptions;
  await saveFileDb(db);
}

function getSubscriptionStatus(subscription: SubscriptionRecord | undefined) {
  if (!subscription) return "inactive";
  const expiryTime = new Date(subscription.subscriptionExpiryDate).getTime();
  if (!subscription.isPro || Number.isNaN(expiryTime)) return "inactive";
  return expiryTime > Date.now() ? "active" : "expired";
}

function publicSubscription(subscription: SubscriptionRecord | undefined) {
  const status = getSubscriptionStatus(subscription);
  if (!subscription) {
    return { isPro: false, status, subscription: null };
  }

  return {
    isPro: status === "active",
    status,
    subscription: {
      isPro: status === "active",
      planName: subscription.planName,
      paymentId: subscription.paymentId,
      subscriptionStartDate: subscription.subscriptionStartDate,
      subscriptionExpiryDate: subscription.subscriptionExpiryDate,
    },
  };
}

function buildSubscriptionRecord(profileId: string, paymentId: string, orderId: string) {
  const now = new Date();
  return {
    isPro: true,
    planName: PRO_PLAN_NAME,
    paymentId,
    orderId,
    profileId,
    subscriptionStartDate: now.toISOString(),
    subscriptionExpiryDate: new Date(now.getTime() + PRO_PLAN_VALIDITY_DAYS * DAY_IN_MS).toISOString(),
  } satisfies SubscriptionRecord;
}

function base64(value: string) {
  const btoaFn = (globalThis as typeof globalThis & { btoa?: (input: string) => string }).btoa;
  if (btoaFn) return btoaFn(value);
  return Buffer.from(value, "utf8").toString("base64");
}

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(secret: string, message: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return bufferToHex(signature);
}

function timingSafeEqualHex(a: string, b: string) {
  if (!/^[a-f0-9]+$/i.test(a) || !/^[a-f0-9]+$/i.test(b)) return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
}

async function createRazorpayOrder(request: Request, env: unknown) {
  const body = await readRequestJson(request);
  const profileId = normalizeProfileId(body.profileId);
  const returnPath = String(body.returnPath || "").trim();
  const { keyId, keySecret } = getRazorpayKeys(env);

  console.info("[BankHub Pro] order creation requested", {
    profileId,
    amount: PRO_PLAN_PRICE_RUPEES * 100,
    hasKeyId: Boolean(keyId),
    hasKeySecret: Boolean(keySecret),
  });

  if (!profileId) {
    return json({ ok: false, message: "Invalid profile id." }, { status: 400 });
  }

  if (!keyId || !keySecret) {
    const message = describeMissingRazorpayKeys(keyId, keySecret);
    console.error("[BankHub Pro] order creation failed: Razorpay keys missing", {
      hasKeyId: Boolean(keyId),
      hasKeySecret: Boolean(keySecret),
      message,
    });
    return json({ ok: false, message }, { status: 500 });
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      authorization: `Basic ${base64(`${keyId}:${keySecret}`)}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      amount: PRO_PLAN_PRICE_RUPEES * 100,
      currency: "INR",
      receipt: `bh_${Date.now()}_${profileId.slice(0, 10)}`,
      notes: {
        planName: PRO_PLAN_NAME,
        profileId,
        validity: `${PRO_PLAN_VALIDITY_DAYS} days`,
      },
    }),
  });

  const payload = await response.json().catch(() => null) as { id?: string; error?: { description?: string } } | null;
  const orderId = payload?.id || "";

  console.info("[BankHub Pro] order creation result", {
    profileId,
    orderId,
    status: response.status,
    ok: response.ok,
    error: payload?.error?.description || "",
  });

  if (!response.ok || !orderId) {
    return json({ ok: false, message: payload?.error?.description || "Order creation failed." }, { status: 502 });
  }

  const db = await readDb();
  db.orders[orderId] = {
    amount: PRO_PLAN_PRICE_RUPEES * 100,
    createdAt: new Date().toISOString(),
    currency: "INR",
    orderId,
    profileId,
    status: "created",
  };
  await writeDb(db);

  return json({
    ok: true,
    keyId,
    orderId,
    amount: PRO_PLAN_PRICE_RUPEES * 100,
    currency: "INR",
    planName: PRO_PLAN_NAME,
    callbackUrl: `${new URL(request.url).origin}/api/pro/payment-callback?profileId=${encodeURIComponent(profileId)}&returnPath=${encodeURIComponent(returnPath.startsWith("/") ? returnPath : "/dashboard")}`,
  });
}

async function verifyRazorpayPayment(request: Request, env: unknown) {
  const body = await readRequestFields(request);
  const profileId = normalizeProfileId(body.profileId);
  const paymentId = String(body.razorpay_payment_id || "").trim();
  const orderId = String(body.razorpay_order_id || "").trim();
  const signature = String(body.razorpay_signature || "").trim();
  const { keySecret } = getRazorpayKeys(env);

  console.info("[BankHub Pro] payment success callback received by backend", {
    profileId,
    payment_id: paymentId,
    order_id: orderId,
    has_signature: Boolean(signature),
  });

  if (!profileId || !paymentId || !orderId || !signature) {
    console.error("[BankHub Pro] signature verification failed: missing required payment fields", {
      profileId,
      payment_id: paymentId,
      order_id: orderId,
      has_signature: Boolean(signature),
    });
    return json({ ok: false, message: "Verification Failed" }, { status: 400 });
  }

  if (!keySecret) {
    const message = describeMissingRazorpayKeys("configured", keySecret);
    console.error("[BankHub Pro] signature verification failed: secret key missing", { message });
    return json({ ok: false, message: "Verification Failed" }, { status: 500 });
  }

  const db = await readDb();
  const order = db.orders[orderId];
  if (!order || order.profileId !== profileId) {
    console.error("[BankHub Pro] signature verification failed: order profile mismatch", {
      profileId,
      order_id: orderId,
      orderProfileId: order?.profileId || "missing",
    });
    return json({ ok: false, message: "Verification Failed" }, { status: 400 });
  }

  const expectedSignature = await hmacSha256Hex(keySecret, `${orderId}|${paymentId}`);
  const verified = timingSafeEqualHex(expectedSignature, signature);

  console.info("[BankHub Pro] signature verification result", {
    payment_id: paymentId,
    order_id: orderId,
    verification_result: verified ? "verified" : "failed",
  });

  if (!verified) {
    db.orders[orderId] = { ...order, status: "failed" };
    await writeDb(db);
    return json({ ok: false, message: "Verification Failed" }, { status: 400 });
  }

  const subscription = buildSubscriptionRecord(profileId, paymentId, orderId);

  db.orders[orderId] = { ...order, status: "verified" };
  db.subscriptions[profileId] = subscription;
  await writeDb(db);

  console.info("[BankHub Pro] premium activation result", {
    payment_id: paymentId,
    order_id: orderId,
    profileId,
    premium_active: true,
    expiry: subscription.subscriptionExpiryDate,
  });

  return json({
    ok: true,
    message: "Premium Activated",
    ...publicSubscription(subscription),
  });
}

function appendQueryValue(path: string, key: string, value: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

function getSafeReturnPath(input: string) {
  const value = String(input || "").trim();
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

async function handlePaymentCallback(request: Request, env: unknown) {
  const url = new URL(request.url);
  const profileId = normalizeProfileId(url.searchParams.get("profileId"));
  const returnPath = getSafeReturnPath(url.searchParams.get("returnPath") || "/dashboard");
  const body = await readRequestFields(request);

  console.info("[BankHub Pro] callback URL invoked", {
    method: request.method.toUpperCase(),
    profileId,
    returnPath,
    payment_id: String(body.razorpay_payment_id || "").trim(),
    order_id: String(body.razorpay_order_id || "").trim(),
    has_signature: Boolean(String(body.razorpay_signature || "").trim()),
  });

  if (!profileId) {
    const invalidTarget = appendQueryValue(returnPath, "proPayment", "verification_failed");
    return Response.redirect(new URL(invalidTarget, url.origin), 302);
  }

  const verificationRequest = new Request(url.toString(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      profileId,
      razorpay_payment_id: body.razorpay_payment_id,
      razorpay_order_id: body.razorpay_order_id,
      razorpay_signature: body.razorpay_signature,
    }),
  });

  const verificationResponse = await verifyRazorpayPayment(verificationRequest, env);
  let redirectTarget = returnPath;

  if (verificationResponse.ok) {
    const payload = await verificationResponse.clone().json().catch(() => null) as { subscription?: { paymentId?: string } } | null;
    redirectTarget = appendQueryValue(redirectTarget, "proPayment", "success");
    if (payload?.subscription?.paymentId) {
      redirectTarget = appendQueryValue(redirectTarget, "paymentId", payload.subscription.paymentId);
    }
  } else {
    redirectTarget = appendQueryValue(redirectTarget, "proPayment", "verification_failed");
  }

  return Response.redirect(new URL(redirectTarget, url.origin), 302);
}

async function getPremiumStatus(request: Request) {
  const url = new URL(request.url);
  const profileId = normalizeProfileId(url.searchParams.get("profileId"));

  if (!profileId) {
    return json({ ok: false, isPro: false, status: "inactive", subscription: null }, { status: 400 });
  }

  const db = await readDb();
  const subscription = db.subscriptions[profileId];
  const publicStatus = publicSubscription(subscription);

  if (subscription && publicStatus.status === "expired" && subscription.isPro) {
    db.subscriptions[profileId] = { ...subscription, isPro: false };
    await writeDb(db);
  }

  console.info("[BankHub Pro] premium status fetched", {
    profileId,
    status: publicStatus.status,
    payment_id: subscription?.paymentId || "",
    order_id: subscription?.orderId || "",
  });

  return json({ ok: true, ...publicStatus });
}

export async function handleProSubscriptionApi(request: Request, env: unknown) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  try {
    if (url.pathname === "/api/pro/create-order" && method === "POST") {
      return await createRazorpayOrder(request, env);
    }
    if (url.pathname === "/api/pro/verify-payment" && method === "POST") {
      return await verifyRazorpayPayment(request, env);
    }
    if (url.pathname === "/api/pro/status" && method === "GET") {
      return await getPremiumStatus(request);
    }
    if (url.pathname === "/api/pro/payment-callback" && (method === "POST" || method === "GET")) {
      return await handlePaymentCallback(request, env);
    }
  } catch (error) {
    console.error("[BankHub Pro] API error", {
      path: url.pathname,
      method,
      error,
    });
    return json({ ok: false, message: "Payment verification service error." }, { status: 500 });
  }

  return json({ ok: false, message: "Not found" }, { status: 404 });
}
