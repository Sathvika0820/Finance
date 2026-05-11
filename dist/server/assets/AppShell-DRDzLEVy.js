import { V as jsxRuntimeExports } from "./server-C_uSFjLe.js";
import { a as cjsExports } from "./landmark-DIQBLidJ.js";
import { b as useLocation, c as BottomNav } from "./BottomNav-CKff3Ait.js";
function AppShell({ children }) {
  const location = useLocation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background relative overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed inset-0 -z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -left-24 w-80 h-80 rounded-full bg-foreground/5 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-foreground/5 blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      cjsExports.motion.main,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
        className: "mx-auto max-w-md px-5 pt-7 pb-32",
        children
      },
      location.pathname
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
export {
  AppShell as A
};
