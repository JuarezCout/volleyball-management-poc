import { type HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({
  padding = "md",
  hover,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-slate-100 shadow-card",
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-5": padding === "md",
          "p-6": padding === "lg",
          "hover:shadow-card-hover transition-shadow cursor-pointer": hover,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export function CardHeader({
  action,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={clsx("flex items-center justify-between mb-4", className)}
      {...props}
    >
      <div className="font-semibold text-slate-800 text-base">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}
