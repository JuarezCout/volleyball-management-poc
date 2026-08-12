import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { PaymentBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { paymentService } from "@/services/paymentService";
import { playerService } from "@/services/playerService";
import { eventService } from "@/services/eventService";
import { Euro, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/Tabs";

export function AdminPayments() {
  const payments = paymentService.getAll();
  const paid = payments.filter((p) => p.status === "paid");
  const pending = payments.filter((p) => p.status === "pending");
  const totalRevenue = paid.reduce((s, p) => s + p.amount, 0);

  return (
    <AppLayout title="Pagamentos">
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pagamentos</h1>
          <p className="text-slate-500 text-sm">{payments.length} transações</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total arrecadado"
            value={`€${totalRevenue}`}
            icon={<Euro size={20} />}
            color="text-emerald-600"
          />
          <StatCard
            label="Confirmados"
            value={paid.length.toString()}
            icon={<CheckCircle size={20} />}
            color="text-primary-600"
          />
          <StatCard
            label="Pendentes"
            value={pending.length.toString()}
            icon={<Clock size={20} />}
            color="text-amber-600"
          />
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">
                    Jogador
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden sm:table-cell">
                    Evento
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                    Valor
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">
                    Método
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3">
                    Status
                  </th>
                  <th className="text-center text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const player = playerService.getById(p.userId);
                  const event = eventService.getById(p.eventId);
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-50 hover:bg-slate-50"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {player && <Avatar name={player.name} size="sm" />}
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {player?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-slate-500 max-w-32 truncate">
                          {event?.name}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-slate-700">
                          €{p.amount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className="text-xs text-slate-500 capitalize">
                          {p.method === "stripe"
                            ? "Cartão"
                            : p.method === "transfer"
                              ? "Transferência"
                              : p.method === "free"
                                ? "Isento"
                                : p.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <PaymentBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <span className="text-xs text-slate-400">
                          {(p.paidAt ?? p.createdAt)
                            .slice(0, 10)
                            .split("-")
                            .reverse()
                            .join("/")}
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
