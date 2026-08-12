import { useState } from "react";
import { Star, CheckCircle, Send } from "lucide-react";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ratingService } from "@/services/ratingService";
import { clsx } from "clsx";

interface RatingFormProps {
  eventId: string;
  captainId: string;
  players: User[];
  onSubmitted?: (scores: { playerId: string; score: number }[]) => void;
}

export function RatingForm({
  eventId,
  captainId,
  players,
  onSubmitted,
}: RatingFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(players.map((p) => [p.id, p.rating ?? 7])),
  );
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const setScore = (playerId: string, score: number) => {
    setScores((prev) => ({ ...prev, [playerId]: score }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const entries = Object.entries(scores).map(([playerId, score]) => ({
      playerId,
      score,
    }));
    ratingService.submitRatings(eventId, captainId, entries);
    setSubmitted(true);
    setLoading(false);
    onSubmitted?.(entries);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Avaliações enviadas!
        </h3>
        <p className="text-slate-500 text-sm">Os ratings foram actualizados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {players.map((player) => (
        <PlayerRatingRow
          key={player.id}
          player={player}
          score={scores[player.id] ?? 7}
          onScore={(score) => setScore(player.id, score)}
        />
      ))}

      <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>
        <Send size={16} />
        Enviar avaliações
      </Button>
    </div>
  );
}

function PlayerRatingRow({
  player,
  score,
  onScore,
}: {
  player: User;
  score: number;
  onScore: (s: number) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
      <Avatar name={player.name} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {player.name}
        </p>
        <p className="text-xs text-slate-400">
          {score > 8 ? "Excelente" : score > 6 ? "Bom" : "Regular"}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            onClick={() => onScore(n)}
            className={clsx(
              "w-7 h-7 rounded-lg text-xs font-bold transition-all",
              score >= n
                ? score >= 8
                  ? "bg-amber-400 text-white"
                  : "bg-primary-500 text-white"
                : "bg-white text-slate-300 hover:bg-slate-100",
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
