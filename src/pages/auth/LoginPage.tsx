import { useNavigate } from "react-router-dom";
import {
  CircleDot,
  Shield,
  Star,
  User,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_PROFILES } from "@/mock";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (userId: string, role: string) => {
    login(userId);
    if (role === "admin") navigate("/admin");
    else if (role === "captain") navigate("/captain");
    else navigate("/player");
  };

  const profiles = [
    {
      ...MOCK_PROFILES[0],
      icon: <Shield size={28} className="text-blue-500" />,
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      badge: "bg-blue-100 text-blue-700",
      description:
        "Acesso completo ao clube. Dashboard geral, grupos, jogadores, eventos, pagamentos e relatórios.",
    },
    {
      ...MOCK_PROFILES[1],
      icon: <Trophy size={28} className="text-purple-500" />,
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
      badge: "bg-purple-100 text-purple-700",
      description:
        "Carlos Oliveira — Terça-feira Intermediário. Gere eventos, equipes e avalia jogadores.",
    },
    {
      ...MOCK_PROFILES[2],
      icon: <User size={28} className="text-emerald-500" />,
      color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
      badge: "bg-emerald-100 text-emerald-700",
      description:
        "João Silva — Rating 8.2. Vê eventos, inscreve-se, paga e acompanha o seu progresso.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CircleDot size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white">VoleiClub</h1>
        <p className="text-slate-400 text-sm mt-1.5">
          Plataforma de Gestão de Clube
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <p className="text-center text-slate-400 text-sm mb-5">
          Seleciona um perfil para explorar a plataforma
        </p>

        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleSelect(profile.id, profile.role)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-150 group ${profile.color}`}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm flex-shrink-0">
                {profile.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-800">{profile.label}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${profile.badge}`}
                  >
                    {profile.name}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {profile.description}
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-slate-400 group-hover:translate-x-1 transition-transform mt-1 flex-shrink-0"
              />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-slate-600 text-xs">
          POC Visual — Dados mockados · Sem autenticação real
        </p>
        <p className="text-slate-700 text-xs mt-1">
          React · TypeScript · Vite · Tailwind CSS
        </p>
      </div>
    </div>
  );
}
