import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Star, Send } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, EventStatusBadge } from "@/components/ui/Badge";
import { TeamBuilder } from "@/components/teams/TeamBuilder";
import { RatingForm } from "@/components/ratings/RatingForm";
import { Tabs } from "@/components/ui/Tabs";
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

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/captain/events")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

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

        <Tabs
          tabs={[
            { id: "teams", label: "Equipes" },
            { id: "rate", label: "Avaliar jogadores" },
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

              {tab === "rate" && (
                <Card>
                  <CardHeader>Avaliar jogadores — {event.name}</CardHeader>
                  {confirmedPlayers.filter((p) => p.id !== user?.id).length >
                  0 ? (
                    <RatingForm
                      eventId={event.id}
                      captainId={user?.id ?? "u1"}
                      players={confirmedPlayers.filter(
                        (p) => p.id !== user?.id,
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
