import { useState } from "react";
import {
  CheckCircle,
  CreditCard,
  ArrowLeft,
  Building2,
  CircleDot,
  Shield,
} from "lucide-react";
import type { Event } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { registrationService } from "@/services/registrationService";
import { paymentService } from "@/services/paymentService";
import { eventService } from "@/services/eventService";
import { clsx } from "clsx";

type Step = "details" | "payment" | "success";

interface EventRegistrationModalProps {
  event: Event;
  userId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EventRegistrationModal({
  event,
  userId,
  open,
  onClose,
  onSuccess,
}: EventRegistrationModalProps) {
  const [step, setStep] = useState<Step>("details");
  const [method, setMethod] = useState<"stripe" | "transfer">("stripe");
  const [loading, setLoading] = useState(false);

  const confirmed = eventService.getConfirmedCount(event);
  const totalSlots = event.playersPerTeam * event.teamCount;
  const remaining = totalSlots - confirmed;
  const isWaitlist = remaining <= 0;

  const handlePay = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));

    const reg = registrationService.register(event.id, userId);
    if (reg.success) {
      const payment = paymentService.createCheckout(
        userId,
        event.id,
        event.price,
        method,
      );
      paymentService.confirmPayment(payment.id);
      registrationService.confirmPayment(event.id, userId);
    }
    setLoading(false);
    setStep("success");
  };

  const handleClose = () => {
    setStep("details");
    setMethod("stripe");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} size="sm">
      {step === "details" && (
        <div className="space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CircleDot size={28} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{event.name}</h2>
            <p className="text-slate-500 text-sm mt-1">
              {event.date} • {event.time}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
            <InfoRow label="📍 Local" value={event.location} />
            <InfoRow label="💶 Preço" value={`€${event.price}`} bold />
            <InfoRow
              label="👥 Vagas"
              value={
                isWaitlist
                  ? "Esgotado — entrar na waitlist"
                  : `${remaining} vagas disponíveis`
              }
              valueClass={isWaitlist ? "text-red-500" : "text-emerald-600"}
            />
            <InfoRow label="⏱ Duração" value={`${event.duration} min`} />
          </div>

          {isWaitlist && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
              O evento está esgotado. Ao participar entrarás na lista de espera
              e serás notificado quando surgir uma vaga.
            </div>
          )}

          <Button fullWidth size="lg" onClick={() => setStep("payment")}>
            {isWaitlist ? "Entrar na Waitlist" : "Participar e Pagar"}
          </Button>
        </div>
      )}

      {step === "payment" && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep("details")}
              className="text-slate-400 hover:text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800">Pagamento</h2>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center">
            <span className="text-slate-600">{event.name}</span>
            <span className="text-xl font-bold text-slate-800">
              €{event.price}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              Método de pagamento
            </p>
            <PaymentMethod
              selected={method === "stripe"}
              onSelect={() => setMethod("stripe")}
              icon={<CreditCard size={18} className="text-primary-600" />}
              label="Cartão de crédito / débito"
              sub="Stripe — Pagamento imediato"
            />
            <PaymentMethod
              selected={method === "transfer"}
              onSelect={() => setMethod("transfer")}
              icon={<Building2 size={18} className="text-slate-600" />}
              label="Transferência bancária"
              sub="IBAN PT50 — Confirmação manual"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield size={14} />
            Pagamento seguro e encriptado
          </div>

          <Button fullWidth size="lg" loading={loading} onClick={handlePay}>
            Confirmar pagamento • €{event.price}
          </Button>
        </div>
      )}

      {step === "success" && (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Inscrição confirmada!
            </h2>
            <p className="text-slate-500 text-sm mt-1">Bem-vindo ao jogo 🏐</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-left">
            <InfoRow label="Evento" value={event.name} />
            <InfoRow label="Data" value={`${event.date} às ${event.time}`} />
            <InfoRow
              label="Status"
              value="CONFIRMADO"
              valueClass="text-emerald-600 font-semibold"
            />
            <InfoRow
              label="Pagamento"
              value="PAGO"
              valueClass="text-emerald-600 font-semibold"
            />
            <InfoRow label="Valor" value={`€${event.price}`} bold />
          </div>

          <Button
            fullWidth
            variant="primary"
            onClick={() => {
              handleClose();
              onSuccess?.();
            }}
          >
            Ver meus jogos
          </Button>
        </div>
      )}
    </Modal>
  );
}

function InfoRow({
  label,
  value,
  bold,
  valueClass,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span
        className={clsx(
          "font-medium text-slate-700",
          bold && "font-bold text-lg",
          valueClass,
        )}
      >
        {value}
      </span>
    </div>
  );
}

function PaymentMethod({
  selected,
  onSelect,
  icon,
  label,
  sub,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left",
        selected
          ? "border-primary-500 bg-primary-50"
          : "border-slate-200 bg-white hover:border-slate-300",
      )}
    >
      <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
      <div
        className={clsx(
          "ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0",
          selected ? "border-primary-500 bg-primary-500" : "border-slate-300",
        )}
      >
        {selected && (
          <div className="w-full h-full rounded-full bg-white scale-50" />
        )}
      </div>
    </button>
  );
}
