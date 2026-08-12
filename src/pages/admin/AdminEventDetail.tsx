import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Euro,
  Calendar,
  Plus,
  Bell,
  ChevronUp,
  UserPlus,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Activity,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  Badge,
  EventStatusBadge,
  RegistrationBadge,
  PaymentBadge,
} from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { TeamBuilder } from "@/components/teams/TeamBuilder";
import { TelegramPreview } from "@/components/messaging/TelegramPreview";
import { Tabs } from "@/components/ui/Tabs";
import { eventService } from "@/services/eventService";
import { teamService } from "@/services/teamService";
import { playerService } from "@/services/playerService";
import { groupService } from "@/services/groupService";
import { paymentService } from "@/services/paymentService";
import type { Court } from "@/types";
import { clsx } from "clsx";

export function AdminEventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [localCourts, setLocalCourts] = useState<Court[] | null>(null);
  const [lastMinuteDismissed, setLastMinuteDismissed] = useState(false);
  const [promotedBackup, setPromotedBackup] = useState(false);

  const event = eventService.getById(id ?? "");
  if (!event)
    return (
      <AppLayout>
        <div className="p-6 text-center text-slate-500">Evento não encontrado</div>
      </AppLayout>
    );

  const group = groupService.getById(event.groupId);
  const teams = teamService.getByEvent(event.id);
  const payments = paymentService.getByEvent(event.id);

  const activeCourts = localCourts ?? event.courts;
  const confirmed = event.registrations.filter((r) => r.status === "confirmed");
  const backups = event.registrations.filter((r) => r.status === "backup");
  const waitlist = event.registrations.filter((r) => r.status === "waitlist");
  const totalCapacity = activeCourts.reduce((s, c) => s + c.capacity, 0) || event.totalSlots;

  const dateLabel =
    event.date === "2026-08-12" ? "Hoje"
    : event.date === "2026-08-13" ? "Amanhã"
    : event.date.slice(5).split("-").reverse().join("/");

  function openNewCourt() {
    const base = localCourts ?? event!.courts;
    const next: Court = {
      id: `c${Date.now()}`,
      eventId: event!.id,
      name: `Quadra ${base.length + 1}`,
      capacity: 12,
      filledCount: 0,
      status: "active",
      openedAt: new Date().toISOString(),
    };
    setLocalCourts([...base, next]);
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/admin/events")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          <ArrowLeft size={16} /> Voltar aos eventos
        </button>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {group && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: (group.coverColor ?? "#3b82f6") + "20",
                      color: group.coverColor,
                    }}
                  >
                    {group.name}
                  </span>
                )}
                <EventStatusBadge status={event.status} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">{event.name}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Calendar size={13} /> {dateLabel} às {event.time}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} /> {event.duration} min</span>
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {event.location}</span>
                <span className="flex items-center gap-1.5"><Euro size={13} /> €{event.price}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap shrink-0">
              <Button variant="outline" size="sm"
                onClick={() => eventService.updateStatus(event.id, "in_progress")}>
                Iniciar jogo
              </Button>
              <Button variant="outline" size="sm"
                onClick={() => eventService.updateStatus(event.id, "finished")}>
                Finalizar
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Last-minute spot banner ─────────────────────────────────────── */}
        {event.hasLastMinuteSpot && !lastMinuteDismissed && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-700 text-sm">🚨 Vaga de Última Hora disponível</p>
              <p className="text-sm text-red-600 mt-0.5">
                1 vaga liberada — jogador pode entrar imediatamente após pagamento.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                  <Zap size={14} /> Notificar Backups
                </Button>
                <Button size="sm" variant="outline" onClick={() => setLastMinuteDismissed(true)}>
                  Dispensar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Courts panel ──────────────────────────────────────────────────── */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">Quadras — Visão Geral</h2>
            <Button size="sm" onClick={openNewCourt}>
              <Plus size={14} /> Abrir nova quadra
            </Button>
          </div>

          {activeCourts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">
              Nenhuma quadra configurada. Clique em "Abrir nova quadra".
            </p>
          ) : (
            <div className={clsx(
              "grid gap-3",
              activeCourts.length === 1 ? "grid-cols-1 max-w-xs" :
              activeCourts.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
            )}>
              {activeCourts.map((court) => (
                <CourtCard key={court.id} court={court} />
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-800">{confirmed.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Confirmados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{backups.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Backups</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-500">{waitlist.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Waitlist</p>
            </div>
          </div>
        </Card>

        {/* ── Quick actions ─────────────────────────────────────────────────── */}
        <Card>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline"
              onClick={() => setPromotedBackup(true)}
              disabled={backups.length === 0 || promotedBackup}>
              <ChevronUp size={14} />
              {promotedBackup ? "Backup promovido ✓" : "Promover backup"}
            </Button>
            <Button size="sm" variant="outline">
              <UserPlus size={14} /> Adicionar jogador
            </Button>
            <Button size="sm" variant="outline">
              <Users size={14} /> Mover jogador
            </Button>
            <Button size="sm" variant="outline">
              <CheckCircle size={14} /> Confirmar pagamento
            </Button>
            <Button size="sm" variant="outline">
              <XCircle size={14} /> Rejeitar pagamento
            </Button>
            <Button size="sm" variant="outline">
              <Bell size={14} /> Notificação
            </Button>
          </div>
        </Card>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <Tabs
          tabs={[
            { id: "registrations", label: "Inscrições", badge: event.registrations.length },
            { id: "courts", label: "Equipes", badge: teams.length },
            { id: "payments", label: "Pagamentos", badge: payments.length },
            { id: "timeline", label: "Timeline" },
            { id: "telegram", label: "Telegram" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "registrations" && (
                <div className="space-y-3">
                  <RegistrationSection title="Confirmados" variant="success"
                    regs={confirmed} payments={payments} startIndex={1} />
                  {backups.length > 0 && (
                    <RegistrationSection title="Backups" variant="warning"
                      regs={backups} payments={payments} startIndex={confirmed.length + 1} />
                  )}
                  {waitlist.length > 0 && (
                    <RegistrationSection title="Waitlist" variant="default"
                      regs={waitlist} payments={payments}
                      startIndex={confirmed.length + backups.length + 1} dimmed />
                  )}
                </div>
              )}

              {tab === "courts" && (
                <TeamBuilder
                  teams={teams}
                  availablePlayers={
                    confirmed.map((r) => playerService.getById(r.userId)).filter(Boolean) as any
                  }
                  readOnly={false}
                />
              )}

              {tab === "payments" && (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left text-xs font-semibold text-slate-500 py-3 px-2">Jogador</th>
                          <th className="text-center text-xs font-semibold text-slate-500 py-3 px-2">Valor</th>
                          <th className="text-center text-xs font-semibold text-slate-500 py-3 px-2">Método</th>
                          <th className="text-center text-xs font-semibold text-slate-500 py-3 px-2">Status</th>
                          <th className="text-center text-xs font-semibold text-slate-500 py-3 px-2">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => {
                          const player = playerService.getById(p.userId);
                          return (
                            <tr key={p.id} className="border-b border-slate-50">
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  {player && <Avatar name={player.name} size="xs" />}
                                  <span className="text-sm text-slate-700">{player?.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="text-sm font-bold text-slate-700">€{p.amount}</span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="text-xs text-slate-500 capitalize">
                                  {p.method === "free" ? "Isento" : p.method}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <PaymentBadge status={p.status} />
                              </td>
                              <td className="py-3 px-2 text-center">
                                {p.status === "pending" && (
                                  <div className="flex gap-1 justify-center">
                                    <button className="text-xs text-emerald-600 hover:underline">✓ Aprovar</button>
                                    <span className="text-slate-300">|</span>
                                    <button className="text-xs text-red-500 hover:underline">✗ Rejeitar</button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between px-2">
                      <span className="text-sm text-slate-500">Total arrecadado</span>
                      <span className="text-sm font-bold text-emerald-700">
                        €{payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0)}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              {tab === "timeline" && (
                <Card>
                  <CardHeader>
                    <span className="flex items-center gap-2">
                      <Activity size={15} /> Histórico do evento
                    </span>
                  </CardHeader>
                  {event.timeline.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">
                      Nenhum registo disponível para este evento.
                    </p>
                  ) : (
                    <div className="relative mt-3">
                      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />
                      <div className="space-y-1">
                        {event.timeline.map((entry) => (
                          <TimelineRow key={entry.id} entry={entry} />
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {tab === "telegram" && (
                <Card>
                  <CardHeader>Enviar notificação</CardHeader>
                  <TelegramPreview
                    groupId={event.groupId}
                    groupName={group?.name ?? ""}
                    eventName={event.name}
                    eventDate={event.date}
                    eventTime={event.time}
                    eventLocation={event.location}
                    eventPrice={event.price}
                    eventSlots={totalCapacity}
                  />
                </Card>
              )}
            </>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CourtCard({ court }: { court: Court }) {
  const pct = Math.min((court.filledCount / court.capacity) * 100, 100);
  const isFull = court.filledCount >= court.capacity;

  return (
    <div className={clsx(
      "rounded-xl border p-4 space-y-3",
      isFull ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white",
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{court.name}</p>
        <span className={clsx(
          "text-xs font-medium px-2 py-0.5 rounded-full",
          isFull ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700",
        )}>
          {isFull ? "LOTADA" : "ABERTA"}
        </span>
      </div>
      <div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={clsx("h-full rounded-full", isFull ? "bg-emerald-500" : "bg-primary-500")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xl font-bold text-slate-800 mt-2">
          {court.filledCount} <span className="text-sm font-normal text-slate-400">/ {court.capacity}</span>
        </p>
      </div>
      {court.openedAt && (
        <p className="text-xs text-slate-400">
          Aberta às {new Date(court.openedAt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
    </div>
  );
}

function RegistrationSection({
  title, variant, regs, payments, startIndex, dimmed = false,
}: {
  title: string;
  variant: "success" | "warning" | "default";
  regs: { id: string; userId: string; status: string; paymentStatus: string }[];
  payments: any[];
  startIndex: number;
  dimmed?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <span className="flex items-center gap-2">
          {title}
          <Badge variant={variant} size="sm">{regs.length}</Badge>
        </span>
      </CardHeader>
      <div className="space-y-2">
        {regs.map((reg, i) => {
          const player = playerService.getById(reg.userId);
          const payment = payments.find((p: any) => p.userId === reg.userId);
          return (
            <div key={reg.id} className={clsx("flex items-center gap-3 py-2", dimmed && "opacity-60")}>
              <span className="w-6 text-xs text-slate-400 text-right">{startIndex + i}</span>
              {player && <Avatar name={player.name} size="sm" />}
              <p className="flex-1 text-sm font-medium text-slate-700">{player?.name}</p>
              {payment && <PaymentBadge status={payment.status} />}
              <RegistrationBadge status={reg.status as any} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function TimelineRow({ entry }: { entry: { time: string; label: string; type: string; actor?: string } }) {
  const styles: Record<string, { ring: string; dot: string }> = {
    system:  { ring: "bg-slate-100",   dot: "bg-slate-400" },
    player:  { ring: "bg-blue-100",    dot: "bg-blue-500" },
    admin:   { ring: "bg-violet-100",  dot: "bg-violet-500" },
    payment: { ring: "bg-emerald-100", dot: "bg-emerald-500" },
    court:   { ring: "bg-amber-100",   dot: "bg-amber-500" },
  };
  const s = styles[entry.type] ?? styles.system;

  return (
    <div className="flex items-start gap-3 py-2 pl-1">
      <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10", s.ring)}>
        <div className={clsx("w-2.5 h-2.5 rounded-full", s.dot)} />
      </div>
      <div className="flex-1 pt-1.5">
        <p className="text-sm text-slate-700">{entry.label}</p>
        {entry.actor && <p className="text-xs text-slate-400 mt-0.5">{entry.actor}</p>}
      </div>
      <span className="text-xs text-slate-400 pt-1.5 shrink-0">{entry.time}</span>
    </div>
  );
}
