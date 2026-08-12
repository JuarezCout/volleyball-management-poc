import { clsx } from "clsx";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "orange";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-slate-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

export function Badge({
  variant = "default",
  size = "sm",
  dot,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variants[variant],
        {
          "text-xs px-2 py-0.5": size === "sm",
          "text-sm px-3 py-1": size === "md",
        },
        className,
      )}
    >
      {dot && (
        <span
          className={clsx("w-1.5 h-1.5 rounded-full", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}

// Semantic status badges
export function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    paid: { label: "Pago", variant: "success" },
    pending: { label: "Pendente", variant: "warning" },
    refunded: { label: "Reembolsado", variant: "purple" },
    free: { label: "Isento", variant: "info" },
  };
  const { label, variant } = map[status] ?? {
    label: status,
    variant: "default",
  };
  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  );
}

export function RegistrationBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    confirmed: { label: "Confirmado", variant: "success" },
    waitlist: { label: "Waitlist", variant: "warning" },
    backup: { label: "Backup", variant: "purple" },
    cancelled: { label: "Cancelado", variant: "danger" },
  };
  const { label, variant } = map[status] ?? {
    label: status,
    variant: "default",
  };
  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  );
}

export function EventStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    draft: { label: "Rascunho", variant: "default" },
    open: { label: "Aberto", variant: "success" },
    full: { label: "Esgotado", variant: "danger" },
    in_progress: { label: "Em Jogo", variant: "info" },
    finished: { label: "Finalizado", variant: "purple" },
    cancelled: { label: "Cancelado", variant: "danger" },
  };
  const { label, variant } = map[status] ?? {
    label: status,
    variant: "default",
  };
  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  );
}
