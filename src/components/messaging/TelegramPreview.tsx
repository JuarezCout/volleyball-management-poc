import { useState } from "react";
import { Send, CheckCircle2, ExternalLink, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { telegramService } from "@/services/telegramService";
import { clsx } from "clsx";

interface TelegramPreviewProps {
  groupId: string;
  groupName: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventPrice?: number;
  eventSlots?: number;
  onSent?: () => void;
}

export function TelegramPreview({
  groupId,
  groupName,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  eventPrice,
  eventSlots,
  onSent,
}: TelegramPreviewProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const connected = telegramService.isConnected(groupId);

  const message = eventName
    ? telegramService.buildEventMessage({
        groupName,
        date: eventDate ?? "",
        time: eventTime ?? "",
        location: eventLocation ?? "",
        price: eventPrice ?? 0,
        slots: eventSlots ?? 0,
      })
    : `🏐 Olá, ${groupName}!\n\nMensagem de teste da plataforma VoleiClub.\n\n✅ Integração funcionando correctamente.`;

  const handleSend = async () => {
    setSending(true);
    await telegramService.sendTestMessage(groupId);
    setSending(false);
    setSent(true);
    onSent?.();
  };

  return (
    <div className="space-y-4">
      {/* Connection status */}
      <div
        className={clsx(
          "flex items-center justify-between p-3 rounded-xl",
          connected
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-amber-50 border border-amber-200",
        )}
      >
        <div className="flex items-center gap-2">
          {connected ? (
            <Wifi size={16} className="text-emerald-600" />
          ) : (
            <WifiOff size={16} className="text-amber-500" />
          )}
          <span className="text-sm font-medium text-slate-700">
            Telegram — {groupName}
          </span>
        </div>
        <span
          className={clsx(
            "text-xs font-semibold",
            connected ? "text-emerald-600" : "text-amber-600",
          )}
        >
          {connected ? "Conectado" : "Não configurado"}
        </span>
      </div>

      {/* Message preview */}
      {connected && (
        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-3">
            Pré-visualização da mensagem
          </p>
          <div className="bg-slate-700 rounded-xl p-3">
            <pre className="text-sm text-white whitespace-pre-wrap font-sans leading-relaxed">
              {message}
            </pre>
          </div>
        </div>
      )}

      {/* Action */}
      {connected && !sent && (
        <Button
          fullWidth
          variant="primary"
          loading={sending}
          onClick={handleSend}
        >
          <Send size={16} />
          {sending ? "Enviando..." : "Enviar mensagem de teste"}
        </Button>
      )}

      {sent && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Mensagem enviada!
            </p>
            <p className="text-xs text-emerald-600">
              O grupo Telegram recebeu a notificação.
            </p>
          </div>
        </div>
      )}

      {!connected && (
        <div className="text-sm text-slate-500 text-center py-2">
          Telegram não configurado para este grupo.
          <br />
          <button className="text-primary-600 hover:underline mt-1">
            Configurar integração →
          </button>
        </div>
      )}
    </div>
  );
}
