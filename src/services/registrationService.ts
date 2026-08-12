import type { Registration } from "@/types";
import { eventService } from "./eventService";

export const registrationService = {
  register(
    eventId: string,
    userId: string,
  ): { success: boolean; registration?: Registration; message: string } {
    const event = eventService.getById(eventId);
    if (!event) return { success: false, message: "Evento não encontrado" };
    if (eventService.isUserRegistered(event, userId)) {
      return { success: false, message: "Já estás inscrito neste evento" };
    }

    const confirmed = eventService.getConfirmedCount(event);
    const maxConfirmed = event.playersPerTeam * event.teamCount;
    const status: Registration["status"] =
      confirmed < maxConfirmed ? "confirmed" : "waitlist";

    const reg: Registration = {
      id: `reg-${eventId}-${userId}-${Date.now()}`,
      eventId,
      userId,
      status,
      paymentStatus: "pending",
      registeredAt: new Date().toISOString(),
      position: event.registrations.length + 1,
    };

    event.registrations.push(reg);
    return {
      success: true,
      registration: reg,
      message:
        status === "confirmed"
          ? "Inscrição confirmada!"
          : "Adicionado à waitlist",
    };
  },

  confirmPayment(eventId: string, userId: string): boolean {
    const event = eventService.getById(eventId);
    if (!event) return false;
    const reg = event.registrations.find((r) => r.userId === userId);
    if (!reg) return false;
    reg.paymentStatus = "paid";
    return true;
  },

  cancel(eventId: string, userId: string): boolean {
    const event = eventService.getById(eventId);
    if (!event) return false;
    const reg = event.registrations.find((r) => r.userId === userId);
    if (!reg) return false;
    reg.status = "cancelled";
    // Promote first waitlist
    const first = event.registrations.find((r) => r.status === "waitlist");
    if (first) first.status = "confirmed";
    return true;
  },
};
