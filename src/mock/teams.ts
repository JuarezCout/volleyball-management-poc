import type { Team } from "@/types";

export const mockTeams: Team[] = [
  // ── Event e1: Terça 20:00 ─────────────────────────────────────────────────
  {
    id: "t1",
    eventId: "e1",
    name: "Time A",
    captainId: "u1",
    playerIds: ["u1", "u2", "u3", "u4", "u9", "u11"],
    backupIds: ["u7", "u21"],
    maxPlayers: 6,
    maxBackups: 2,
    color: "#3b82f6",
  },
  {
    id: "t2",
    eventId: "e1",
    name: "Time B",
    captainId: "u13",
    playerIds: ["u13", "u15", "u17", "u19"],
    backupIds: ["u25", "u29"],
    maxPlayers: 6,
    maxBackups: 2,
    color: "#f97316",
  },

  // ── Event e2: Terça 22:00 ─────────────────────────────────────────────────
  {
    id: "t3",
    eventId: "e2",
    name: "Time A",
    captainId: "u17",
    playerIds: ["u17", "u23", "u27", "u13", "u15", "u29"],
    backupIds: [],
    maxPlayers: 6,
    maxBackups: 2,
    color: "#3b82f6",
  },
  {
    id: "t4",
    eventId: "e2",
    name: "Time B",
    captainId: "u19",
    playerIds: ["u19", "u21"],
    backupIds: [],
    maxPlayers: 6,
    maxBackups: 2,
    color: "#f97316",
  },

  // ── Event e3: Segunda 18:00 ───────────────────────────────────────────────
  {
    id: "t5",
    eventId: "e3",
    name: "Time A",
    captainId: "u10",
    playerIds: ["u10", "u16", "u26", "u3", "u8", "u20"],
    backupIds: ["u7"],
    maxPlayers: 6,
    maxBackups: 1,
    color: "#3b82f6",
  },
  {
    id: "t6",
    eventId: "e3",
    name: "Time B",
    captainId: "u22",
    playerIds: ["u22", "u6", "u14", "u24", "u5", "u30"],
    backupIds: ["u9"],
    maxPlayers: 6,
    maxBackups: 1,
    color: "#10b981",
  },
];
