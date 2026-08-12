import type { Payment } from "@/types";
import { mockPayments } from "@/mock";

let paymentsStore: Payment[] = [...mockPayments];

export const paymentService = {
  getAll(): Payment[] {
    return paymentsStore;
  },

  getByEvent(eventId: string): Payment[] {
    return paymentsStore.filter((p) => p.eventId === eventId);
  },

  getByUser(userId: string): Payment[] {
    return paymentsStore.filter((p) => p.userId === userId);
  },

  createCheckout(
    userId: string,
    eventId: string,
    amount: number,
    method: Payment["method"],
  ): Payment {
    const payment: Payment = {
      id: `pay${Date.now()}`,
      userId,
      eventId,
      amount,
      status: "pending",
      method,
      createdAt: new Date().toISOString(),
    };
    paymentsStore.push(payment);
    return payment;
  },

  // Simulate Stripe/transfer confirmation
  confirmPayment(paymentId: string): Payment | undefined {
    const payment = paymentsStore.find((p) => p.id === paymentId);
    if (!payment) return undefined;
    payment.status = "paid";
    payment.paidAt = new Date().toISOString();
    return payment;
  },

  getPendingTotal(): number {
    return paymentsStore
      .filter((p) => p.status === "pending")
      .reduce((s, p) => s + p.amount, 0);
  },

  getRevenueThisWeek(): number {
    return paymentsStore
      .filter(
        (p) => p.status === "paid" && p.paidAt && p.paidAt >= "2026-08-07",
      )
      .reduce((s, p) => s + p.amount, 0);
  },
};
