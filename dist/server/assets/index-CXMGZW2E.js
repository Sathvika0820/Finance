import { r as reactExports, V as jsxRuntimeExports } from "./server-C_uSFjLe.js";
import { u as useNavigate } from "./router-BZ6dAzIz.js";
import { a as cjsExports, L as Landmark } from "./landmark-DIQBLidJ.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function Splash() {
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const t = setTimeout(() => navigate({
      to: "/dashboard"
    }), 1600);
    return () => clearTimeout(t);
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center gradient-dark text-white px-6 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(cjsExports.motion.div, { initial: {
      scale: 0.8,
      opacity: 0
    }, animate: {
      scale: 1,
      opacity: 1
    }, transition: {
      duration: 0.6,
      ease: "easeOut"
    }, className: "flex flex-col items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Landmark, { className: "w-12 h-12 text-white", strokeWidth: 1.6 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Bank Hub" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60 mt-2", children: "All Indian banks. One tap away." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-10 flex gap-1.5", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(cjsExports.motion.span, { className: "w-2 h-2 rounded-full bg-white/60", animate: {
      opacity: [0.3, 1, 0.3]
    }, transition: {
      duration: 1.2,
      repeat: Infinity,
      delay: i * 0.2
    } }, i)) })
  ] });
}
export {
  Splash as component
};
