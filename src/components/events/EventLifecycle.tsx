import type { EventStatus } from "@/types";
import { clsx } from "clsx";
import { Check } from "lucide-react";

const STEPS = [
  { key: "draft",      label: "Rascunho",           statuses: ["draft"] },
  { key: "published",  label: "Publicado",           statuses: ["published", "open"] },
  { key: "reg_open",   label: "Inscrições Abertas",  statuses: ["open"] },
  { key: "full",       label: "Quadra Cheia",        statuses: ["full"] },
  { key: "in_progress",label: "Em Jogo",             statuses: ["in_progress"] },
  { key: "completed",  label: "Concluído",           statuses: ["finished"] },
  { key: "rated",      label: "Avaliado",            statuses: ["rated"] },
] as const;

function statusToStepIndex(status: EventStatus): number {
  if (status === "cancelled") return -1;
  const map: Record<EventStatus, number> = {
    draft:       0,
    published:   1,
    open:        2,
    full:        3,
    in_progress: 4,
    finished:    5,
    rated:       6,
    cancelled:   -1,
  };
  return map[status] ?? 0;
}

export function EventLifecycle({ status }: { status: EventStatus }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-500 text-xs font-medium">
        <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
        Evento cancelado
      </div>
    );
  }

  const current = statusToStepIndex(status);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-start gap-0 min-w-max">
        {STEPS.map((step, i) => {
          const isDone = i < current;
          const isActive = i === current;

          return (
            <div key={step.key} className="flex items-start">
              <div className="flex flex-col items-center gap-1.5">
                <div className={clsx(
                  "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors",
                  isDone
                    ? "bg-primary-600 border-primary-600"
                    : isActive
                      ? "border-primary-600 bg-white"
                      : "border-slate-200 bg-white",
                )}>
                  {isDone
                    ? <Check size={13} className="text-white" strokeWidth={3} />
                    : <span className={clsx(
                        "text-xs font-bold",
                        isActive ? "text-primary-600" : "text-slate-300",
                      )}>
                        {i + 1}
                      </span>
                  }
                </div>
                <span className={clsx(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-primary-600" : isDone ? "text-slate-600" : "text-slate-300",
                )}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx(
                  "h-0.5 w-8 mt-3.5 mx-0.5 rounded-full",
                  i < current ? "bg-primary-600" : "bg-slate-200",
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
