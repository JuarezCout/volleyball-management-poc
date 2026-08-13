import { MapPin, Phone, Mail, Star, Calendar, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { groupService } from "@/services/groupService";
import { mockPlayerStats } from "@/mock/ratings";

const POSITION_LABELS: Record<string, string> = {
  libero: "Líbero",
  setter: "Levantador",
  outside: "Ponteiro",
  middle: "Central",
  opposite: "Oposto",
  universal: "Universal",
};

export function PlayerProfile() {
  const { user } = useAuth();
  const groups = user ? groupService.getByMember(user.id) : [];
  const stats = user ? mockPlayerStats[user.id] : undefined;

  if (!user) return null;

  return (
    <AppLayout title="Meu Perfil">
      <div className="p-4 sm:p-6 space-y-5 max-w-xl mx-auto">
        {/* Profile card */}
        <Card className="text-center">
          <Avatar name={user.name} size="xl" className="mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
          {user.positions && user.positions.length > 0 && (
            <p className="text-slate-500 text-sm mt-1">
              {POSITION_LABELS[user.positions[0]]}
            </p>
          )}
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            {groups.map((g) => (
              <span
                key={g.id}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: g.coverColor + "20", color: g.coverColor }}
              >
                {g.name}
              </span>
            ))}
          </div>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>Contacto</CardHeader>
          <div className="space-y-3">
            {user.email && (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                {user.email}
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" />
                {user.phone}
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={16} className="text-slate-400" />
              Membro desde {user.joinedAt.split("-").reverse().join("/")}
            </div>
          </div>
        </Card>

        {/* Stats */}
        {stats && (
          <Card>
            <CardHeader>Estatísticas</CardHeader>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xl font-bold text-slate-800">
                  {stats.totalParticipations}
                </p>
                <p className="text-xs text-slate-400">Jogos</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-3">
                <p className="text-xl font-bold text-primary-700">
                  {stats.currentRating}
                </p>
                <p className="text-xs text-slate-400">Rating</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xl font-bold text-emerald-600">
                  +{stats.evolution}
                </p>
                <p className="text-xs text-slate-400">Evolução</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
