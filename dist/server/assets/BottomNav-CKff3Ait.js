import { c as createLucideIcon, L as Landmark } from "./landmark-DIQBLidJ.js";
import { O as useRouter, r as reactExports, V as jsxRuntimeExports } from "./server-C_uSFjLe.js";
import { l as logoUrl, L as Link } from "./router-BZ6dAzIz.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$2 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$1);
const __iconNode = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "r6nss1"
    }
  ]
];
const House = createLucideIcon("house", __iconNode);
const sizes = {
  sm: "w-10 h-10 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
  xl: "w-24 h-24 text-2xl"
};
function BankLogo({ bank, size = "md" }) {
  const [errored, setErrored] = reactExports.useState(false);
  const initials = bank.shortName.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase();
  if (errored) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `${sizes[size]} rounded-2xl bg-gradient-to-br ${bank.accent} text-white font-bold flex items-center justify-center shadow-soft shrink-0`,
        "aria-hidden": true,
        children: initials
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `${sizes[size]} rounded-2xl bg-white shadow-soft shrink-0 overflow-hidden flex items-center justify-center border border-border/60`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: logoUrl(bank.logoDomain),
          alt: `${bank.name} logo`,
          loading: "lazy",
          onError: () => setErrored(true),
          className: "w-full h-full object-contain p-1.5"
        }
      )
    }
  );
}
const KEY = "bankhub:favorites";
const RECENT_KEY = "bankhub:recent";
function read(key) {
  if (typeof window === "undefined") return [];
  try {
    const v = window.localStorage.getItem(key);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}
function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`bankhub:${key}`));
}
function useFavorites() {
  const [ids, setIds] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setIds(read(KEY));
    const handler = () => setIds(read(KEY));
    window.addEventListener(`bankhub:${KEY}`, handler);
    return () => window.removeEventListener(`bankhub:${KEY}`, handler);
  }, []);
  const toggle = reactExports.useCallback((id) => {
    const cur = read(KEY);
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    write(KEY, next);
  }, []);
  const remove = reactExports.useCallback((id) => {
    write(KEY, read(KEY).filter((x) => x !== id));
  }, []);
  const isFavorite = reactExports.useCallback((id) => ids.includes(id), [ids]);
  return { ids, toggle, remove, isFavorite };
}
function pushRecent(id) {
  if (typeof window === "undefined") return;
  const cur = read(RECENT_KEY).filter((x) => x !== id);
  const next = [id, ...cur].slice(0, 6);
  write(RECENT_KEY, next);
}
function useRecent() {
  const [ids, setIds] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setIds(read(RECENT_KEY));
    const handler = () => setIds(read(RECENT_KEY));
    window.addEventListener(`bankhub:${RECENT_KEY}`, handler);
    return () => window.removeEventListener(`bankhub:${RECENT_KEY}`, handler);
  }, []);
  return ids;
}
const items = [
  { to: "/dashboard", label: "Home", icon: House },
  { to: "/banks", label: "Banks", icon: Landmark },
  { to: "/favorites", label: "Favorites", icon: Heart }
];
function BottomNav() {
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md glass shadow-glow rounded-3xl flex items-center justify-around py-2 pointer-events-auto", children: items.map(({ to, label, icon: Icon }) => {
    const active = location.pathname === to || location.pathname.startsWith(to + "/");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        className: "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `p-2 rounded-xl transition-all ${active ? "bg-foreground text-background" : "text-muted-foreground"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5", strokeWidth: 2.2 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-[10px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`,
              children: label
            }
          )
        ]
      },
      to
    );
  }) }) });
}
export {
  BankLogo as B,
  ExternalLink as E,
  Heart as H,
  useRecent as a,
  useLocation as b,
  BottomNav as c,
  pushRecent as p,
  useFavorites as u
};
