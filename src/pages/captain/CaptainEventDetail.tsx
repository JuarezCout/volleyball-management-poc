import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Star, Send, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, EventStatusBadge } from "@/components/ui/Badge";
import { TeamBuilder } from "@/components/teams/TeamBuilder";
import { RatingForm } from "@/components/ratings/RatingForm";
import { Tabs } from "@/components/ui/Tabs";
import { Avatar } from "@/components/ui/Avatar";
import { eventService } from "@/services/eventService";
import { teamService } from "@/services/teamService";
import { playerService } from "@/services/playerService";
import { groupService } from "@/services/groupService";
import { useAuth } from "@/context/AuthContext";

export function CaptainEventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const event = eventService.getById(id ?? "e1") ?? eventService.getById("e1")!;
  const group = groupService.getById(event.groupId);
  const teams = teamService.getByEvent(event.id);
  const confirmedRegs = event.registrations.filter(
    (r) => r.status === "confirmed" || r.status === "backup",
  );
  const confirmedPlayers = confirmedRegs
    .map((r) => playerService.getById(r.userId))
    .filter(Boolean) as any[];

  // Captain's assigned court (first court that has the captain's team)
  const captainTeams = teams.filter((t) => t.captainId === user?.id);
  const myCourt =
    event.courts.find((c) =>
      captainTeams.some((t) => t.id === c.teamAId || t.id === c.teamBId),
    ) ?? event.courts[0];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/captain/events")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {/* Event header */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">{group?.name}</p>
              <h1 className="text-xl font-bold text-slate-800">{event.name}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {event.date} às {event.time} · {event.location}
              </p>
            </div>
            <EventStatusBadge status={event.status} />
          </div>
        </Card>

        {/* My Court panel */}
        {myCourt && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
                  Minha Quadra
                </p>
                <h2 className="text-lg font-bold text-slate-800">
                  {myCourt.name}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-800">
                  {myCourt.filledCount}
                  <span className="text-sm font-normal text-slate-400">
                    {" "}
                    / {myCourt.capacity}
                  </span>
                </p>
                <span
                  className={`text-xs font-medium ${myCourt.filledCount >= myCourt.capacity ? "text-emerald-600" : "text-blue-600"}`}
                >
                  {myCourt.filledCount >= myCourt.capacity
                    ? "Lotada"
                    : "Aberta"}
                </span>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{
                  width: `${Math.min((myCourt.filledCount / myCourt.capacity) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-bold text-slate-800">
                  {confirmedRegs.filter((r) => r.status === "confirmed").length}
                </p>
                <p className="text-xs text-slate-400">Confirmados</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-bold text-amber-600">
                  {confirmedRegs.filter((r) => r.status === "backup").length}
                </p>
                <p className="text-xs text-slate-400">Backups</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-bold text-slate-600">
                  {teams.length}
                </p>
                <p className="text-xs text-slate-400">Equipas</p>
              </div>
            </div>
          </Card>
        )}

        <Tabs
          tabs={[
            { id: "teams", label: "Equipas" },
            { id: "players", label: "Jogadores" },
            { id: "rate", label: "Avaliar" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "teams" && (
                <div className="space-y-4">
                  {teams.length > 0 ? (
                    <TeamBuilder
                      teams={teams}
                      availablePlayers={confirmedPlayers}
                      readOnly={false}
                    />
                  ) : (
                    <Card>
                      <div className="text-center py-8 text-slate-400">
                        <Trophy size={32} className="mx-auto mb-3 opacity-40" />
                        <p>Nenhuma equipa formada ainda.</p>
                        <p className="text-sm mt-1">
                          As equipas serão criadas quando o evento tiver
                          inscrições confirmadas.
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {tab === "players" && (
                <Card>
                  <CardHeader>
                    <span className="flex items-center gap-2">
                      <Users size={15} /> Jogadores ({confirmedPlayers.length})
                    </span>
                  </CardHeader>
                  <div className="space-y-2 mt-1">
                    {confirmedPlayers.map((p: any, i: number) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 py-1.5"
                      >
                        <span className="w-5 text-xs text-slate-400 text-right">
                          {i + 1}
                        </span>
                        <Avatar name={p.name} size="sm" />
                        <p className="flex-1 text-sm font-medium text-slate-700">
                          {p.name}
                        </p>
                        {p.position && (
                          <span className="text-xs text-slate-400 capitalize">
                            {p.position}
                          </span>
                        )}
                        {p.rating && (
                          <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5">
                            <Star size={11} fill="currentColor" /> {p.rating}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {tab === "rate" && (
                <Card>
                  <CardHeader>Avaliar jogadores — {event.name}</CardHeader>
                  {confirmedPlayers.filter((p: any) => p.id !== user?.id)
                    .length > 0 ? (
                    <RatingForm
                      eventId={event.id}
                      captainId={user?.id ?? "u1"}
                      players={confirmedPlayers.filter(
                        (p: any) => p.id !== user?.id,
                      )}
                    />
                  ) : (
                    <p className="text-center text-slate-400 py-8">
                      Nenhum jogador para avaliar.
                    </p>
                  )}
                </Card>
              )}
            </>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}
