import { Link, useLocation } from "@tanstack/react-router";
import { Home, Landmark, Heart } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/banks", label: "Banks", icon: Landmark },
  { to: "/favorites", label: "Favorites", icon: Heart },
] as const;

export function BottomNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2 pointer-events-none">
      <div className="mx-auto max-w-md glass shadow-glow rounded-3xl flex items-center justify-around py-2 pointer-events-auto">
        {items.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors"
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  active ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}