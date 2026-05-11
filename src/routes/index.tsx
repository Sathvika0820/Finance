import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/dashboard" }), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-dark text-white px-6 relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center shadow-glow">
          <Landmark className="w-12 h-12 text-white" strokeWidth={1.6} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Bank Hub</h1>
          <p className="text-sm text-white/60 mt-2">All Indian banks. One tap away.</p>
        </div>
      </motion.div>
      <div className="absolute bottom-10 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-white/60"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}