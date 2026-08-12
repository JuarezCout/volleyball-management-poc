import { useState } from "react";
import {
  MapPin,
  Clock,
  Users,
  Euro,
  Calendar,
  ChevronRight,
  CircleDot,
} from "lucide-react";
import { clsx } from "clsx";
import type { Event } from "@/types";
import { Badge, EventStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { groupService } from "@/services/groupService";
import { eventService } from "@/services/eventService";

interface EventCardProps {
  event: Event;
  onView?: (event: Event) => void;
  onRegister?: (event: Event) => void;
  currentUserId?: string;
  compact?: boolean;
}

export function EventCard({
  event,
  onView,
  onRegister,
  currentUserId,
  compact,
}: EventCardProps) {
  const group = groupService.getById(event.groupId);
  const confirmed = eventService.getConfirmedCount(event);
  const totalMain = event.playersPerTeam * event.teamCount;
  const fillPct = Math.min((confirmed / totalMain) * 100, 100);
  const isRegistered = currentUserId
    ? eventService.isUserRegistered(event, currentUserId)
    : false;
  const userReg = currentUserId
    ? eventService.getUserRegistration(event, currentUserId)
    : undefined;
  const isFull = confirmed >= totalMain;

  const dayLabel = (() => {
    if (event.date === "2026-08-12") return "Hoje";
    if (event.date === "2026-08-13") return "Amanhã";
    const [, m, d] = event.date.split("-");
    return `${d}/${m}`;
  })();

  if (compact) {
    return (
      <div
        className="flex items-center gap-4 py-3 px-4 hover:bg-slate-50 transition-colors rounded-xl cursor-pointer"
        onClick={() => onView?.(event)}
      >
        <div className="text-center w-12 flex-shrink-0">
          <p className="text-xs text-slate-400 font-medium">{dayLabel}</p>
          <p className="text-base font-bold text-slate-800">{event.time}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {event.name}
          </p>
          <p className="text-xs text-slate-500 truncate">{event.location}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-slate-700">
            {confirmed}/{totalMain}
          </p>
          <EventStatusBadge status={event.status} />
        </div>
        <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border shadow-card overflow-hidden transition-all hover:shadow-card-hover",
        isFull ? "border-red-200" : "border-slate-100",
      )}
    >
      {/* Top bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: group?.coverColor ?? "#3b82f6", opacity: 0.7 }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-semibold text-slate-800">{event.name}</p>
            {group && (
              <p className="text-xs text-slate-400 mt-0.5">{group.name}</p>
            )}
          </div>
          <EventStatusBadge status={event.status} />
        </div>

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={14} />
            <span>
              {dayLabel} às {event.time}
            </span>
            <span className="text-slate-300">·</span>
            <Clock size={14} />
            <span>{event.duration} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={14} />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Euro size={14} />
            <span>€{event.price} por jogador</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>
              {confirmed} / {totalMain} jogadores
            </span>
            {isFull && (
              <span className="text-red-500 font-medium">Esgotado</span>
            )}
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={clsx(
                "h-full rounded-full transition-all",
                isFull ? "bg-red-400" : "bg-primary-500",
              )}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {/* Action */}
        {onRegister && !isRegistered && (
          <Button
            fullWidth
            variant={isFull ? "secondary" : "primary"}
            onClick={() => onRegister(event)}
          >
            <CircleDot size={16} />
            {isFull ? "Entrar na Waitlist" : "Participar"}
          </Button>
        )}

        {isRegistered && userReg && (
          <div className="flex items-center justify-between">
            <Badge
              variant={userReg.status === "confirmed" ? "success" : "warning"}
              dot
              size="md"
            >
              {userReg.status === "confirmed"
                ? "Confirmado"
                : userReg.status === "waitlist"
                  ? "Waitlist"
                  : "Backup"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => onView?.(event)}>
              Ver detalhes
            </Button>
          </div>
        )}

        {!onRegister && !isRegistered && (
          <Button
            variant="outline"
            fullWidth
            size="sm"
            onClick={() => onView?.(event)}
          >
            Ver detalhes <ChevronRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
