import { useState } from "react";
import { Bell, Check, Mail, MessageSquare, Phone, Send, Wifi, WifiOff } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { groupService } from "@/services/groupService";
import { clsx } from "clsx";

// Notification template definitions aligned with prompt section 32/43
const NOTIFICATION_TEMPLATES = [
  {
    id: "new_event",
    label: "Novo evento",
    icon: "🏐",
    preview: (group: string, name: string, time: string, location: string) => ({
      title: `🏐 Novo evento — ${group}`,
      lines: [name, time, location],
      cta: "Ver evento",
      color: "blue",
    }),
  },
  {
    id: "last_minute",
    label: "Vaga de última hora",
    icon: "🚨",
    preview: (_group: string, name: string, time: string) => ({
      title: "🚨 VAGA DE ÚLTIMA HORA",
      lines: [`1 vaga disponível em ${name}`, time],
      cta: "Garantir vaga",
      color: "red",
    }),
  },
  {
    id: "court_opened",
    label: "Nova quadra aberta",
    icon: "🏟️",
    preview: (_g: string, name: string, time: string) => ({
      title: "🏟️ Nova quadra aberta",
      lines: [name, `Quadra 2 aberta — vagas disponíveis`, time],
      cta: "Inscrever-me",
      color: "amber",
    }),
  },
  {
    id: "event_full",
    label: "Evento lotado",
    icon: "🔴",
    preview: (_g: string, name: string) => ({
      title: "🔴 Evento lotado",
      lines: [name, "Todas as vagas preenchidas.", "Podes entrar na lista de backup."],
      cta: "Lista de Backup",
      color: "slate",
    }),
  },
  {
    id: "payment_reminder",
    label: "Lembrete de pagamento",
    icon: "💳",
    preview: (_g: string, name: string, time: string) => ({
      title: "💳 Lembrete de pagamento",
      lines: [name, `Prazo: ${time}`, "O teu lugar será libertado se não pagares a tempo."],
      cta: "Pagar agora",
      color: "orange",
    }),
  },
  {
    id: "backup_promoted",
    label: "Backup promovido",
    icon: "🟢",
    preview: (_g: string, name: string, time: string) => ({
      title: "🟢 Estás confirmado!",
      lines: [`Foste promovido de backup para confirmado em ${name}`, time, "Completa o pagamento para garantir a tua vaga."],
      cta: "Confirmar pagamento",
      color: "emerald",
    }),
  },
  {
    id: "rating_available",
    label: "Avaliação disponível",
    icon: "⭐",
    preview: (_g: string, name: string) => ({
      title: "⭐ Avaliação disponível",
      lines: [name, "O capitão avaliou os jogadores.", "Podes ver o teu rating atualizado."],
      cta: "Ver rating",
      color: "yellow",
    }),
  },
  {
    id: "event_cancelled",
    label: "Evento cancelado",
    icon: "❌",
    preview: (_g: string, name: string, time: string) => ({
      title: "❌ Evento cancelado",
      lines: [name, time, "O evento foi cancelado. Lamentamos o inconveniente."],
      cta: null,
      color: "red",
    }),
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; cta: string }> = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-200",    cta: "bg-blue-600 text-white" },
  red:     { bg: "bg-red-50",     border: "border-red-200",     cta: "bg-red-600 text-white" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   cta: "bg-amber-600 text-white" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", cta: "bg-emerald-600 text-white" },
  orange:  { bg: "bg-orange-50",  border: "border-orange-200",  cta: "bg-orange-600 text-white" },
  yellow:  { bg: "bg-yellow-50",  border: "border-yellow-200",  cta: "bg-yellow-600 text-black" },
  slate:   { bg: "bg-slate-50",   border: "border-slate-200",   cta: "bg-slate-600 text-white" },
};

export function AdminCommunication() {
  const groups = groupService.getAll();
  const [activeTemplate, setActiveTemplate] = useState("new_event");
  const [sent, setSent] = useState<string[]>([]);

  const template = NOTIFICATION_TEMPLATES.find((t) => t.id === activeTemplate)!;
  const preview = template.preview(
    "Terça-feira",
    "Terça-feira — 20:00",
    "Terça, 20:00–22:00",
    "Clube Central",
  );
  const colors = COLOR_MAP[preview.color] ?? COLOR_MAP.blue;

  function handleSend() {
    setSent((prev) => [...prev, activeTemplate]);
    setTimeout(() => setSent((prev) => prev.filter((id) => id !== activeTemplate)), 3000);
  }

  return (
    <AppLayout title="Comunicação">
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Comunicação</h1>
          <p className="text-slate-500 text-sm">Canais de notificação e simulação de mensagens</p>
        </div>

        {/* ── Channel status ────────────────────────────────────────────── */}
        <Card>
          <CardHeader>Canais</CardHeader>
          <div className="space-y-3">
            <ChannelRow icon={<MessageSquare size={18} className="text-blue-500" />}
              name="Telegram" status="connected" detail="2 grupos conectados" />
            <ChannelRow icon={<Phone size={18} className="text-green-500" />}
              name="WhatsApp" status="pending" detail="Configuração pendente — MVP" />
            <ChannelRow icon={<Mail size={18} className="text-slate-500" />}
              name="Email" status="connected" detail="contato@voleiclub.pt" />
          </div>
        </Card>

        {/* ── Group channels ────────────────────────────────────────────── */}
        <Card>
          <CardHeader>Canais por grupo</CardHeader>
          <div className="space-y-2">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: group.coverColor }} />
                <p className="flex-1 text-sm font-medium text-slate-700">{group.name}</p>
                {group.telegramGroupId
                  ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Wifi size={12} /> Telegram</span>
                  : <span className="flex items-center gap-1 text-xs text-slate-400"><WifiOff size={12} /> Sem canal</span>
                }
              </div>
            ))}
          </div>
        </Card>

        {/* ── Notification simulation ───────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Type selector */}
          <Card>
            <CardHeader>
              <span className="flex items-center gap-2"><Bell size={15} /> Tipos de notificação</span>
            </CardHeader>
            <div className="space-y-1 mt-1">
              {NOTIFICATION_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={clsx(
                    "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                    activeTemplate === t.id
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  <span>{t.icon}</span>
                  <span className="flex-1">{t.label}</span>
                  {sent.includes(t.id) && <Check size={14} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          </Card>

          {/* Message preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>Pré-visualização — Telegram</CardHeader>
              <div className="mt-3">
                {/* Telegram-style message bubble */}
                <div className="bg-slate-100 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">V</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">VoleiClub Bot</span>
                  </div>
                  <div className={clsx("rounded-xl p-3 border", colors.bg, colors.border)}>
                    <p className="text-sm font-bold text-slate-800 mb-2">{preview.title}</p>
                    {preview.lines.map((line, i) => (
                      <p key={i} className="text-sm text-slate-600 leading-relaxed">{line}</p>
                    ))}
                    {preview.cta && (
                      <button className={clsx("mt-3 text-xs font-semibold px-4 py-2 rounded-lg w-full", colors.cta)}>
                        {preview.cta}
                      </button>
                    )}
                  </div>
                  <p className="text-right text-xs text-slate-400 mt-1">20:15 ✓✓</p>
                </div>
              </div>
            </Card>

            <Button fullWidth onClick={handleSend}>
              {sent.includes(activeTemplate)
                ? <><Check size={16} /> Enviado!</>
                : <><Send size={16} /> Simular envio ao grupo</>
              }
            </Button>

            <p className="text-xs text-slate-400 text-center">
              Na POC o envio é simulado. No MVP as mensagens serão enviadas ao Telegram real.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ChannelRow({ icon, name, status, detail }: {
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
      <Badge variant={status === "connected" ? "success" : status === "pending" ? "warning" : "danger"} dot>
        {status === "connected" ? "Conectado" : status === "pending" ? "Pendente" : "Desconectado"}
      </Badge>
    </div>
  );
}
