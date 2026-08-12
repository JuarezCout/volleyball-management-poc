import { useState } from "react";
import {
  Calendar,
  Star,
  TrendingUp,
  Users,
  ChevronRight,
  CircleDot,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, RegistrationBadge, PaymentBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { RatingChart } from "@/components/charts/Charts";
import { EventRegistrationModal } from "@/components/events/EventRegistrationModal";
import { eventService } from "@/services/eventService";
import { ratingService } from "@/services/ratingService";
import { teamService } from "@/services/teamService";
import { playerService } from "@/services/playerService";
import { useAuth } from "@/context/AuthContext";
import { mockPlayerStats } from "@/mock/ratings";

export function PlayerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [regEvent, setRegEvent] = useState<string | null>(null);

  const userId = user?.id ?? "u2";
  const stats = mockPlayerStats[userId];
  const myEvents = eventService.getRegisteredEvents(userId);
  const nextEvent = myEvents
    .filter((e) => e.date >= "2026-08-12" && e.status !== "cancelled")
    .sort((a, b) =>
      `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
    )[0];

  const openEvents = eventService
    .getUpcoming()
    .filter((e) => !eventService.isUserRegistered(e, userId));
  const upcomingReg = myEvents
    .filter((e) => e.date >= "2026-08-12")
    .slice(0, 3);

  const nextTeam = nextEvent
    ? teamService
        .getByEvent(nextEvent.id)
        .find(
          (t) => t.playerIds.includes(userId) || t.backupIds.includes(userId),
        )
    : null;

  const nextReg = nextEvent
    ? eventService.getUserRegistration(nextEvent, userId)
    : null;

  return (
    <AppLayout title="Início">
      <div className="p-4 sm:p-6 space-y-5 max-w-2xl mx-auto">
        {/* Greeting */}
        <div>
          <p className="text-slate-500 text-sm">Bem-vindo de volta</p>
          <h1 className="text-2xl font-bold text-slate-800">
            Olá, {user?.name.split(" ")[0]} 👋
          </h1>
        </div>

        {/* Next game card */}
        {nextEvent ? (
          <Card className="bg-gradient-to-br from-primary-700 to-primary-900 text-white border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary-300 text-sm font-medium mb-1">
                  Próximo jogo
                </p>
                <h2 className="text-xl font-bold">{nextEvent.name}</h2>
              </div>
              <div className="p-2 bg-white/20 rounded-xl">
                <CircleDot size={22} className="text-white" />
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <p className="flex items-center gap-2 text-sm text-primary-200">
                <Clock size={14} /> {nextEvent.date} às {nextEvent.time} (
                {nextEvent.duration} min)
              </p>
              <p className="flex items-center gap-2 text-sm text-primary-200">
                <MapPin size={14} /> {nextEvent.location}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {nextReg && (
                <span
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${nextReg.status === "confirmed" ? "bg-emerald-500/30 text-emerald-200" : "bg-amber-500/30 text-amber-200"}`}
                >
                  {nextReg.status === "confirmed" ? (
                    <CheckCircle size={14} />
                  ) : null}
                  {nextReg.status === "confirmed" ? "Confirmado" : "Waitlist"}
                </span>
              )}
              {nextTeam && (
                <span className="text-sm text-white font-medium px-3 py-1.5 bg-white/20 rounded-full">
                  {nextTeam.name}
                </span>
              )}
              <Button
                size="sm"
                variant="secondary"
                className="ml-auto bg-white/20 text-white border-0 hover:bg-white/30"
                onClick={() => navigate(`/player/events/${nextEvent.id}`)}
              >
                Ver detalhes
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="text-center py-6">
            <CircleDot size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Sem jogos agendados</p>
            <Button className="mt-3" onClick={() => navigate("/player/events")}>
              Encontrar eventos
            </Button>
          </Card>
        )}

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatPill label="Participações" value={stats.totalParticipations} />
            <StatPill
              label="Rating actual"
              value={stats.currentRating}
              highlight
            />
            <StatPill label="Avaliações" value={stats.totalRatings} />
            <StatPill label="Evolução" value={`+${stats.evolution}`} positive />
          </div>
        )}

        {/* Rating chart */}
        {stats && stats.ratingHistory.length > 0 && (
          <Card>
            <CardHeader
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/player/rating")}
                >
                  Ver mais <ChevronRight size={14} />
                </Button>
              }
            >
              Minha evolução
            </CardHeader>
            <RatingChart data={stats.ratingHistory} height={160} />
          </Card>
        )}

        {/* My upcoming registrations */}
        {upcomingReg.length > 0 && (
          <Card>
            <CardHeader
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/player/my-games")}
                >
                  Ver todos <ChevronRight size={14} />
                </Button>
              }
            >
              Meus próximos jogos
            </CardHeader>
            <div className="space-y-1 -mx-1">
              {upcomingReg.map((event) => {
                const reg = eventService.getUserRegistration(event, userId);
                const team = teamService
                  .getByEvent(event.id)
                  .find((t) => t.playerIds.includes(userId));
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
                    onClick={() => navigate(`/player/events/${event.id}`)}
                  >
                    <div className="w-12 text-center">
                      <p className="text-xs text-slate-400">{dateLabel}</p>
                      <p className="text-sm font-bold text-slate-800">
                        {event.time}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {event.name}
                      </p>
                      {team && (
                        <p className="text-xs text-slate-400">{team.name}</p>
                      )}
                    </div>
                    {reg && <RegistrationBadge status={reg.status} />}
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Open events */}
        <Card>
          <CardHeader
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/player/events")}
              >
                Ver todos <ChevronRight size={14} />
              </Button>
            }
          >
            Eventos disponíveis
          </CardHeader>
          <div className="space-y-1 -mx-1">
            {openEvents.slice(0, 3).map((event) => {
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
                  onClick={() => setRegEvent(event.id)}
                >
                  <div className="w-12 text-center">
                    <p className="text-xs text-slate-400">{dateLabel}</p>
                    <p className="text-sm font-bold text-slate-800">
                      {event.time}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {event.name}
                    </p>
                    <p className="text-xs text-slate-400">€{event.price}</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    {confirmed}/{total}
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRegEvent(event.id);
                    }}
                  >
                    Participar
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {regEvent &&
        (() => {
          const ev = eventService.getById(regEvent);
          if (!ev) return null;
          return (
            <EventRegistrationModal
              event={ev}
              userId={userId}
              open={true}
              onClose={() => setRegEvent(null)}
              onSuccess={() => {
                setRegEvent(null);
                navigate("/player/my-games");
              }}
            />
          );
        })()}
    </AppLayout>
  );
}

function StatPill({
  label,
  value,
  highlight,
  positive,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  positive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 text-center ${highlight ? "bg-primary-600 text-white" : "bg-slate-50"}`}
    >
      <p
        className={`text-2xl font-bold ${highlight ? "text-white" : positive ? "text-emerald-600" : "text-slate-800"}`}
      >
        {value}
      </p>
      <p
        className={`text-xs mt-0.5 ${highlight ? "text-primary-200" : "text-slate-400"}`}
      >
        {label}
      </p>
    </div>
  );
}
