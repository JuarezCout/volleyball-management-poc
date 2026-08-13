import { NavLink } from "react-router-dom";
import {
  Home,
  Calendar,
  Vote,
  Star,
  MessageCircle,
  LayoutDashboard,
  Swords,
  Users,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";

const playerTabs = [
  { to: "/player", icon: Home, label: "Início", end: true },
  { to: "/player/events", icon: Calendar, label: "Eventos" },
  { to: "/player/polls", icon: Vote, label: "Votações" },
  { to: "/player/rating", icon: Star, label: "Rating" },
  { to: "/player/feedback", icon: MessageCircle, label: "Feedback" },
];

const captainTabs = [
  { to: "/captain", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/captain/events", icon: Calendar, label: "Jogos" },
  { to: "/captain/teams", icon: Swords, label: "Equipes" },
  { to: "/captain/players", icon: Users, label: "Jogadores" },
  { to: "/captain/ratings", icon: Star, label: "Avaliações" },
];

export function BottomNav() {
  const { role } = useAuth();
  const tabs =
    role === "player" ? playerTabs : role === "captain" ? captainTabs : [];
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
