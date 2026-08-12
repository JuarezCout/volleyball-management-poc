import { useState, type ReactNode } from "react";
import { Menu, Bell, ChevronDown, LogOut, User, CircleDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { clsx } from "clsx";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden sm:flex h-full flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((p) => !p)}
        />
      </div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64">
            <Sidebar collapsed={false} onToggle={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            {title && (
              <h1 className="text-base font-semibold text-slate-800 hidden sm:block">
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Role switcher hint */}
            <span
              className={clsx(
                "hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border",
                role === "admin"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : role === "captain"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200",
              )}
            >
              <CircleDot size={12} />
              {role === "admin"
                ? "Admin Geral"
                : role === "captain"
                  ? "Capitão"
                  : "Jogador"}
            </span>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Avatar name={user.name} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className="hidden sm:block text-slate-400"
                  />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-40">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate("/");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User size={16} />
                        Trocar perfil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 sm:pb-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
