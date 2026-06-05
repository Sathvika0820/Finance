import { Link, useLocation } from "@tanstack/react-router";
import { Home, Landmark, Heart } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const items = [
  { to: "/dashboard", labelKey: "home", icon: Home },
  { to: "/banks", labelKey: "banks", icon: Landmark },
  { to: "/favorites", labelKey: "favorites", icon: Heart },
] as const;

export function BottomNav() {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2 pointer-events-none">
      <div className="mx-auto max-w-md glass shadow-glow rounded-[22px] flex items-center justify-around py-2 pointer-events-auto border border-white/50">
        {items.map(({ to, labelKey, icon: Icon }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors"
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  active ? "fintech-button" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {t(labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
