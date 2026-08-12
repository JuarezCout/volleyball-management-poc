import { useState } from "react";
import { Crown, UserPlus, X, Users, ChevronRight, Star } from "lucide-react";
import { clsx } from "clsx";
import type { Team, User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { teamService } from "@/services/teamService";

interface TeamBuilderProps {
  teams: Team[];
  availablePlayers: User[];
  readOnly?: boolean;
  onUpdate?: () => void;
}

export function TeamBuilder({
  teams,
  availablePlayers,
  readOnly,
  onUpdate,
}: TeamBuilderProps) {
  const [localTeams, setLocalTeams] = useState(teams);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [targetSlot, setTargetSlot] = useState<{
    teamId: string;
    type: "player" | "backup";
  } | null>(null);

  const assignedIds = new Set(
    localTeams.flatMap((t) => [...t.playerIds, ...t.backupIds]),
  );

  const handleSlotClick = (teamId: string, type: "player" | "backup") => {
    if (readOnly) return;
    setTargetSlot({ teamId, type });
  };

  const handlePlayerSelect = (userId: string) => {
    if (!targetSlot) return;
    const { teamId, type } = targetSlot;
    const success =
      type === "player"
        ? teamService.addPlayerToTeam(teamId, userId)
        : teamService.addBackupToTeam(teamId, userId);

    if (success) {
      setLocalTeams(teamService.getByEvent(localTeams[0].eventId));
      onUpdate?.();
    }
    setTargetSlot(null);
    setSelectedPlayer(null);
  };

  const handleRemove = (teamId: string, userId: string) => {
    if (readOnly) return;
    teamService.removePlayerFromTeam(teamId, userId);
    setLocalTeams(teamService.getByEvent(localTeams[0].eventId));
    onUpdate?.();
  };

  return (
    <div className="space-y-4">
      {/* Teams grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {localTeams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            players={availablePlayers}
            readOnly={readOnly}
            onSlotClick={handleSlotClick}
            onRemove={handleRemove}
            isTargeted={targetSlot?.teamId === team.id}
          />
        ))}
      </div>

      {/* Player selector panel */}
      {targetSlot && (
        <div className="bg-white rounded-2xl border border-primary-200 shadow-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">
              Selecionar {targetSlot.type === "player" ? "jogador" : "backup"}
            </p>
            <button
              onClick={() => setTargetSlot(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {availablePlayers
              .filter((p) => !assignedIds.has(p.id))
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerSelect(player.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary-50 transition-colors text-left border border-transparent hover:border-primary-200"
                >
                  <Avatar name={player.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {player.name}
                    </p>
                    {player.rating && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Star size={10} /> {player.rating}
                      </p>
                    )}
                  </div>
                </button>
              ))}
          </div>
          {availablePlayers.filter((p) => !assignedIds.has(p.id)).length ===
            0 && (
            <p className="text-sm text-slate-400 text-center py-2">
              Todos os jogadores já estão alocados
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface TeamCardProps {
  team: Team;
  players: User[];
  readOnly?: boolean;
  onSlotClick: (teamId: string, type: "player" | "backup") => void;
  onRemove: (teamId: string, userId: string) => void;
  isTargeted?: boolean;
}

function TeamCard({
  team,
  players,
  readOnly,
  onSlotClick,
  onRemove,
  isTargeted,
}: TeamCardProps) {
  const getPlayer = (id: string) => players.find((p) => p.id === id);
  const emptyPlayerSlots = team.maxPlayers - team.playerIds.length;
  const emptyBackupSlots = team.maxBackups - team.backupIds.length;
  const isFull =
    team.playerIds.length >= team.maxPlayers &&
    team.backupIds.length >= team.maxBackups;

  return (
    <div
      className={clsx(
        "rounded-2xl border overflow-hidden transition-all",
        isTargeted
          ? "border-primary-300 shadow-md"
          : "border-slate-100 shadow-card",
      )}
    >
      {/* Team header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: team.color + "18" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: team.color }}
          />
          <p className="font-semibold text-slate-800">{team.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isFull ? "success" : "warning"} size="sm">
            {team.playerIds.length}/{team.maxPlayers}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Captain */}
        {team.captainId &&
          (() => {
            const cap = getPlayer(team.captainId!);
            return cap ? (
              <div className="flex items-center gap-2.5 py-1">
                <Crown size={14} className="text-amber-500 flex-shrink-0" />
                <Avatar name={cap.name} size="xs" />
                <p className="text-sm font-semibold text-slate-700">
                  {cap.name}
                </p>
                <Badge variant="orange" size="sm">
                  Capitão
                </Badge>
              </div>
            ) : null;
          })()}

        {/* Players */}
        <div>
          <p className="text-xs text-slate-400 font-medium mb-2">Jogadores</p>
          <div className="space-y-1.5">
            {team.playerIds
              .filter((id) => id !== team.captainId)
              .map((id) => {
                const p = getPlayer(id);
                if (!p) return null;
                return (
                  <PlayerSlot
                    key={id}
                    name={p.name}
                    rating={p.rating}
                    onRemove={
                      readOnly ? undefined : () => onRemove(team.id, id)
                    }
                  />
                );
              })}
            {!readOnly &&
              Array.from({ length: emptyPlayerSlots }).map((_, i) => (
                <EmptySlot
                  key={`ep-${i}`}
                  onClick={() => onSlotClick(team.id, "player")}
                  label="+ Adicionar jogador"
                />
              ))}
          </div>
        </div>

        {/* Backups */}
        {team.maxBackups > 0 && (
          <div>
            <p className="text-xs text-slate-400 font-medium mb-2">
              Backups ({team.backupIds.length}/{team.maxBackups})
            </p>
            <div className="space-y-1.5">
              {team.backupIds.map((id) => {
                const p = getPlayer(id);
                if (!p) return null;
                return (
                  <PlayerSlot
                    key={id}
                    name={p.name}
                    rating={p.rating}
                    isBackup
                    onRemove={
                      readOnly ? undefined : () => onRemove(team.id, id)
                    }
                  />
                );
              })}
              {!readOnly &&
                Array.from({ length: emptyBackupSlots }).map((_, i) => (
                  <EmptySlot
                    key={`eb-${i}`}
                    onClick={() => onSlotClick(team.id, "backup")}
                    label="+ Adicionar backup"
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerSlot({
  name,
  rating,
  isBackup,
  onRemove,
}: {
  name: string;
  rating?: number;
  isBackup?: boolean;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-50 group">
      <Avatar name={name} size="xs" className={isBackup ? "opacity-60" : ""} />
      <p
        className={clsx(
          "text-sm flex-1",
          isBackup ? "text-slate-400" : "text-slate-700",
        )}
      >
        {name}
      </p>
      {rating && (
        <p className="text-xs text-slate-400 flex items-center gap-0.5">
          <Star size={10} />
          {rating}
        </p>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function EmptySlot({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg border border-dashed border-slate-200 text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-colors text-sm"
    >
      <UserPlus size={14} />
      {label}
    </button>
  );
}
