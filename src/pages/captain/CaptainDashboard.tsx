import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Tabs";
import { Badge, EventStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WeeklyBarChart } from "@/components/charts/Charts";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Users,
  Star,
  TrendingUp,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateEventModal } from "@/components/events/CreateEventModal";

const captainWeekly = [
  { week: "Jul 29", participations: 14, revenue: 112 },
  { week: "Ago 5", participations: 16, revenue: 128 },
  { week: "Ago 12", participations: 10, revenue: 80 },
];

export function CaptainDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);

  // Captain manages group g2 (Terça-feira)
  const myEvents = eventService.getByGroup("g2");
  const upcomingEvents = myEvents
    .filter((e) => e.date >= "2026-08-12")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <AppLayout title="Dashboard Capitão">
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Terça-feira — Intermediário
            </p>
            <h1 className="text-2xl font-bold text-slate-800">
              Olá, {user?.name.split(" ")[0]} 👋
            </h1>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> Criar jogo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Membros" value="91" icon={<Users size={18} />} />
          <StatCard
            label="Eventos este mês"
            value="12"
            icon={<Calendar size={18} />}
            color="text-purple-600"
          />
          <StatCard
            label="Participações"
            value="148"
            icon={<TrendingUp size={18} />}
            color="text-emerald-600"
          />
          <StatCard
            label="Rating médio"
            value="8.1"
            icon={<Star size={18} />}
            color="text-amber-600"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Upcoming events */}
          <Card>
            <CardHeader
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/captain/events")}
                >
                  Ver todos <ChevronRight size={14} />
                </Button>
              }
            >
              Próximos eventos
            </CardHeader>
            <div className="space-y-1 -mx-1">
              {upcomingEvents.slice(0, 5).map((event) => {
                const confirmed = eventService.getConfirmedCount(event);
                const total = event.playersPerTeam * event.teamCount;
                const dateLabel =
                  event.date === "2026-08-12"
                    ? "Hoje"
                    : event.date === "2026-08-13"
                      ? "Amanhã"
                      : event.date.slice(5).split("-").reverse().join("/");
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl cursor-pointer"
                    onClick={() => navigate(`/captain/events/${event.id}`)}
                  >
                    <div className="text-center w-12">
                      <p className="text-xs text-slate-400">{dateLabel}</p>
                      <p className="text-base font-bold text-slate-800">
                        {event.time}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {event.name}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-slate-600">
                      {confirmed}/{total}
                    </p>
                    <EventStatusBadge status={event.status} />
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Weekly participations */}
          <Card>
            <CardHeader>Participações semanais</CardHeader>
            <WeeklyBarChart data={captainWeekly} height={190} color="#8b5cf6" />
          </Card>
        </div>
      </div>

      <CreateEventModal
        open={createOpen}
        groupId="g2"
        onClose={() => setCreateOpen(false)}
      />
    </AppLayout>
  );
}
