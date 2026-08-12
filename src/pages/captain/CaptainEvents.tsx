import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EventStatusBadge } from "@/components/ui/Badge";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { eventService } from "@/services/eventService";

export function CaptainEvents() {
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const events = eventService
    .getByGroup("g2")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <AppLayout title="Meus Jogos">
      <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Meus Jogos</h1>
            <p className="text-slate-500 text-sm">
              Terça-feira — Intermediário
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> Criar jogo
          </Button>
        </div>

        <Card padding="none">
          {events.map((event) => {
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
                className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/captain/events/${event.id}`)}
              >
                <div className="w-14 text-center">
                  <p className="text-xs text-slate-400">{dateLabel}</p>
                  <p className="text-base font-bold text-slate-800">
                    {event.time}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {event.name}
                  </p>
                  <p className="text-xs text-slate-400">{event.location}</p>
                </div>
                <p className="text-sm font-bold text-slate-600">
                  {confirmed}/{total}
                </p>
                <EventStatusBadge status={event.status} />
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            );
          })}
        </Card>
      </div>

      <CreateEventModal
        open={createOpen}
        groupId="g2"
        onClose={() => setCreateOpen(false)}
      />
    </AppLayout>
  );
}
