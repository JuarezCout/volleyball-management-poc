import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Euro,
  Users,
  Calendar,
  Star,
  Crown,
  Send,
  UserPlus,
  MessageSquare,
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

export function AdminEventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const event = eventService.getById(id ?? "");
  if (!event)
    return (
      <AppLayout>
        <div className="p-6 text-center text-slate-500">
          Evento não encontrado
        </div>
      </AppLayout>
    );

  const group = groupService.getById(event.groupId);
  const teams = teamService.getByEvent(event.id);
  const groupPlayers = group ? playerService.getByGroup(group.id) : [];
  const payments = paymentService.getByEvent(event.id);

  const confirmed = event.registrations.filter((r) => r.status === "confirmed");
  const waitlist = event.registrations.filter((r) => r.status === "waitlist");
  const totalMain = event.playersPerTeam * event.teamCount;
  const dateLabel =
    event.date === "2026-08-12"
      ? "Hoje"
      : event.date === "2026-08-13"
        ? "Amanhã"
        : event.date.slice(5).split("-").reverse().join("/");

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

        {/* Header card */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
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
              <h1 className="text-2xl font-bold text-slate-800">
                {event.name}
              </h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  eventService.updateStatus(event.id, "in_progress")
                }
              >
                Iniciar jogo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => eventService.updateStatus(event.id, "finished")}
              >
                Finalizar
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetaItem
              icon={<Calendar size={14} />}
              label="Data"
              value={`${dateLabel} às ${event.time}`}
            />
            <MetaItem
              icon={<Clock size={14} />}
              label="Duração"
              value={`${event.duration} min`}
            />
            <MetaItem
              icon={<MapPin size={14} />}
              label="Local"
              value={event.location}
            />
            <MetaItem
              icon={<Euro size={14} />}
              label="Preço"
              value={`€${event.price}`}
            />
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 bg-slate-100 rounded-full h-2">
              <div
                className="h-full rounded-full bg-primary-500"
                style={{
                  width: `${Math.min((confirmed.length / totalMain) * 100, 100)}%`,
                }}
              />
            </div>
            <span className="text-sm font-bold text-slate-700">
              {confirmed.length}/{totalMain}
            </span>
            {waitlist.length > 0 && (
              <span className="text-xs text-amber-600 font-medium">
                +{waitlist.length} waitlist
              </span>
            )}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs
          tabs={[
            {
              id: "registrations",
              label: "Inscrições",
              badge: event.registrations.length,
            },
            { id: "teams", label: "Equipes", badge: teams.length },
            { id: "payments", label: "Pagamentos", badge: payments.length },
            { id: "telegram", label: "Telegram" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "registrations" && (
                <div className="space-y-3">
                  {/* Confirmed */}
                  <Card>
                    <CardHeader>
                      <span className="flex items-center gap-2">
                        Confirmados
                        <Badge variant="success" size="sm">
                          {confirmed.length}
                        </Badge>
                      </span>
                    </CardHeader>
                    <div className="space-y-2">
                      {confirmed.map((reg, i) => {
                        const player = playerService.getById(reg.userId);
                        const payment = payments.find(
                          (p) => p.userId === reg.userId,
                        );
                        return (
                          <div
                            key={reg.id}
                            className="flex items-center gap-3 py-2"
                          >
                            <span className="w-6 text-xs text-slate-400 text-right">
                              {i + 1}
                            </span>
                            {player && <Avatar name={player.name} size="sm" />}
                            <p className="flex-1 text-sm font-medium text-slate-700">
                              {player?.name}
                            </p>
                            {payment && (
                              <PaymentBadge status={payment.status} />
                            )}
                            <RegistrationBadge status={reg.status} />
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Waitlist */}
                  {waitlist.length > 0 && (
                    <Card>
                      <CardHeader>
                        <span className="flex items-center gap-2">
                          Waitlist
                          <Badge variant="warning" size="sm">
                            {waitlist.length}
                          </Badge>
                        </span>
                      </CardHeader>
                      <div className="space-y-2">
                        {waitlist.map((reg, i) => {
                          const player = playerService.getById(reg.userId);
                          return (
                            <div
                              key={reg.id}
                              className="flex items-center gap-3 py-2"
                            >
                              <span className="w-6 text-xs text-slate-400 text-right">
                                {confirmed.length + i + 1}
                              </span>
                              {player && (
                                <Avatar
                                  name={player.name}
                                  size="sm"
                                  className="opacity-60"
                                />
                              )}
                              <p className="flex-1 text-sm text-slate-500">
                                {player?.name}
                              </p>
                              <RegistrationBadge status={reg.status} />
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {tab === "teams" && (
                <TeamBuilder
                  teams={teams}
                  availablePlayers={
                    confirmed
                      .map((r) => playerService.getById(r.userId))
                      .filter(Boolean) as any
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
                          <th className="text-left text-xs font-semibold text-slate-500 py-3 px-2">
                            Jogador
                          </th>
                          <th className="text-center text-xs font-semibold text-slate-500 py-3 px-2">
                            Valor
                          </th>
                          <th className="text-center text-xs font-semibold text-slate-500 py-3 px-2">
                            Método
                          </th>
                          <th className="text-center text-xs font-semibold text-slate-500 py-3 px-2">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => {
                          const player = playerService.getById(p.userId);
                          return (
                            <tr key={p.id} className="border-b border-slate-50">
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  {player && (
                                    <Avatar name={player.name} size="xs" />
                                  )}
                                  <span className="text-sm text-slate-700">
                                    {player?.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="text-sm font-bold text-slate-700">
                                  €{p.amount}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className="text-xs text-slate-500 capitalize">
                                  {p.method === "free" ? "Isento" : p.method}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <PaymentBadge status={p.status} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between px-2">
                      <span className="text-sm text-slate-500">
                        Total arrecadado
                      </span>
                      <span className="text-sm font-bold text-emerald-700">
                        €
                        {payments
                          .filter((p) => p.status === "paid")
                          .reduce((s, p) => s + p.amount, 0)}
                      </span>
                    </div>
                  </div>
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
                    eventSlots={event.playersPerTeam * event.teamCount}
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

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
    </div>
  );
}
