import { clsx } from "clsx";

const COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-amber-500",
];

function getColor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % COLORS.length;
  return COLORS[hash];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0",
        sizes[size],
        getColor(name),
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}

interface AvatarGroupProps {
  names: string[];
  max?: number;
  size?: AvatarProps["size"];
}

export function AvatarGroup({ names, max = 4, size = "sm" }: AvatarGroupProps) {
  const shown = names.slice(0, max);
  const extra = names.length - max;

  return (
    <div className="flex -space-x-2">
      {shown.map((name) => (
        <Avatar
          key={name}
          name={name}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {extra > 0 && (
        <div
          className={clsx(
            "rounded-full flex items-center justify-center font-semibold text-slate-600 bg-slate-200 ring-2 ring-white text-xs",
            sizes[size],
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
