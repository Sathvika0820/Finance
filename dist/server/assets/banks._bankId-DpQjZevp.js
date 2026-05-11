import { r as reactExports, V as jsxRuntimeExports } from "./server-C_uSFjLe.js";
import { a as Route, L as Link } from "./router-BZ6dAzIz.js";
import { c as createLucideIcon, a as cjsExports } from "./landmark-DIQBLidJ.js";
import { u as useFavorites, p as pushRecent, H as Heart, B as BankLogo, E as ExternalLink, c as BottomNav } from "./BottomNav-CKff3Ait.js";
import { C as ChevronLeft } from "./chevron-left-BE41Xhx1.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$1);
const __iconNode = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode);
function BankDetail() {
  const {
    bank
  } = Route.useLoaderData();
  const {
    isFavorite,
    toggle
  } = useFavorites();
  const fav = isFavorite(bank.id);
  reactExports.useEffect(() => {
    pushRecent(bank.id);
  }, [bank.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-gradient-to-br ${bank.accent} text-white px-5 pt-6 pb-20 rounded-b-[2.5rem] relative overflow-hidden`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/banks", className: "p-2 -ml-2 rounded-xl bg-white/10 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(bank.id), "aria-label": "Favorite", className: "p-2.5 rounded-xl bg-white/10 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-5 h-5 ${fav ? "fill-white" : ""}` }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(cjsExports.motion.div, { initial: {
        opacity: 0,
        y: 14
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "mt-8 flex flex-col items-center text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BankLogo, { bank, size: "xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-5 text-2xl font-bold leading-tight", children: bank.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs uppercase tracking-widest text-white/70", children: bank.category })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mt-12 mx-5 space-y-4 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass shadow-glow rounded-3xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 leading-relaxed", children: bank.description }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: bank.website, target: "_blank", rel: "noopener noreferrer", className: "bg-foreground text-background rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: "Open Website" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 opacity-70" })
        ] }),
        bank.appLink && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: bank.appLink, target: "_blank", rel: "noopener noreferrer", className: "glass shadow-soft rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: "Open Banking App" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4 opacity-70" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass shadow-soft rounded-3xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold mb-3", children: "Services offered" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: bank.services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 text-sm text-foreground/80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) }),
          s
        ] }, s)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  BankDetail as component
};
