import { useState } from "react";
import {
  Users,
  Calendar,
  MessageSquare,
  ChevronRight,
  Plus,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { groupService } from "@/services/groupService";
import { playerService } from "@/services/playerService";
import { clsx } from "clsx";

export function AdminGroups() {
  const navigate = useNavigate();
  const groups = groupService.getAll();

  return (
    <AppLayout title="Grupos">
      <div className="p-4 sm:p-6 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Grupos</h1>
            <p className="text-slate-500 text-sm">
              {groups.length} grupos activos
            </p>
          </div>
          <Button>
            <Plus size={16} /> Novo grupo
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => {
            const admin = playerService.getById(group.adminId);
            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden hover:shadow-card-hover transition-all cursor-pointer"
                onClick={() => navigate(`/admin/groups/${group.id}`)}
              >
                <div className="h-2" style={{ background: group.coverColor }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {group.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                        {group.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        group.status === "active" ? "success" : "default"
                      }
                      dot
                    >
                      {group.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-slate-800">
                        {group.memberCount}
                      </p>
                      <p className="text-xs text-slate-400">Membros</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-slate-800">
                        {group.eventIds.length}
                      </p>
                      <p className="text-xs text-slate-400">Eventos</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {admin && <Avatar name={admin.name} size="xs" />}
                      <p className="text-xs text-slate-500">
                        {admin?.name ?? "Admin"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {group.telegramGroupId && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Telegram
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
