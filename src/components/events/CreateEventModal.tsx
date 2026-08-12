import { useState } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Euro,
  Users,
  ChevronRight,
  Send,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { TelegramPreview } from "@/components/messaging/TelegramPreview";
import { eventService } from "@/services/eventService";
import { groupService } from "@/services/groupService";
import type { Event } from "@/types";

interface CreateEventModalProps {
  open: boolean;
  groupId?: string;
  onClose: () => void;
  onCreated?: (event: Event) => void;
}

type Step = "form" | "preview" | "telegram";

export function CreateEventModal({
  open,
  groupId,
  onClose,
  onCreated,
}: CreateEventModalProps) {
  const groups = groupService.getAll();
  const [step, setStep] = useState<Step>("form");
  const [created, setCreated] = useState<Event | null>(null);

  const [form, setForm] = useState({
    groupId: groupId ?? "g2",
    name: "",
    date: "2026-08-19",
    time: "20:00",
    duration: "120",
    location: "Clube Central — Court 1",
    price: "8",
    playersPerTeam: "6",
    backupsPerTeam: "2",
    teamCount: "2",
  });

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const totalSlots =
    Number(form.playersPerTeam) * Number(form.teamCount) +
    Number(form.backupsPerTeam) * Number(form.teamCount);
  const selectedGroup = groupService.getById(form.groupId);
  const autoName = selectedGroup
    ? `${selectedGroup.name} — ${form.time}`
    : form.name;

  const handleCreate = () => {
    const event = eventService.create({
      name: form.name || autoName,
      groupId: form.groupId,
      date: form.date,
      time: form.time,
      duration: Number(form.duration),
      location: form.location,
      price: Number(form.price),
      playersPerTeam: Number(form.playersPerTeam),
      backupsPerTeam: Number(form.backupsPerTeam),
      teamCount: Number(form.teamCount),
      totalSlots,
      status: "open",
      captainIds: [],
    });
    setCreated(event);
    setStep("telegram");
    onCreated?.(event);
  };

  const handleClose = () => {
    setStep("form");
    setCreated(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        step === "form"
          ? "Criar Evento"
          : step === "preview"
            ? "Pré-visualização"
            : "Notificar Grupo"
      }
      size="lg"
    >
      {step === "form" && (
        <div className="space-y-4">
          <Select
            label="Grupo"
            value={form.groupId}
            onChange={set("groupId")}
            options={groups.map((g) => ({ value: g.id, label: g.name }))}
          />
          <Input
            label="Nome do evento (opcional)"
            value={form.name}
            onChange={set("name")}
            placeholder={autoName}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data"
              type="date"
              value={form.date}
              onChange={set("date")}
            />
            <Input
              label="Horário"
              type="time"
              value={form.time}
              onChange={set("time")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duração (min)"
              type="number"
              value={form.duration}
              onChange={set("duration")}
            />
            <Input
              label="Preço (€)"
              type="number"
              value={form.price}
              onChange={set("price")}
              leftIcon={<Euro size={14} />}
            />
          </div>

          <Input
            label="Local"
            value={form.location}
            onChange={set("location")}
            leftIcon={<MapPin size={14} />}
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Jogadores/equipa"
              type="number"
              value={form.playersPerTeam}
              onChange={set("playersPerTeam")}
            />
            <Input
              label="Backups/equipa"
              type="number"
              value={form.backupsPerTeam}
              onChange={set("backupsPerTeam")}
            />
            <Input
              label="Nº equipas"
              type="number"
              value={form.teamCount}
              onChange={set("teamCount")}
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Total de vagas</span>
            <span className="font-bold text-slate-800">{totalSlots}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={handleClose}>
              Cancelar
            </Button>
            <Button fullWidth onClick={handleCreate}>
              Publicar evento <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {step === "telegram" && created && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-emerald-700 font-semibold">
              ✓ Evento publicado com sucesso!
            </p>
            <p className="text-emerald-600 text-sm mt-1">{created.name}</p>
          </div>

          <p className="text-sm text-slate-600">
            Notifique o grupo via Telegram:
          </p>

          <TelegramPreview
            groupId={created.groupId}
            groupName={selectedGroup?.name ?? ""}
            eventName={created.name}
            eventDate={created.date}
            eventTime={created.time}
            eventLocation={created.location}
            eventPrice={created.price}
            eventSlots={totalSlots}
            onSent={() => setTimeout(handleClose, 2000)}
          />

          <Button variant="ghost" fullWidth onClick={handleClose}>
            Fechar
          </Button>
        </div>
      )}
    </Modal>
  );
}
