// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole = "admin" | "captain" | "player";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  groupIds: string[];
  joinedAt: string;
  position?:
    | "libero"
    | "setter"
    | "outside"
    | "middle"
    | "opposite"
    | "universal";
  phone?: string;
  rating?: number;
}

// ─── Group ───────────────────────────────────────────────────────────────────
export type GroupCategory = "weekday" | "gender" | "level" | "recreational";

export interface Group {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  memberCount: number;
  adminId: string;
  telegramGroupId?: string;
  whatsappGroupId?: string;
  status: "active" | "inactive";
  lastActivity: string;
  eventIds: string[];
  memberIds: string[];
  coverColor: string;
}

// ─── Event ───────────────────────────────────────────────────────────────────
export type EventStatus =
  | "draft"
  | "open"
  | "full"
  | "in_progress"
  | "finished"
  | "cancelled";

export interface Event {
  id: string;
  name: string;
  groupId: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  price: number;
  playersPerTeam: number;
  backupsPerTeam: number;
  teamCount: number;
  totalSlots: number;
  status: EventStatus;
  captainIds: string[];
  registrations: Registration[];
  teamIds: string[];
  createdAt: string;
}

// ─── Registration ─────────────────────────────────────────────────────────────
export type RegistrationStatus =
  | "confirmed"
  | "waitlist"
  | "cancelled"
  | "backup";
export type PaymentStatus = "paid" | "pending" | "refunded" | "free";

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  registeredAt: string;
  teamId?: string;
  position?: number;
}

// ─── Team ────────────────────────────────────────────────────────────────────
export interface Team {
  id: string;
  eventId: string;
  name: string;
  captainId?: string;
  playerIds: string[];
  backupIds: string[];
  maxPlayers: number;
  maxBackups: number;
  color: string;
}

// ─── Rating ──────────────────────────────────────────────────────────────────
export interface RatingEntry {
  id: string;
  eventId: string;
  playerId: string;
  captainId: string;
  score: number;
  createdAt: string;
}

export interface PlayerStats {
  playerId: string;
  totalParticipations: number;
  totalRatings: number;
  currentRating: number;
  evolution: number;
  ratingHistory: { date: string; score: number; eventId: string }[];
}

// ─── Payment ─────────────────────────────────────────────────────────────────
export interface Payment {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  status: PaymentStatus;
  method: "stripe" | "transfer" | "cash" | "free";
  createdAt: string;
  paidAt?: string;
}

// ─── Messaging ───────────────────────────────────────────────────────────────
export interface TelegramChannel {
  groupId: string;
  chatId: string;
  status: "connected" | "disconnected" | "pending";
  lastMessage?: string;
  lastMessageAt?: string;
}
