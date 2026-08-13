import { useState } from "react";
import {
  BarChart2,
  CheckCircle,
  ChevronRight,
  Clock,
  Plus,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { mockPolls } from "@/mock";
import { mockUsers } from "@/mock";
import { groupService } from "@/services/groupService";
import type { Poll, PollOption } from "@/types";
import { clsx } from "clsx";

// Simple in-memory mutable store for POC
let pollsStore = [...mockPolls];

export function AdminPolls() {
  const [polls, setPolls] = useState(pollsStore);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Poll | null>(null);

  function closePoll(pollId: string) {
    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return;
    const winner = [...poll.options].sort((a, b) => b.votes.length - a.votes.length)[0];
    const updated = polls.map((p) =>
      p.id === pollId
        ? { ...p, status: "closed" as const, closedAt: new Date().toISOString(), winningOptionId: winner.id }
        : p,
    );
    setPolls(updated);
    pollsStore = updated;
    setSelected(updated.find((p) => p.id === pollId) ?? null);
  }

  function createEventFromPoll(poll: Poll) {
    const updated = polls.map((p) =>
      p.id === poll.id ? { ...p, status: "event_created" as const, eventId: `e${Date.now()}` } : p,
    );
    setPolls(updated);
    pollsStore = updated;
    setSelected(updated.find((p) => p.id === poll.id) ?? null);
  }

  return (
    <AppLayout title="Enquetes">
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Enquetes de Horário</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Crie votações para definir horários de eventos
            </p>
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus size={16} /> Nova enquete
          </Button>
        </div>

        {/* Poll list */}
        <div className="space-y-3">
          {polls.map((poll) => {
            const group = groupService.getById(poll.groupId);
            const totalVotes = poll.options.reduce((s, o) => s + o.votes.length, 0);
            const topOption = [...poll.options].sort((a, b) => b.votes.length - a.votes.length)[0];

            return (
              <Card
                key={poll.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelected(poll)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {group && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: group.coverColor + "20", color: group.coverColor }}
                        >
                          {group.name}
                        </span>
                      )}
                      <PollStatusBadge status={poll.status} />
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">{poll.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {poll.options.length} opções · {totalVotes} votos
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {poll.status === "open" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); closePoll(poll.id); }}
                      >
                        Fechar enquete
                      </Button>
                    )}
                    {poll.status === "closed" && !poll.eventId && (
                      <Button
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); createEventFromPoll(poll); }}
                      >
                        <Trophy size={14} /> Criar evento
                      </Button>
                    )}
                    {poll.status === "event_created" && (
                      <Badge variant="success" size="sm">Evento criado</Badge>
                    )}
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="mt-3 space-y-1.5">
                  {poll.options.slice(0, 3).map((opt) => {
                    const pct = totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0;
                    const isWinner = poll.winningOptionId === opt.id;
                    return (
                      <div key={opt.id} className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-10 shrink-0">{opt.time}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={clsx("h-full rounded-full", isWinner ? "bg-emerald-500" : "bg-primary-400")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-6 text-right">{opt.votes.length}</span>
                        {isWinner && <CheckCircle size={12} className="text-emerald-500" />}
                      </div>
                    );
                  })}
                  {poll.options.length > 3 && (
                    <p className="text-xs text-slate-400">+{poll.options.length - 3} mais opções</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Poll Detail Modal */}
        {selected && (
          <PollDetailModal
            poll={selected}
            onClose={() => setSelected(null)}
            onClose_poll={() => { closePoll(selected.id); }}
            onCreateEvent={() => { createEventFromPoll(selected); }}
          />
        )}

        {/* Create Poll Modal */}
        {creating && <CreatePollModal onClose={() => setCreating(false)} onCreated={(p) => {
          const updated = [...polls, p];
          setPolls(updated);
          pollsStore = updated;
          setCreating(false);
        }} />}
      </div>
    </AppLayout>
  );
}

// ── Poll Detail Modal ─────────────────────────────────────────────────────────

