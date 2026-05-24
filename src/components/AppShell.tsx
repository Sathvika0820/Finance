import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "@tanstack/react-router";
import { AiAssistant } from "@/components/AiAssistant";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen fintech-shell bg-background relative overflow-x-hidden">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-md px-5 pt-7 pb-12"
      >
        {children}
      </motion.main>
      <AiAssistant />
    </div>
  );
}
