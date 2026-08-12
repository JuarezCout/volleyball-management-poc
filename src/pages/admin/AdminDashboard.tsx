import { useState } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  Euro,
  Activity,
  Plus,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  CircleDot,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/Tabs";
import { Badge, EventStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import {
  WeeklyBarChart,
  RevenueChart,
  GroupsChart,
} from "@/components/charts/Charts";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { eventService } from "@/services/eventService";
import { paymentService } from "@/services/paymentService";
import { playerService } from "@/services/playerService";
import { groupService } from "@/services/groupService";
import { weeklyStats, groupStats } from "@/mock/ratings";
import { mockPayments } from "@/mock";
import { useNavigate } from "react-router-dom";

export function AdminDashboard() {
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const todayEvents = eventService.getTodayEvents();
  const upcomingEvents = eventService.getUpcoming().slice(0, 5);
  const allPlayers = playerService.getAll();
  const recentPayments = mockPayments.slice(0, 8);

  return (
    <AppLayout title="Dashboard">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Visão geral do clube — Hoje, 12 Agosto 2026
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> Novo evento
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Participantes totais"
            value="800"
            sub="Registados no clube"
            icon={<Users size={20} />}
          />
          <StatCard
            label="Ativos este mês"
            value="347"
            sub={`+12 vs mês anterior`}
            icon={<Activity size={20} />}
            color="text-emerald-600"
            trend={{ value: "3.6%", positive: true }}
          />
          <StatCard
            label="Eventos hoje"
            value={todayEvents.length.toString()}
            sub={`${upcomingEvents.length} esta semana`}
            icon={<Calendar size={20} />}
            color="text-purple-600"
          />
          <StatCard
            label="Receita esta semana"
            value="€752"
            sub="Pagamentos confirmados"
            icon={<Euro size={20} />}
            color="text-amber-600"
            trend={{ value: "6.8%", positive: true }}
          />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader
              action={
                <span className="text-xs text-slate-400">
                  Últimas 7 semanas
                </span>
              }
            >
              Participações por semana
            </CardHeader>
            <WeeklyBarChart data={weeklyStats} height={190} />
          </Card>

          <Card>
            <CardHeader
              action={
                <span className="text-xs text-slate-400">
                  Últimas 7 semanas
                </span>
              }
            >
              Receita semanal
            </CardHeader>
            <RevenueChart data={weeklyStats} height={190} />
          </Card>
        </div>

        {/* Middle row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Events today */}
          <Card className="lg:col-span-2">
            <CardHeader
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/events")}
                >
                  Ver todos <ChevronRight size={14} />
                </Button>
              }
            >
              Eventos hoje
            </CardHeader>
            <div className="space-y-1 -mx-1">
              {todayEvents.map((event) => {
                const confirmed = eventService.getConfirmedCount(event);
                const total = event.playersPerTeam * event.teamCount;
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 px-3 py-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/events/${event.id}`)}
                  >
                    <div className="text-center w-14 flex-shrink-0">
                      <p className="text-xs text-slate-400">hoje</p>
                      <p className="text-lg font-bold text-slate-800">
                        {event.time}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {event.name}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin size={10} />
                        {event.location}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-700">
                        {confirmed}/{total}
                      </p>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{
                            width: `${Math.min((confirmed / total) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <EventStatusBadge status={event.status} />
                  </div>
                );
              })}
              {todayEvents.length === 0 && (
                <p className="text-center text-slate-400 py-6 text-sm">
                  Nenhum evento hoje
                </p>
              )}
            </div>
          </Card>

          {/* Events per group */}
          <Card>
            <CardHeader>Eventos por grupo</CardHeader>
            <GroupsChart data={groupStats} height={220} />
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Recent payments */}
          <Card>
            <CardHeader
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/payments")}
                >
                  Ver todos <ChevronRight size={14} />
                </Button>
              }
            >
              Pagamentos recentes
            </CardHeader>
            <div className="space-y-2">
              {recentPayments.map((p) => {
                const player = playerService.getById(p.userId);
                return (
                  <div key={p.id} className="flex items-center gap-3 py-2">
                    {player && <Avatar name={player.name} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {player?.name ?? "Jogador"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {p.createdAt
                          .slice(0, 10)
                          .split("-")
                          .reverse()
                          .join("/")}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      €{p.amount}
                    </span>
                    <Badge
                      variant={p.status === "paid" ? "success" : "warning"}
                      dot
                      size="sm"
                    >
                      {p.status === "paid" ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Upcoming events */}
          <Card>
            <CardHeader
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/events")}
                >
                  Ver todos <ChevronRight size={14} />
                </Button>
              }
            >
              Próximos eventos
            </CardHeader>
            <div className="space-y-1 -mx-1">
              {upcomingEvents.slice(2).map((event) => {
                const confirmed = eventService.getConfirmedCount(event);
                const total = event.playersPerTeam * event.teamCount;
                const date =
                  event.date === "2026-08-12"
                    ? "Hoje"
                    : event.date === "2026-08-13"
                      ? "Amanhã"
                      : event.date.slice(5).split("-").reverse().join("/");
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer"
                    onClick={() => navigate(`/admin/events/${event.id}`)}
                  >
                    <div className="w-10 text-center">
                      <p className="text-xs text-slate-400">{date}</p>
                      <p className="text-sm font-bold text-slate-800">
                        {event.time}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {event.name}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {confirmed}/{total}
                    </p>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </AppLayout>
  );
}
