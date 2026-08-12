import { Calendar, MapPin, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ratingService } from "@/services/ratingService";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/context/AuthContext";
import { mockPlayerStats } from "@/mock/ratings";

export function PlayerHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "u2";
  const stats = mockPlayerStats[userId];

  if (!stats) {
    return (
      <AppLayout title="Histórico">
        <div className="p-6 text-center text-slate-400">
          Sem histórico ainda.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Histórico">
      <div className="p-4 sm:p-6 space-y-4 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Histórico</h1>
          <p className="text-slate-500 text-sm">
            {stats.totalParticipations} participações
          </p>
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                    Data
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">
                    Evento
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.ratingHistory
                  .slice()
                  .reverse()
                  .map((h, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-50 hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-slate-700">
                          {h.date}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-600">Terça 20h</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star
                            size={13}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span className="text-sm font-bold text-slate-700">
                            {h.score}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
