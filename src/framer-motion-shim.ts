import * as React from "react";

const motionOnlyProps = new Set([
  "animate",
  "custom",
  "exit",
  "initial",
  "layout",
  "layoutId",
  "transition",
  "variants",
  "viewport",
  "whileFocus",
  "whileHover",
  "whileInView",
  "whileTap",
]);

function stripMotionProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!motionOnlyProps.has(key)) {
      domProps[key] = value;
    }
  }
  return domProps;
}

export const motion = new Proxy(
  {},
  {
    get(_target, tag: string) {
      return React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) =>
        React.createElement(tag, { ...stripMotionProps(props), ref }),
      );
    },
  },
) as Record<string, React.ComponentType<Record<string, unknown>>>;

export function AnimatePresence({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
