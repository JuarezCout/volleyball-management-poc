import { useNavigate } from "react-router-dom";
import { ChevronRight, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { RegistrationBadge, PaymentBadge } from "@/components/ui/Badge";
import { eventService } from "@/services/eventService";
import { teamService } from "@/services/teamService";
import { useAuth } from "@/context/AuthContext";

export function PlayerMyGames() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "u2";

  const myEvents = eventService
    .getRegisteredEvents(userId)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  return (
    <AppLayout title="Meus Jogos">
      <div className="p-4 sm:p-6 space-y-4 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meus Jogos</h1>
          <p className="text-slate-500 text-sm">{myEvents.length} inscrições</p>
        </div>

        {myEvents.length === 0 ? (
          <Card className="text-center py-10">
            <Calendar size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">Ainda sem inscrições</p>
          </Card>
        ) : (
          <Card padding="none">
            {myEvents.map((event) => {
              const reg = eventService.getUserRegistration(event, userId);
              const team = teamService
                .getByEvent(event.id)
                .find(
                  (t) =>
                    t.playerIds.includes(userId) ||
                    t.backupIds.includes(userId),
                );
              const dateLabel =
                event.date === "2026-08-12"
                  ? "Hoje"
                  : event.date === "2026-08-13"
                    ? "Amanhã"
                    : event.date.slice(5).split("-").reverse().join("/");
              const isPast = event.date < "2026-08-12";

              return (
                <div
                  key={event.id}
                  className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/player/events/${event.id}`)}
                >
                  <div className="w-14 text-center opacity-80">
                    <p className="text-xs text-slate-400">{dateLabel}</p>
                    <p className="text-base font-bold text-slate-700">
                      {event.time}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {event.name}
                    </p>
                    <p className="text-xs text-slate-400">{event.location}</p>
                    {team && (
                      <p className="text-xs text-primary-600 font-medium mt-0.5">
                        {team.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {reg && <RegistrationBadge status={reg.status} />}
                    {reg && <PaymentBadge status={reg.paymentStatus} />}
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 flex-shrink-0"
                  />
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
