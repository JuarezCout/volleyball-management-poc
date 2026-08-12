import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { EventCard } from "@/components/events/EventCard";
import { EventRegistrationModal } from "@/components/events/EventRegistrationModal";
import { Input } from "@/components/ui/Input";
import { eventService } from "@/services/eventService";
import type { Event } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function PlayerEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const userId = user?.id ?? "u2";
  const events = eventService.getUpcoming();
  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout title="Eventos">
      <div className="p-4 sm:p-6 space-y-4 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Eventos</h1>
          <p className="text-slate-500 text-sm">
            {filtered.length} eventos disponíveis
          </p>
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar eventos..."
          leftIcon={<Search size={14} />}
        />

        <div className="space-y-3">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUserId={userId}
              onView={(e) => navigate(`/player/events/${e.id}`)}
              onRegister={(e) => {
                if (!eventService.isUserRegistered(e, userId))
                  setSelectedEvent(e);
              }}
            />
          ))}
        </div>
      </div>

      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          userId={userId}
          open={true}
          onClose={() => setSelectedEvent(null)}
          onSuccess={() => {
            setSelectedEvent(null);
            navigate("/player/my-games");
          }}
        />
      )}
    </AppLayout>
  );
}
