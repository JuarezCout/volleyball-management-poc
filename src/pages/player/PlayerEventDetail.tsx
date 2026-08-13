import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Euro,
  Users,
  Calendar,
  CircleDot,
  Crown,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import {
  Badge,
  RegistrationBadge,
  PaymentBadge,
  EventStatusBadge,
} from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EventRegistrationModal } from "@/components/events/EventRegistrationModal";
import { EventLifecycle } from "@/components/events/EventLifecycle";
import { eventService } from "@/services/eventService";
import { teamService } from "@/services/teamService";
import { playerService } from "@/services/playerService";
import { useAuth } from "@/context/AuthContext";

export function PlayerEventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [regOpen, setRegOpen] = useState(false);

  const userId = user?.id ?? "u2";
  const event = eventService.getById(id ?? "");
  if (!event)
    return (
      <AppLayout>
        <div className="p-6 text-center text-slate-400">
          Evento não encontrado
        </div>
      </AppLayout>
    );

  const userReg = eventService.getUserRegistration(event, userId);
  const isRegistered = !!userReg && userReg.status !== "cancelled";
  const teams = teamService.getByEvent(event.id);
  const myTeam = teams.find(
    (t) => t.playerIds.includes(userId) || t.backupIds.includes(userId),
  );
  const confirmed = event.registrations.filter((r) => r.status === "confirmed");
  const waitlist = event.registrations.filter((r) => r.status === "waitlist");
  const total = event.playersPerTeam * event.teamCount;
  const dateLabel =
    event.date === "2026-08-12"
      ? "Hoje"
      : event.date === "2026-08-13"
        ? "Amanhã"
        : event.date.slice(5).split("-").reverse().join("/");

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-4 max-w-xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Main card */}
        <Card>
          <div className="text-center mb-4">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CircleDot size={28} className="text-primary-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">{event.name}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {dateLabel} • {event.time}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <InfoBox
              icon={<MapPin size={14} />}
              label="Local"
              value={event.location}
            />
            <InfoBox
              icon={<Euro size={14} />}
              label="Preço"
              value={`€${event.price}`}
            />
            <InfoBox
              icon={<Clock size={14} />}
              label="Duração"
              value={`${event.duration} min`}
            />
            <InfoBox
              icon={<Users size={14} />}
              label="Vagas"
              value={`${confirmed.length}/${total}`}
            />
          </div>

          {/* Event lifecycle */}
          <div className="mb-4 overflow-x-auto">
            <EventLifecycle status={event.status} />
          </div>

          {/* Occupancy bar */}
          <div className="mb-4">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{
                  width: `${Math.min((confirmed.length / total) * 100, 100)}%`,
                }}
              />
            </div>
            {waitlist.length > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                {waitlist.length} pessoa(s) na waitlist
              </p>
            )}
          </div>

          {/* Courts grid */}
          {event.courts.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Quadras
              </p>
              <div className="grid grid-cols-2 gap-2">
                {event.courts.map((court) => {
                  const isFull = court.filledCount >= court.capacity;
                  return (
                    <div
                      key={court.id}
                      className={`rounded-xl p-3 border text-center ${isFull ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
                    >
                      <p className="text-xs font-semibold text-slate-600">
                        {court.name}
                      </p>
                      <p className="text-lg font-bold text-slate-800 mt-1">
                        {court.filledCount}
                        <span className="text-sm font-normal text-slate-400">
                          {" "}
                          / {court.capacity}
                        </span>
                      </p>
                      <span
                        className={`text-xs font-medium ${isFull ? "text-emerald-600" : "text-blue-600"}`}
                      >
                        {isFull ? "Lotada" : "Aberta"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Last-minute spot CTA */}
          {event.hasLastMinuteSpot && !isRegistered && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
              <Zap size={18} className="text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  🚨 1 vaga de última hora!
                </p>
                <p className="text-xs text-red-500 mt-0.5">
                  Disponível agora. Pague para confirmar.
                </p>
              </div>
              <button
                onClick={() => setRegOpen(true)}
                className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shrink-0"
              >
                Garantir vaga
              </button>
            </div>
          )}

          {/* Registration status */}
          {isRegistered && userReg ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Status
                </span>
                <RegistrationBadge status={userReg.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Pagamento
                </span>
                <PaymentBadge status={userReg.paymentStatus} />
              </div>
              {myTeam && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Equipa
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {myTeam.name}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Button fullWidth size="lg" onClick={() => setRegOpen(true)}>
              <CircleDot size={16} />
              {confirmed.length >= total ? "Entrar na Waitlist" : "Participar"}
            </Button>
          )}
        </Card>

        {/* Team view */}
        {teams.length > 0 && (
          <div className="space-y-3">
            {teams.map((team) => {
              const players = playerService.getByIds(team.playerIds);
              const backups = playerService.getByIds(team.backupIds);
              const captain = playerService.getById(team.captainId ?? "");
              const isMyTeam = myTeam?.id === team.id;
              return (
                <Card
                  key={team.id}
                  className={isMyTeam ? "ring-2 ring-primary-400" : ""}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: team.color }}
                    />
                    <p className="font-semibold text-slate-800">{team.name}</p>
                    {isMyTeam && (
                      <Badge variant="info" size="sm">
                        Minha equipa
                      </Badge>
                    )}
                    <span className="ml-auto text-xs text-slate-400">
                      {team.playerIds.length}/{team.maxPlayers}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {captain && (
                      <div className="flex items-center gap-2">
                        <Crown size={12} className="text-amber-500" />
                        <Avatar name={captain.name} size="xs" />
                        <span className="text-sm text-slate-700">
                          {captain.name}
                        </span>
                        <Badge variant="orange" size="sm">
                          Capitão
                        </Badge>
                      </div>
                    )}
                    {players
                      .filter((p) => p.id !== team.captainId)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 pl-5"
                        >
                          <Avatar name={p.name} size="xs" />
                          <span className="text-sm text-slate-600">
                            {p.name}
                          </span>
                        </div>
                      ))}
                    {backups.length > 0 && (
                      <p className="text-xs text-slate-400 mt-2 pl-5">
                        Backups
                      </p>
                    )}
                    {backups.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 pl-5 opacity-60"
                      >
                        <Avatar name={p.name} size="xs" />
                        <span className="text-sm text-slate-500">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Full participants list */}
        <Card>
          <p className="font-semibold text-slate-800 mb-3">
            Confirmados ({confirmed.length}/{total})
          </p>
          <div className="space-y-1.5">
            {confirmed.map((reg, i) => {
              const player = playerService.getById(reg.userId);
              return player ? (
                <div key={reg.id} className="flex items-center gap-2.5 py-1">
                  <span className="w-5 text-xs text-slate-400 text-right">
                    {i + 1}
                  </span>
                  <Avatar name={player.name} size="xs" />
                  <span className="text-sm text-slate-700 flex-1">
                    {player.name}
                  </span>
                  <PaymentBadge status={reg.paymentStatus} />
                </div>
              ) : null;
            })}
          </div>

          {waitlist.length > 0 && (
            <>
              <p className="font-semibold text-slate-600 mt-4 mb-3 text-sm">
                Waitlist ({waitlist.length})
              </p>
              <div className="space-y-1.5">
                {waitlist.map((reg, i) => {
                  const player = playerService.getById(reg.userId);
                  return player ? (
                    <div
                      key={reg.id}
                      className="flex items-center gap-2.5 py-1 opacity-60"
                    >
                      <span className="w-5 text-xs text-slate-400 text-right">
                        {confirmed.length + i + 1}
                      </span>
                      <Avatar name={player.name} size="xs" />
                      <span className="text-sm text-slate-500 flex-1">
                        {player.name}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </>
          )}
        </Card>
      </div>

      <EventRegistrationModal
        event={event}
        userId={userId}
        open={regOpen}
        onClose={() => setRegOpen(false)}
        onSuccess={() => setRegOpen(false)}
      />
    </AppLayout>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-xs text-slate-400 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
        {value}
      </p>
    </div>
  );
}
