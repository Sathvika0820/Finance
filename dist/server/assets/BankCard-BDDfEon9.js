import { V as jsxRuntimeExports } from "./server-C_uSFjLe.js";
import { c as createLucideIcon, a as cjsExports } from "./landmark-DIQBLidJ.js";
import { u as useNavigate } from "./router-BZ6dAzIz.js";
import { u as useFavorites, B as BankLogo, E as ExternalLink, H as Heart, p as pushRecent } from "./BottomNav-CKff3Ait.js";
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function SearchBar({ value, onChange, placeholder = "Search banks…" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        className: "w-full glass shadow-soft rounded-2xl pl-12 pr-12 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40 transition"
      }
    ),
    value && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => onChange(""),
        className: "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted text-muted-foreground",
        "aria-label": "Clear search",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
      }
    )
  ] });
}
function openOfficial(bank) {
  pushRecent(bank.id);
  if (typeof window !== "undefined") {
    window.open(bank.website, "_blank", "noopener,noreferrer");
  }
}
function BankCard({ bank, index = 0 }) {
  const navigate = useNavigate();
  const { toggle, isFavorite } = useFavorites();
  const isFav = isFavorite(bank.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    cjsExports.motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: Math.min(index, 10) * 0.03 },
      className: "glass shadow-soft rounded-2xl flex items-center gap-3 active:scale-[0.99] transition-transform",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => openOfficial(bank),
            className: "flex items-center gap-3 flex-1 min-w-0 p-4 text-left",
            "aria-label": `Open ${bank.name} official website`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BankLogo, { bank }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate text-[15px]", children: bank.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                  " ",
                  bank.category
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              toggle(bank.id);
            },
            "aria-label": `${isFav ? "Remove from" : "Add to"} favorites`,
            className: `p-4 transition-colors ${isFav ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${isFav ? "fill-current" : ""}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              navigate({ to: "/banks/$bankId", params: { bankId: bank.id } });
            },
            "aria-label": `View ${bank.name} details`,
            className: "p-4 text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4" })
          }
        )
      ]
    }
  );
}
function BankTile({ bank }) {
  const { toggle, isFavorite } = useFavorites();
  const isFav = isFavorite(bank.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass shadow-soft rounded-2xl p-4 flex flex-col items-center gap-2 min-w-[110px] relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => openOfficial(bank),
        className: "flex flex-col items-center gap-2",
        "aria-label": `Open ${bank.name} official website`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BankLogo, { bank, size: "lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-foreground text-center line-clamp-1", children: bank.shortName })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: (e) => {
          e.stopPropagation();
          toggle(bank.id);
        },
        "aria-label": `${isFav ? "Remove from" : "Add to"} favorites`,
        className: `absolute top-2 right-2 p-1.5 rounded-lg transition-colors ${isFav ? "text-red-500 hover:text-red-600 bg-white/80" : "text-muted-foreground hover:text-foreground bg-white/60"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-3.5 h-3.5 ${isFav ? "fill-current" : ""}` })
      }
    )
  ] });
}
export {
  BankCard as B,
  SearchBar as S,
  BankTile as a
};
