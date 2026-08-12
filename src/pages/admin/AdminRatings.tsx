import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ratingService } from "@/services/ratingService";
import { playerService } from "@/services/playerService";
import { mockUsers } from "@/mock";
import { Star, TrendingUp } from "lucide-react";
import { RatingChart } from "@/components/charts/Charts";
import { mockPlayerStats } from "@/mock/ratings";

export function AdminRatings() {
  const players = playerService.getAll().filter((p) => p.rating);
  const sorted = [...players].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <AppLayout title="Ratings">
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ratings</h1>
          <p className="text-slate-500 text-sm">
            Avaliação dos jogadores do clube
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Ranking */}
          <Card>
            <CardHeader>Ranking do clube</CardHeader>
            <div className="space-y-2">
              {sorted.slice(0, 10).map((player, i) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 py-2 hover:bg-slate-50 rounded-xl px-2"
                >
                  <span
                    className={`w-6 text-center text-sm font-bold ${i < 3 ? "text-amber-500" : "text-slate-400"}`}
                  >
                    {i + 1}
                  </span>
                  <Avatar name={player.name} size="sm" />
                  <p className="flex-1 text-sm font-medium text-slate-700">
                    {player.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-slate-700">
                      {player.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* João's evolution chart as example */}
          <Card>
            <CardHeader>Evolução — João Silva</CardHeader>
            <div className="mb-2 flex items-center gap-3">
              <Avatar name="João Silva" size="sm" />
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  João Silva
                </p>
                <p className="text-xs text-slate-400">
                  34 participações · 29 avaliações
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-slate-800">8.2</p>
                <p className="text-xs text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp size={10} /> +0.6
                </p>
              </div>
            </div>
            <RatingChart
              data={mockPlayerStats["u2"]?.ratingHistory ?? []}
              height={170}
            />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
