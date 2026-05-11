import { V as jsxRuntimeExports, r as reactExports } from "./server-C_uSFjLe.js";
import { R as Route, B as BANKS, L as Link, C as CATEGORIES } from "./router-BZ6dAzIz.js";
import { c as createLucideIcon, a as cjsExports } from "./landmark-DIQBLidJ.js";
import { S as SearchBar, B as BankCard } from "./BankCard-BDDfEon9.js";
import { A as AppShell } from "./AppShell-DRDzLEVy.js";
import { C as ChevronLeft } from "./chevron-left-BE41Xhx1.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./BottomNav-CKff3Ait.js";
const __iconNode = [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
];
const ArrowUpDown = createLucideIcon("arrow-up-down", __iconNode);
function BanksPage() {
  const {
    category
  } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = reactExports.useState("");
  const [sortAsc, setSortAsc] = reactExports.useState(true);
  const filtered = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = BANKS.filter((b) => {
      const matchesQ = !q || b.name.toLowerCase().includes(q) || b.shortName.toLowerCase().includes(q);
      const matchesCat = !category || b.category === category;
      return matchesQ && matchesCat;
    });
    list = [...list].sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    return list;
  }, [query, category, sortAsc]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "p-2 -ml-2 rounded-xl hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold", children: "All Banks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSortAsc((s) => !s), className: "p-2 rounded-xl hover:bg-muted", "aria-label": "Sort", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-5 h-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, { value: query, onChange: setQuery }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: !category, onClick: () => navigate({
        search: {}
      }), label: "All" }),
      CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: category === cat, onClick: () => navigate({
        search: {
          category: cat
        }
      }), label: cat }, cat))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      filtered.length,
      " bank",
      filtered.length === 1 ? "" : "s"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(cjsExports.AnimatePresence, { mode: "popLayout", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(cjsExports.motion.div, { layout: true, className: "space-y-2", children: [
      filtered.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BankCard, { bank: b, index: i }, b.id)),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-12", children: "No banks match your search." })
    ] }) })
  ] });
}
function FilterChip({
  active,
  onClick,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: `shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${active ? "bg-foreground text-background shadow-soft" : "glass text-muted-foreground"}`, children: label });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BanksPage, {}) });
export {
  SplitComponent as component
};