function PollDetailModal({
  poll, onClose, onClose_poll, onCreateEvent,
}: {
  poll: Poll;
  onClose: () => void;
  onClose_poll: () => void;
  onCreateEvent: () => void;
}) {
  const group = groupService.getById(poll.groupId);
  const totalVotes = poll.options.reduce((s, o) => s + o.votes.length, 0);
  const sorted = [...poll.options].sort((a, b) => b.votes.length - a.votes.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {group && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: group.coverColor + "20", color: group.coverColor }}>
                    {group.name}
                  </span>
                )}
                <PollStatusBadge status={poll.status} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">{poll.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{totalVotes} votos totais</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {sorted.map((opt, i) => {
              const pct = totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0;
              const isWinner = poll.winningOptionId === opt.id;
              const voters = opt.votes.map((uid) => mockUsers.find((u) => u.id === uid)).filter(Boolean);

              return (
                <div key={opt.id}
                  className={clsx("rounded-xl p-3 border", isWinner ? "border-emerald-200 bg-emerald-50" : "border-slate-100")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isWinner && <CheckCircle size={14} className="text-emerald-600" />}
                      <span className="text-sm font-semibold text-slate-700">
                        {new Date(opt.date + "T00:00:00").toLocaleDateString("pt-PT", {
                          weekday: "short", day: "numeric", month: "short",
                        })} às {opt.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{opt.votes.length}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={clsx("h-full rounded-full", isWinner ? "bg-emerald-500" : "bg-primary-400")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {voters.map((u: any) => (
                      <span key={u.id} className="text-xs bg-white border border-slate-200 rounded-full px-2 py-0.5 text-slate-600">
                        {u.preferredName ?? u.name.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex gap-2 justify-end">
            {poll.status === "open" && (
              <Button onClick={onClose_poll} variant="outline">
                Fechar enquete
              </Button>
            )}
            {poll.status === "closed" && !poll.eventId && (
              <Button onClick={onCreateEvent}>
                <Trophy size={14} /> Criar evento com horário vencedor
              </Button>
            )}
            {poll.status === "event_created" && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                <CheckCircle size={16} /> Evento criado com sucesso
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create Poll Modal ─────────────────────────────────────────────────────────

function CreatePollModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: Poll) => void }) {
  const groups = groupService.getAll();
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [times, setTimes] = useState(["18:00", "19:00", "20:00", "21:00"]);
  const [date, setDate] = useState("2026-08-26");

  function handleCreate() {
    const poll: Poll = {
      id: `poll${Date.now()}`,
      groupId,
      title: title || `${groups.find((g) => g.id === groupId)?.name} — Enquete de Horário`,
      options: times.filter(Boolean).map((t, i) => ({
        id: `o-${Date.now()}-${i}`,
        date,
        time: t,
        votes: [],
      })),
      status: "open",
      createdBy: "u0",
      createdAt: new Date().toISOString(),
    };
    onCreated(poll);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Nova Enquete</h2>
            <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Grupo</label>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400">
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Título (opcional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Terça-feira — Que horário preferes?"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-2">
              Horários para votar
            </label>
            <div className="space-y-2">
              {times.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="time" value={t}
                    onChange={(e) => setTimes(times.map((x, j) => j === i ? e.target.value : x))}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400" />
                  {times.length > 2 && (
                    <button onClick={() => setTimes(times.filter((_, j) => j !== i))}
                      className="text-slate-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              {times.length < 6 && (
                <button onClick={() => setTimes([...times, ""])}
                  className="text-xs text-primary-600 flex items-center gap-1 hover:underline">
                  <Plus size={12} /> Adicionar horário
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={onClose}>Cancelar</Button>
            <Button fullWidth onClick={handleCreate}>Publicar enquete</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PollStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    open:          { label: "Aberta",        cls: "bg-blue-100 text-blue-700" },
    closed:        { label: "Fechada",       cls: "bg-amber-100 text-amber-700" },
    event_created: { label: "Evento criado", cls: "bg-emerald-100 text-emerald-700" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-slate-100 text-slate-600" };
  return <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full", cls)}>{label}</span>;
}
