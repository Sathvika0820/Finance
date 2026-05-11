import { V as jsxRuntimeExports } from "./server-C_uSFjLe.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const SplitErrorComponent = ({
  error,
  reset
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: error.message }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "text-sm underline", children: "Try again" })
] });
export {
  SplitErrorComponent as errorComponent
};
