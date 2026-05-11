import { V as jsxRuntimeExports } from "./server-C_uSFjLe.js";
import { B as BANKS, L as Link } from "./router-BZ6dAzIz.js";
import { c as createLucideIcon, a as cjsExports } from "./landmark-DIQBLidJ.js";
import { u as useFavorites, H as Heart, B as BankLogo, E as ExternalLink, p as pushRecent } from "./BottomNav-CKff3Ait.js";
import { A as AppShell } from "./AppShell-DRDzLEVy.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function FavoritesPage() {
  const {
    ids,
    remove
  } = useFavorites();
  const favs = ids.map((id) => BANKS.find((b) => b.id === id)).filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Favorites" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Your saved banks, ready in one tap." })
    ] }),
    favs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass shadow-soft rounded-3xl p-10 flex flex-col items-center text-center mt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-7 h-7 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mt-4", children: "No favorites yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-[16rem]", children: "Tap the heart on any bank to save it here for quick access." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/banks", className: "mt-6 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium", children: "Browse banks" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(cjsExports.AnimatePresence, { mode: "popLayout", children: /* @__PURE__ */ jsxRuntimeExports.jsx(cjsExports.motion.div, { layout: true, className: "space-y-2", children: favs.map((b, i) => b ? /* @__PURE__ */ jsxRuntimeExports.jsxs(cjsExports.motion.div, { layout: true, initial: {
      opacity: 0,
      y: 10
    }, animate: {
      opacity: 1,
      y: 0
    }, exit: {
      opacity: 0,
      x: -20
    }, transition: {
      delay: i * 0.03
    }, className: "glass shadow-soft rounded-2xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        pushRecent(b.id);
        window.open(b.website, "_blank", "noopener,noreferrer");
      }, className: "flex items-center gap-3 flex-1 min-w-0 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BankLogo, { bank: b }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold truncate text-[15px]", children: b.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
            " ",
            b.category
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(b.id), "aria-label": "Remove favorite", className: "p-2 rounded-xl hover:bg-muted text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
    ] }, b.id) : null) }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FavoritesPage, {}) });
export {
  SplitComponent as component
};
