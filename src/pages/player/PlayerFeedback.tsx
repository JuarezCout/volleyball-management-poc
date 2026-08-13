import { useState } from "react";
import { MessageCircle, Send, CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockFeedbacks } from "@/mock";
import { eventService } from "@/services/eventService";
import { useAuth } from "@/context/AuthContext";
import type { Feedback, FeedbackCategory } from "@/types";
import { clsx } from "clsx";

const CATEGORIES: { id: FeedbackCategory; label: string; emoji: string }[] = [
  { id: "game_organization", label: "Organização do jogo",    emoji: "📋" },
  { id: "sportsmanship",    label: "Desportivismo",           emoji: "🤝" },
  { id: "facilities",       label: "Instalações",             emoji: "🏟️" },
  { id: "scheduling",       label: "Horários",                emoji: "🕐" },
  { id: "suggestion",       label: "Sugestão",                emoji: "💡" },
  { id: "other",            label: "Outro",                   emoji: "💬" },
];

let feedbackStore = [...mockFeedbacks];

export function PlayerFeedback() {
  const { user } = useAuth();
  const userId = user?.id ?? "u2";
  const [feedbacks, setFeedbacks] = useState(feedbackStore);
  const [category, setCategory] = useState<FeedbackCategory>("game_organization");
  const [message, setMessage] = useState("");
  const [eventId, setEventId] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const myEvents = eventService.getRegisteredEvents(userId).slice(0, 5);
  const myFeedbacks = feedbacks.filter((f) => f.userId === userId);

  function handleSubmit() {
    if (!message.trim()) return;
    const fb: Feedback = {
      id: `fb${Date.now()}`,
      userId,
      eventId: eventId || undefined,
      category,
      message,
      isPrivate,
      createdAt: new Date().toISOString(),
    };
    const updated = [fb, ...feedbackStore];
    feedbackStore = updated;
    setFeedbacks(updated);
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <AppLayout title="Feedback">
      <div className="p-4 sm:p-6 space-y-5 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Feedback</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Partilha a tua experiência com o clube
          </p>
        </div>

        {/* Submit form */}
        <Card>
          <CardHeader>
            <span className="flex items-center gap-2">
              <MessageCircle size={15} /> Enviar feedback
            </span>
          </CardHeader>

          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <p className="font-semibold text-slate-800">Obrigado pelo teu feedback!</p>
              <p className="text-sm text-slate-500">A equipa de staff irá rever a tua mensagem.</p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">Categoria</p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={clsx(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors text-left",
                        category === cat.id
                          ? "border-primary-400 bg-primary-50 text-primary-700 font-medium"
                          : "border-slate-200 text-slate-600 hover:border-slate-300",
                      )}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event (optional) */}
              {myEvents.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Evento (opcional)</p>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="">Geral / sem evento específico</option>
                    {myEvents.map((e) => (
                      <option key={e.id} value={e.id}>{e.name} — {e.date}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Mensagem</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Partilha a tua experiência, sugestão ou comentário..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              {/* Privacy */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-slate-600">
                  Privado — visível apenas para o staff autorizado
                </span>
              </label>

              <Button fullWidth onClick={handleSubmit} disabled={!message.trim()}>
                <Send size={16} /> Enviar feedback
              </Button>
            </div>
          )}
        </Card>

        {/* My feedbacks */}
        {myFeedbacks.length > 0 && (
          <Card>
            <CardHeader>Os meus feedbacks anteriores</CardHeader>
            <div className="space-y-3 mt-1">
              {myFeedbacks.map((fb) => {
                const cat = CATEGORIES.find((c) => c.id === fb.category);
                return (
                  <div key={fb.id} className="border border-slate-100 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{cat?.emoji}</span>
                      <span className="text-xs font-medium text-slate-600">{cat?.label}</span>
                      {fb.isPrivate && (
                        <span className="text-xs text-slate-400 ml-auto">🔒 Privado</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700">{fb.message}</p>
                    <p className="text-xs text-slate-400 mt-1.5">
                      {new Date(fb.createdAt).toLocaleDateString("pt-PT")}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
