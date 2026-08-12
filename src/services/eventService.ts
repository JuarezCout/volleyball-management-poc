import type { Event, Registration } from "@/types";
import { mockEvents } from "@/mock";

// Shallow clone store — simulates mutable backend state in memory
let eventsStore: Event[] = mockEvents.map((e) => ({
  ...e,
  registrations: [...e.registrations],
}));

export const eventService = {
  getAll(): Event[] {
    return eventsStore;
  },

  getById(id: string): Event | undefined {
    return eventsStore.find((e) => e.id === id);
  },

  getByGroup(groupId: string): Event[] {
    return eventsStore.filter((e) => e.groupId === groupId);
  },

  getByDate(date: string): Event[] {
    return eventsStore.filter((e) => e.date === date);
  },

  getTodayEvents(): Event[] {
    return eventsStore.filter((e) => e.date === "2026-08-12");
  },

  getUpcoming(): Event[] {
    return eventsStore
      .filter((e) => e.date >= "2026-08-12" && e.status !== "cancelled")
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  },

  getRegisteredEvents(userId: string): Event[] {
    return eventsStore.filter((e) =>
      e.registrations.some(
        (r) => r.userId === userId && r.status !== "cancelled",
      ),
    );
  },

  getConfirmedCount(event: Event): number {
    return event.registrations.filter((r) => r.status === "confirmed").length;
  },

  getWaitlistCount(event: Event): number {
    return event.registrations.filter((r) => r.status === "waitlist").length;
  },

  isUserRegistered(event: Event, userId: string): boolean {
    return event.registrations.some(
      (r) => r.userId === userId && r.status !== "cancelled",
    );
  },

  getUserRegistration(event: Event, userId: string): Registration | undefined {
    return event.registrations.find((r) => r.userId === userId);
  },

  create(
    data: Omit<Event, "id" | "createdAt" | "registrations" | "teamIds">,
  ): Event {
    const newEvent: Event = {
      ...data,
      id: `e${Date.now()}`,
      createdAt: new Date().toISOString(),
      registrations: [],
      teamIds: [],
    };
    eventsStore = [...eventsStore, newEvent];
    return newEvent;
  },

  updateStatus(id: string, status: Event["status"]): Event | undefined {
    eventsStore = eventsStore.map((e) => (e.id === id ? { ...e, status } : e));
    return eventsStore.find((e) => e.id === id);
  },
};
