import { V as jsxRuntimeExports, r as reactExports } from "./server-C_uSFjLe.js";
import { u as useNavigate, B as BANKS, L as Link, C as CATEGORIES } from "./router-BZ6dAzIz.js";
import { c as createLucideIcon, a as cjsExports } from "./landmark-DIQBLidJ.js";
import { S as SearchBar, B as BankCard, a as BankTile } from "./BankCard-BDDfEon9.js";
import { a as useRecent } from "./BottomNav-CKff3Ait.js";
import { A as AppShell } from "./AppShell-DRDzLEVy.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function Dashboard() {
  const [query, setQuery] = reactExports.useState("");
  const navigate = useNavigate();
  const recentIds = useRecent();
  const recent = reactExports.useMemo(() => recentIds.map((id) => BANKS.find((b) => b.id === id)).filter(Boolean), [recentIds]);
  const featured = reactExports.useMemo(() => ["sbi", "hdfc", "icici", "axis", "kotak", "bob"].map((id) => BANKS.find((b) => b.id === id)), []);
  const results = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return BANKS.filter((b) => b.name.toLowerCase().includes(q) || b.shortName.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-7", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Welcome to" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight mt-1", children: "Bank Hub" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(cjsExports.motion.div, { whileTap: {
        scale: 0.92
      }, className: "w-11 h-11 rounded-2xl gradient-dark flex items-center justify-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, { value: query, onChange: setQuery }),
    results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-2", children: results.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BankCard, { bank: b, index: i }, b.id)) }),
    results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(cjsExports.motion.button, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, onClick: () => navigate({
        to: "/banks"
      }), className: "w-full text-left rounded-3xl gradient-dark p-6 text-white shadow-glow relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-white/60", children: "Discover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-semibold mt-2 leading-tight", children: [
          "Browse ",
          BANKS.length,
          "+ Indian banks in one place"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 inline-flex items-center gap-2 text-sm font-medium", children: [
          "Explore now ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Featured banks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/banks", className: "text-xs text-muted-foreground", children: "See all" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1", children: featured.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(BankTile, { bank: b }, b.id)) })
      ] }),
      recent.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-3", children: "Recently viewed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recent.map((b, i) => b && /* @__PURE__ */ jsxRuntimeExports.jsx(BankCard, { bank: b, index: i }, b.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-3", children: "Categories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: CATEGORIES.map((cat) => {
          const count = BANKS.filter((b) => b.category === cat).length;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/banks", search: {
            category: cat
          }, className: "glass shadow-soft rounded-2xl p-4 active:scale-95 transition-transform", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: cat }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              count,
              " banks"
            ] })
          ] }, cat);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bank Hub does not store any banking credentials." }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {}) });
export {
  SplitComponent as component
};
