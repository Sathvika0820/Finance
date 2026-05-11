import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-foreground/5 blur-3xl" />
      </div>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-md px-5 pt-7 pb-32"
      >
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}