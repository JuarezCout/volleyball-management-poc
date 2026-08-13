import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { mockFeedbacks } from "@/mock";
import { mockUsers } from "@/mock";
import { eventService } from "@/services/eventService";
import { MessageCircle, Filter } from "lucide-react";
import { clsx } from "clsx";
import type { FeedbackCategory } from "@/types";

const CATEGORY_META: Record<FeedbackCategory, { label: string; emoji: string; color: string }> = {
  game_organization: { label: "Organização",   emoji: "📋", color: "blue" },
  sportsmanship:     { label: "Desportivismo", emoji: "🤝", color: "emerald" },
  facilities:        { label: "Instalações",   emoji: "🏟️", color: "amber" },
  scheduling:        { label: "Horários",      emoji: "🕐", color: "violet" },
  suggestion:        { label: "Sugestão",      emoji: "💡", color: "yellow" },
  other:             { label: "Outro",         emoji: "💬", color: "slate" },
};

export function AdminFeedbacks() {
  const [filter, setFilter] = useState<FeedbackCategory | "all">("all");

  const filtered = filter === "all"
    ? mockFeedbacks
    : mockFeedbacks.filter((f) => f.category === filter);

  return (
    <AppLayout title="Feedbacks">
      <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Feedbacks</h1>
          <p className="text-slate-500 text-sm">{mockFeedbacks.length} feedbacks recebidos</p>
        </div>

        {/* Category summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.entries(CATEGORY_META) as [FeedbackCategory, typeof CATEGORY_META[FeedbackCategory]][]).map(([id, meta]) => {
            const count = mockFeedbacks.filter((f) => f.category === id).length;
            return (
              <button
                key={id}
                onClick={() => setFilter(filter === id ? "all" : id)}
                className={clsx(
                  "p-3 rounded-xl border text-left transition-all",
                  filter === id
                    ? "border-primary-400 bg-primary-50"
                    : "border-slate-200 hover:border-slate-300 bg-white",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{meta.label}</p>
                    <p className="text-xs text-slate-400">{count} feedbacks</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback list */}
        <Card>
          <CardHeader>
            <span className="flex items-center gap-2">
              <MessageCircle size={15} />
              {filter === "all" ? "Todos os feedbacks" : CATEGORY_META[filter].label}
              <Badge variant="default" size="sm">{filtered.length}</Badge>
            </span>
          </CardHeader>
          <div className="space-y-3 mt-1">
            {filtered.map((fb) => {
              const user = mockUsers.find((u) => u.id === fb.userId);
              const cat = CATEGORY_META[fb.category];
              const event = fb.eventId ? eventService.getById(fb.eventId) : null;

              return (
                <div key={fb.id} className={clsx(
                  "border rounded-xl p-4",
                  fb.isPrivate ? "border-amber-100 bg-amber-50/50" : "border-slate-100",
                )}>
                  <div className="flex items-start gap-3">
                    {user && <Avatar name={user.name} size="sm" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-700">
                          {user?.preferredName ?? user?.name}
                        </p>
                        <span className={clsx(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          `bg-${cat.color}-100 text-${cat.color}-700`,
                        )}>
                          {cat.emoji} {cat.label}
                        </span>
                        {fb.isPrivate && (
                          <span className="text-xs text-amber-600 font-medium">🔒 Privado</span>
                        )}
                      </div>
                      {event && (
                        <p className="text-xs text-slate-400 mt-0.5">{event.name} · {event.date}</p>
                      )}
                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{fb.message}</p>
                      <p className="text-xs text-slate-400 mt-1.5">
                        {new Date(fb.createdAt).toLocaleDateString("pt-PT", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
