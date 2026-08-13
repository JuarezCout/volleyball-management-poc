import { useState } from "react";
import { Search, Star, Users, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { playerService } from "@/services/playerService";
import { groupService } from "@/services/groupService";

const POSITION_LABELS: Record<string, string> = {
  libero: "Líbero",
  setter: "Levantador",
  outside: "Ponteiro",
  middle: "Central",
  opposite: "Oposto",
  universal: "Universal",
};

export function AdminPlayers() {
  const [search, setSearch] = useState("");
  const players = playerService.getAll();

  const filtered = players.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout title="Jogadores">
      <div className="p-4 sm:p-6 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Jogadores</h1>
            <p className="text-slate-500 text-sm">
              {players.length} jogadores registados
            </p>
          </div>
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar jogadores..."
          leftIcon={<Search size={14} />}
        />

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                    Jogador
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">
                    Grupos
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden sm:table-cell">
                    Posição
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                    Rating
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">
                    Membro desde
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((player) => {
                  const groups = groupService.getByMember(player.id);
                  return (
                    <tr
                      key={player.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={player.name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {player.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {player.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {groups.slice(0, 2).map((g) => (
                            <span
                              key={g.id}
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                background: g.coverColor + "20",
                                color: g.coverColor,
                              }}
                            >
                              {g.name}
                            </span>
                          ))}
                          {groups.length > 2 && (
                            <span className="text-xs text-slate-400">
                              +{groups.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-500">
                          {POSITION_LABELS[player.positions?.[0] ?? ""] ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {player.rating ? (
                          <div className="flex items-center justify-center gap-1">
                            <Star
                              size={12}
                              className="text-amber-400 fill-amber-400"
                            />
                            <span className="text-sm font-bold text-slate-700">
                              {player.rating}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-400">
                          {player.joinedAt.split("-").reverse().join("/")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
