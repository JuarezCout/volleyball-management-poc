import type { RatingEntry, PlayerStats } from "@/types";

export const mockRatings: RatingEntry[] = [
  // João Silva (u2) rating history
  {
    id: "r1",
    eventId: "e_past1",
    playerId: "u2",
    captainId: "u1",
    score: 7,
    createdAt: "2026-07-01",
  },
  {
    id: "r2",
    eventId: "e_past2",
    playerId: "u2",
    captainId: "u1",
    score: 8,
    createdAt: "2026-07-08",
  },
  {
    id: "r3",
    eventId: "e_past3",
    playerId: "u2",
    captainId: "u1",
    score: 8,
    createdAt: "2026-07-15",
  },
  {
    id: "r4",
    eventId: "e_past4",
    playerId: "u2",
    captainId: "u1",
    score: 7,
    createdAt: "2026-07-22",
  },
  {
    id: "r5",
    eventId: "e_past5",
    playerId: "u2",
    captainId: "u1",
    score: 9,
    createdAt: "2026-07-29",
  },
  {
    id: "r6",
    eventId: "e_past6",
    playerId: "u2",
    captainId: "u1",
    score: 8,
    createdAt: "2026-08-05",
  },
  {
    id: "r7",
    eventId: "e_past7",
    playerId: "u2",
    captainId: "u1",
    score: 9,
    createdAt: "2026-08-10",
  },

  // Carlos Oliveira (u1) — captain
  {
    id: "r8",
    eventId: "e_past1",
    playerId: "u1",
    captainId: "u17",
    score: 8,
    createdAt: "2026-07-01",
  },
  {
    id: "r9",
    eventId: "e_past2",
    playerId: "u1",
    captainId: "u17",
    score: 9,
    createdAt: "2026-07-08",
  },
  {
    id: "r10",
    eventId: "e_past3",
    playerId: "u1",
    captainId: "u17",
    score: 8,
    createdAt: "2026-07-15",
  },
  {
    id: "r11",
    eventId: "e_past4",
    playerId: "u1",
    captainId: "u17",
    score: 9,
    createdAt: "2026-07-22",
  },
  {
    id: "r12",
    eventId: "e_past5",
    playerId: "u1",
    captainId: "u17",
    score: 9,
    createdAt: "2026-07-29",
  },
  {
    id: "r13",
    eventId: "e_past6",
    playerId: "u1",
    captainId: "u17",
    score: 8,
    createdAt: "2026-08-05",
  },
  {
    id: "r14",
    eventId: "e_past7",
    playerId: "u1",
    captainId: "u17",
    score: 8,
    createdAt: "2026-08-10",
  },

  // Maria Costa (u3)
  {
    id: "r15",
    eventId: "e_past2",
    playerId: "u3",
    captainId: "u1",
    score: 8,
    createdAt: "2026-07-08",
  },
  {
    id: "r16",
    eventId: "e_past3",
    playerId: "u3",
    captainId: "u1",
    score: 9,
    createdAt: "2026-07-15",
  },
  {
    id: "r17",
    eventId: "e_past5",
    playerId: "u3",
    captainId: "u1",
    score: 9,
    createdAt: "2026-07-29",
  },
  {
    id: "r18",
    eventId: "e_past6",
    playerId: "u3",
    captainId: "u1",
    score: 10,
    createdAt: "2026-08-05",
  },
  {
    id: "r19",
    eventId: "e_past7",
    playerId: "u3",
    captainId: "u1",
    score: 9,
    createdAt: "2026-08-10",
  },

  // Pedro Santos (u4)
  {
    id: "r20",
    eventId: "e_past3",
    playerId: "u4",
    captainId: "u1",
    score: 7,
    createdAt: "2026-07-15",
  },
  {
    id: "r21",
    eventId: "e_past5",
    playerId: "u4",
    captainId: "u1",
    score: 8,
    createdAt: "2026-07-29",
  },
  {
    id: "r22",
    eventId: "e_past7",
    playerId: "u4",
    captainId: "u1",
    score: 7,
    createdAt: "2026-08-10",
  },

  // Ana Ferreira (u5)
  {
    id: "r23",
    eventId: "e_past4",
    playerId: "u5",
    captainId: "u1",
    score: 9,
    createdAt: "2026-07-22",
  },
  {
    id: "r24",
    eventId: "e_past6",
    playerId: "u5",
    captainId: "u1",
    score: 9,
    createdAt: "2026-08-05",
  },
  {
    id: "r25",
    eventId: "e_past7",
    playerId: "u5",
    captainId: "u1",
    score: 8,
    createdAt: "2026-08-10",
  },
];

// Pre-computed stats for the main players
export const mockPlayerStats: Record<string, PlayerStats> = {
  u2: {
    playerId: "u2",
    totalParticipations: 34,
    totalRatings: 29,
    currentRating: 8.2,
    evolution: 0.6,
    ratingHistory: [
      { date: "01/07", score: 7, eventId: "e_past1" },
      { date: "08/07", score: 8, eventId: "e_past2" },
      { date: "15/07", score: 8, eventId: "e_past3" },
      { date: "22/07", score: 7, eventId: "e_past4" },
      { date: "29/07", score: 9, eventId: "e_past5" },
      { date: "05/08", score: 8, eventId: "e_past6" },
      { date: "10/08", score: 9, eventId: "e_past7" },
    ],
  },
  u1: {
    playerId: "u1",
    totalParticipations: 42,
    totalRatings: 38,
    currentRating: 8.4,
    evolution: 0.2,
    ratingHistory: [
      { date: "01/07", score: 8, eventId: "e_past1" },
      { date: "08/07", score: 9, eventId: "e_past2" },
      { date: "15/07", score: 8, eventId: "e_past3" },
      { date: "22/07", score: 9, eventId: "e_past4" },
      { date: "29/07", score: 9, eventId: "e_past5" },
      { date: "05/08", score: 8, eventId: "e_past6" },
      { date: "10/08", score: 8, eventId: "e_past7" },
    ],
  },
};

// Club-wide weekly stats for charts
export const weeklyStats = [
  { week: "Jul 1", participations: 68, revenue: 544, events: 8 },
  { week: "Jul 8", participations: 74, revenue: 592, events: 9 },
  { week: "Jul 15", participations: 71, revenue: 568, events: 9 },
  { week: "Jul 22", participations: 82, revenue: 656, events: 10 },
  { week: "Jul 29", participations: 79, revenue: 632, events: 10 },
  { week: "Ago 5", participations: 88, revenue: 704, events: 11 },
  { week: "Ago 12", participations: 94, revenue: 752, events: 12 },
];

export const groupStats = [
  { name: "Terça-feira", events: 28, members: 91 },
  { name: "Recreativo", events: 20, members: 124 },
  { name: "Masc. Inter.", events: 24, members: 77 },
  { name: "Fem. Inicial", events: 22, members: 84 },
  { name: "Segunda-feira", events: 18, members: 72 },
  { name: "Quarta-feira", events: 16, members: 68 },
];
