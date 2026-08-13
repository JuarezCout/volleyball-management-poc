import type { Poll } from "@/types";

export const mockPolls: Poll[] = [
  {
    id: "poll1",
    groupId: "g2",
    title: "Terça-feira — Que horário preferes na próxima semana?",
    description: "Escolhe o horário que melhor te encaixa para o jogo de terça.",
    options: [
      { id: "o1-1", date: "2026-08-19", time: "18:00", votes: ["u3", "u4", "u6"] },
      { id: "o1-2", date: "2026-08-19", time: "19:00", votes: ["u1", "u5", "u9", "u11", "u13"] },
      { id: "o1-3", date: "2026-08-19", time: "20:00", votes: ["u15", "u17"] },
      { id: "o1-4", date: "2026-08-19", time: "21:00", votes: ["u7"] },
    ],
    status: "open",
    createdBy: "u0",
    createdAt: "2026-08-13T09:00:00",
  },
  {
    id: "poll2",
    groupId: "g5",
    title: "Feminino Inicial — Horário de Setembro",
    options: [
      { id: "o2-1", date: "2026-09-02", time: "18:30", votes: ["u3", "u5", "u6", "u8"] },
      { id: "o2-2", date: "2026-09-02", time: "19:30", votes: ["u10", "u14"] },
      { id: "o2-3", date: "2026-09-03", time: "19:00", votes: ["u16", "u20", "u22"] },
    ],
    status: "open",
    createdBy: "u0",
    createdAt: "2026-08-13T10:00:00",
  },
  {
    id: "poll3",
    groupId: "g3",
    title: "Quarta — Horário de agosto",
    options: [
      { id: "o3-1", date: "2026-08-20", time: "19:00", votes: ["u12", "u18", "u28", "u6", "u8", "u24", "u14"] },
      { id: "o3-2", date: "2026-08-20", time: "20:00", votes: ["u20", "u30"] },
    ],
    status: "closed",
    createdBy: "u0",
    createdAt: "2026-08-10T08:00:00",
    closedAt: "2026-08-12T12:00:00",
    winningOptionId: "o3-1",
    eventId: "e4",
  },
];
