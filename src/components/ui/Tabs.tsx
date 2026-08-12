import { useState, type ReactNode } from "react";
import { clsx } from "clsx";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  children: (activeTab: string) => ReactNode;
  variant?: "underline" | "pills";
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  children,
  variant = "underline",
}: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  const select = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div>
      <div
        className={clsx("flex gap-1", {
          "border-b border-slate-200": variant === "underline",
          "bg-slate-100 p-1 rounded-xl": variant === "pills",
        })}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => select(tab.id)}
            className={clsx(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              {
                // Underline variant
                "px-4 py-2.5 border-b-2 -mb-px": variant === "underline",
                "border-primary-600 text-primary-700":
                  variant === "underline" && active === tab.id,
                "border-transparent text-slate-500 hover:text-slate-700":
                  variant === "underline" && active !== tab.id,
                // Pills variant
                "px-4 py-2 rounded-lg": variant === "pills",
                "bg-white text-slate-800 shadow-sm":
                  variant === "pills" && active === tab.id,
                "text-slate-500 hover:text-slate-700":
                  variant === "pills" && active !== tab.id,
              },
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge != null && (
              <span className="bg-primary-100 text-primary-700 text-xs rounded-full px-1.5 py-0.5 leading-none">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">{children(active)}</div>
    </div>
  );
}

// Stat card
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  color?: string;
  trend?: { value: string; positive?: boolean };
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  color = "text-primary-600",
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-start gap-4">
      {icon && (
        <div className={clsx("p-2.5 rounded-xl bg-slate-50", color)}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p
          className={clsx(
            "text-2xl font-bold text-slate-800 mt-0.5",
            !icon && "text-3xl",
          )}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        {trend && (
          <p
            className={clsx(
              "text-xs font-medium mt-1",
              trend.positive ? "text-emerald-600" : "text-red-500",
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
