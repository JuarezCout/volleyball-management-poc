import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Shield,
  CreditCard,
  Star,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  CircleDot,
  Home,
  History,
  UserCircle,
  Swords,
  ClipboardList,
  Vote,
  MessageCircle,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Eventos", icon: Calendar },
  { to: "/admin/polls", label: "Enquetes", icon: Vote },
  { to: "/admin/groups", label: "Grupos", icon: Shield },
  { to: "/admin/players", label: "Jogadores", icon: Users },
  { to: "/admin/payments", label: "Pagamentos", icon: CreditCard },
  { to: "/admin/ratings", label: "Ratings", icon: Star },
  { to: "/admin/feedbacks", label: "Feedbacks", icon: MessageCircle },
  { to: "/admin/communication", label: "Comunicação", icon: MessageSquare },
  { to: "/admin/settings", label: "Configurações", icon: Settings },
];

const captainLinks = [
  { to: "/captain", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/captain/events", label: "Meus Jogos", icon: Calendar },
  { to: "/captain/teams", label: "Equipes", icon: Swords },
  { to: "/captain/players", label: "Jogadores", icon: Users },
  { to: "/captain/ratings", label: "Avaliações", icon: Star },
  { to: "/captain/communication", label: "Comunicação", icon: MessageSquare },
];

const playerLinks = [
  { to: "/player", label: "Início", icon: Home, end: true },
  { to: "/player/events", label: "Eventos", icon: Calendar },
  { to: "/player/polls", label: "Votações", icon: Vote },
  { to: "/player/my-games", label: "Meus Jogos", icon: ClipboardList },
  { to: "/player/rating", label: "Meu Rating", icon: Star },
  { to: "/player/history", label: "Histórico", icon: History },
  { to: "/player/feedback", label: "Feedback", icon: MessageCircle },
  { to: "/player/profile", label: "Perfil", icon: UserCircle },
];

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    role === "admin"
      ? adminLinks
      : role === "captain"
        ? captainLinks
        : playerLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      className={clsx(
        "flex flex-col h-full bg-slate-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-5 border-b border-slate-800",
          collapsed && "justify-center",
        )}
      >
        <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <CircleDot size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-white text-sm leading-tight">
              VoleiClub
            </p>
            <p className="text-slate-400 text-xs">Gestão</p>
          </div>
        )}
      </div>

      {/* User */}
      {!collapsed && user && (
        <div className="mx-3 my-3 p-3 bg-slate-800 rounded-xl flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {role === "admin"
                ? "Admin Geral"
                : role === "captain"
                  ? "Capitão"
                  : "Jogador"}
            </p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
                collapsed && "justify-center",
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-slate-800 space-y-0.5">
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? "Expandir" : "Recolher"}
        >
          <ChevronLeft
            size={18}
            className={clsx("transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && "Recolher"}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && "Sair da POC"}
        </button>
      </div>
    </aside>
  );
}
