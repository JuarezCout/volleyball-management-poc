import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EventStatusBadge } from "@/components/ui/Badge";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { eventService } from "@/services/eventService";
import { groupService } from "@/services/groupService";
import { clsx } from "clsx";

export function AdminEvents() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const events = eventService.getUpcoming();
  const filtered = events.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.status === filter;
    return matchSearch && matchFilter;
  });

  const statusFilters = [
    { id: "all", label: "Todos" },
    { id: "open", label: "Abertos" },
    { id: "full", label: "Esgotados" },
    { id: "in_progress", label: "Em Jogo" },
    { id: "finished", label: "Finalizados" },
  ];

  return (
    <AppLayout title="Eventos">
      <div className="p-4 sm:p-6 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Eventos</h1>
            <p className="text-slate-500 text-sm">
              {events.length} eventos próximos
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> Criar evento
          </Button>
        </div>

        {/* Filters */}
        <Card padding="sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar eventos..."
              leftIcon={<Search size={14} />}
              className="flex-1"
            />
            <div className="flex gap-1 overflow-x-auto">
              {statusFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors",
                    filter === f.id
                      ? "bg-primary-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Events table/list */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                    Evento
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden sm:table-cell">
                    Data
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">
                    Local
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                    Vagas
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                    Status
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => {
                  const group = groupService.getById(event.groupId);
                  const confirmed = eventService.getConfirmedCount(event);
                  const total = event.playersPerTeam * event.teamCount;
                  const dateLabel =
                    event.date === "2026-08-12"
                      ? "Hoje"
                      : event.date === "2026-08-13"
                        ? "Amanhã"
                        : event.date.slice(5).split("-").reverse().join("/");

                  return (
                    <tr
                      key={event.id}
                      className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/events/${event.id}`)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-8 rounded-full flex-shrink-0"
                            style={{
                              background: group?.coverColor ?? "#3b82f6",
                            }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {event.name}
                            </p>
                            {group && (
                              <p className="text-xs text-slate-400">
                                {group.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <p className="text-sm text-slate-700">{dateLabel}</p>
                        <p className="text-xs text-slate-400">{event.time}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-sm text-slate-500 max-w-32 truncate">
                          {event.location}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <p className="text-sm font-bold text-slate-700">
                          {confirmed}/{total}
                        </p>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 mx-auto">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{
                              width: `${Math.min((confirmed / total) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <EventStatusBadge status={event.status} />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-primary-600 font-medium">
                          Ver →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Calendar size={32} className="mx-auto mb-3 opacity-50" />
                <p>Nenhum evento encontrado</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </AppLayout>
  );
}
