import { useState } from "react";
import { CheckCircle, Users, Vote } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockPolls } from "@/mock";
import { groupService } from "@/services/groupService";
import { useAuth } from "@/context/AuthContext";
import type { Poll } from "@/types";
import { clsx } from "clsx";

let pollsStore = [...mockPolls];

export function PlayerPolls() {
  const { user } = useAuth();
  const userId = user?.id ?? "u2";
  const [polls, setPolls] = useState(pollsStore.filter((p) => p.status === "open"));

  function vote(pollId: string, optionId: string) {
    const updated = polls.map((poll) => {
      if (poll.id !== pollId) return poll;
      // Remove previous vote from this user in same poll
      const opts = poll.options.map((opt) => ({
        ...opt,
        votes: opt.id === optionId
          ? opt.votes.includes(userId) ? opt.votes.filter((v) => v !== userId) : [...opt.votes, userId]
          : opt.votes.filter((v) => v !== userId),
      }));
      return { ...poll, options: opts };
    });
    setPolls(updated);
  }

  return (
    <AppLayout title="Votações">
      <div className="p-4 sm:p-6 space-y-4 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Votações de Horário</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Vota no horário que preferes para os próximos jogos
          </p>
        </div>

        {polls.length === 0 ? (
          <Card>
            <div className="text-center py-10">
              <Vote size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500">Nenhuma votação aberta</p>
            </div>
          </Card>
        ) : (
          polls.map((poll) => <PollCard key={poll.id} poll={poll} userId={userId} onVote={vote} />)
        )}
      </div>
    </AppLayout>
  );
}

function PollCard({ poll, userId, onVote }: { poll: Poll; userId: string; onVote: (pid: string, oid: string) => void }) {
  const group = groupService.getById(poll.groupId);
  const totalVotes = poll.options.reduce((s, o) => s + o.votes.length, 0);
  const myVote = poll.options.find((o) => o.votes.includes(userId))?.id;

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          {group && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full mr-2"
              style={{ background: group.coverColor + "20", color: group.coverColor }}>
              {group.name}
            </span>
          )}
          <p className="font-semibold text-slate-800 mt-1">{poll.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{totalVotes} votos · {poll.options.length} opções</p>
        </div>
        {myVote && (
          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium shrink-0">
            <CheckCircle size={12} /> Votado
          </span>
        )}
      </div>

      <div className="space-y-2">
        {poll.options.map((opt) => {
          const pct = totalVotes > 0 ? (opt.votes.length / totalVotes) * 100 : 0;
          const isMyVote = opt.id === myVote;
          const dateStr = new Date(opt.date + "T00:00:00").toLocaleDateString("pt-PT", {
            weekday: "short", day: "numeric", month: "short",
          });

          return (
            <button
              key={opt.id}
              onClick={() => onVote(poll.id, opt.id)}
              className={clsx(
                "w-full text-left rounded-xl p-3 border transition-all",
                isMyVote
                  ? "border-primary-400 bg-primary-50"
                  : "border-slate-200 hover:border-primary-300 hover:bg-slate-50",
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">
                  {dateStr} às {opt.time}
                </span>
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{opt.votes.length}</span>
                  {isMyVote && <CheckCircle size={14} className="text-primary-600" />}
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={clsx("h-full rounded-full", isMyVote ? "bg-primary-500" : "bg-slate-300")}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        {myVote ? "Clica novamente para remover o teu voto." : "Clica para votar no teu horário preferido."}
      </p>
    </Card>
  );
}
