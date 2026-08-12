import { TrendingUp, Star, Activity, Award } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { RatingChart } from "@/components/charts/Charts";
import { ratingService } from "@/services/ratingService";
import { useAuth } from "@/context/AuthContext";
import { mockPlayerStats } from "@/mock/ratings";
import { clsx } from "clsx";

export function PlayerRating() {
  const { user } = useAuth();
  const userId = user?.id ?? "u2";
  const stats = ratingService.getPlayerStats(userId);
  const history = ratingService.getPlayerRatings(userId);

  if (!stats) {
    return (
      <AppLayout title="Meu Rating">
        <div className="p-6 text-center text-slate-400">
          Ainda sem avaliações registadas.
        </div>
      </AppLayout>
    );
  }

  const getRatingLabel = (r: number) =>
    r >= 9
      ? "Excelente"
      : r >= 8
        ? "Muito Bom"
        : r >= 7
          ? "Bom"
          : r >= 5
            ? "Regular"
            : "A desenvolver";
  const getRatingColor = (r: number) =>
    r >= 9
      ? "text-emerald-600"
      : r >= 8
        ? "text-primary-600"
        : r >= 7
          ? "text-amber-600"
          : "text-slate-500";

  return (
    <AppLayout title="Meu Rating">
      <div className="p-4 sm:p-6 space-y-5 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meu Rating</h1>
        </div>

        {/* Main rating card */}
        <Card className="text-center">
          <Avatar name={user?.name ?? ""} size="xl" className="mx-auto mb-4" />
          <p className="font-semibold text-slate-700">{user?.name}</p>
          <div className="my-4">
            <p
              className={clsx(
                "text-6xl font-black",
                getRatingColor(stats.currentRating),
              )}
            >
              {stats.currentRating}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {getRatingLabel(stats.currentRating)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center mt-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-bold text-slate-800">
                {stats.totalParticipations}
              </p>
              <p className="text-xs text-slate-400">Participações</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-lg font-bold text-slate-800">
                {stats.totalRatings}
              </p>
              <p className="text-xs text-slate-400">Avaliações</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p
                className={clsx(
                  "text-lg font-bold",
                  stats.evolution >= 0 ? "text-emerald-600" : "text-red-500",
                )}
              >
                {stats.evolution >= 0 ? "+" : ""}
                {stats.evolution}
              </p>
              <p className="text-xs text-slate-400">Evolução</p>
            </div>
          </div>
        </Card>

        {/* Chart */}
        <Card>
          <CardHeader>Evolução do rating</CardHeader>
          <RatingChart data={stats.ratingHistory} height={200} />
        </Card>

        {/* History table */}
        <Card>
          <CardHeader>Últimas avaliações</CardHeader>
          <div className="space-y-2">
            {stats.ratingHistory
              .slice()
              .reverse()
              .map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Jogo de {h.date}
                    </p>
                  </div>
                  <div
                    className={clsx(
                      "flex items-center gap-1.5 text-base font-bold",
                      getRatingColor(h.score),
                    )}
                  >
                    <Star size={14} className="fill-current" />
                    {h.score}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
