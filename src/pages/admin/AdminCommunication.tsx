import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { TelegramPreview } from "@/components/messaging/TelegramPreview";
import { groupService } from "@/services/groupService";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, Mail, Phone, Wifi, WifiOff } from "lucide-react";

export function AdminCommunication() {
  const groups = groupService.getAll();

  return (
    <AppLayout title="Comunicação">
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Comunicação</h1>
          <p className="text-slate-500 text-sm">
            Canais de notificação do clube
          </p>
        </div>

        {/* Global channels */}
        <Card>
          <CardHeader>Canais globais</CardHeader>
          <div className="space-y-3">
            <ChannelRow
              icon={<MessageSquare size={18} className="text-blue-500" />}
              name="Telegram"
              status="connected"
              detail="2 grupos conectados"
            />
            <ChannelRow
              icon={<Phone size={18} className="text-green-500" />}
              name="WhatsApp"
              status="pending"
              detail="Configuração pendente"
            />
            <ChannelRow
              icon={<Mail size={18} className="text-slate-500" />}
              name="Email"
              status="connected"
              detail="contato@voleiclub.pt"
            />
          </div>
        </Card>

        {/* Group channels */}
        <Card>
          <CardHeader>Canais por grupo</CardHeader>
          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: group.coverColor }}
                />
                <p className="flex-1 text-sm font-medium text-slate-700">
                  {group.name}
                </p>
                <div className="flex items-center gap-3">
                  {group.telegramGroupId ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                      <Wifi size={12} /> Telegram
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <WifiOff size={12} /> Sem Telegram
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Telegram test for main group */}
        <Card>
          <CardHeader>Testar Telegram — Terça-feira</CardHeader>
          <TelegramPreview groupId="g2" groupName="Terça-feira" />
        </Card>
      </div>
    </AppLayout>
  );
}

function ChannelRow({
  icon,
  name,
  status,
  detail,
}: {
  icon: React.ReactNode;
  name: string;
  status: "connected" | "pending" | "disconnected";
  detail: string;
}) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-700">{name}</p>
        <p className="text-xs text-slate-400">{detail}</p>
      </div>
      <Badge
        variant={
          status === "connected"
            ? "success"
            : status === "pending"
              ? "warning"
              : "danger"
        }
        dot
      >
        {status === "connected"
          ? "Conectado"
          : status === "pending"
            ? "Pendente"
            : "Desconectado"}
      </Badge>
    </div>
  );
}
