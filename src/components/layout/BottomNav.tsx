import { NavLink } from "react-router-dom";
import { Home, Calendar } from "lucide-react";
import { clsx } from "clsx";

const playerTabs = [
  { to: "/player", icon: Home, label: "Início", end: true },
  { to: "/player/events", icon: Calendar, label: "Eventos" },
];

export function BottomNav() {
  const tabs = playerTabs;
  if (!tabs.length) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 flex sm:hidden safe-area-pb">
      {tabs.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            clsx(
              "flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-xs font-medium transition-colors",
              isActive ? "text-primary-600" : "text-slate-400",
            )
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
