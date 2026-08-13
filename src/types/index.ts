// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole = "admin" | "captain" | "player";
export type PlayerPosition = "libero" | "setter" | "outside" | "middle" | "opposite" | "universal";
export type Gender = "male" | "female" | "non_binary" | "prefer_not_to_say";

export interface User {
  id: string;
  name: string;
  preferredName?: string;
  email: string;
  avatar?: string;
  role: UserRole;
  groupIds: string[];
  joinedAt: string;
  gender?: Gender;
  birthday?: string;
  positions?: PlayerPosition[];
  phone?: string;
  /** Denormalized aggregate – actual history is in RatingEntry[] */
  rating?: number;
  waiverAccepted?: boolean;
  waiverAcceptedAt?: string;
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

// ─── Court ───────────────────────────────────────────────────────────────────
export interface Court {
  id: string;
  eventId: string;
  name: string;
  capacity: number; // total players (both teams)
  filledCount: number;
  teamAId?: string;
  teamBId?: string;
  status: "active" | "full" | "closed";
  openedAt?: string;
}

// ─── Event Timeline ───────────────────────────────────────────────────────────
export interface TimelineEntry {
  id: string;
  time: string;
  label: string;
  type: "system" | "player" | "admin" | "payment" | "court";
  actor?: string;
}

// ─── Event ───────────────────────────────────────────────────────────────────
export type EventStatus =
  | "draft"
  | "published"
  | "open"
  | "full"
  | "in_progress"
  | "finished"
  | "cancelled"
  | "rated";

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
  courts: Court[];
  timeline: TimelineEntry[];
  hasLastMinuteSpot?: boolean;
  gameFormat?: string;
  instructions?: string;
  createdAt: string;
}

// ─── Poll ─────────────────────────────────────────────────────────────────────
export interface PollOption {
  id: string;
  date: string;
  time: string;
  votes: string[]; // userId[]
}

export type PollStatus = "open" | "closed" | "event_created";

export interface Poll {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  options: PollOption[];
  status: PollStatus;
  createdBy: string;
  createdAt: string;
  closedAt?: string;
  winningOptionId?: string;
  eventId?: string;
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

// ─── Feedback ─────────────────────────────────────────────────────────────────
export type FeedbackCategory =
  | "game_organization"
  | "sportsmanship"
  | "facilities"
  | "scheduling"
  | "suggestion"
  | "other";

export interface Feedback {
  id: string;
  userId: string;
  eventId?: string;
  groupId?: string;
  category: FeedbackCategory;
  message: string;
  isPrivate: boolean;
  createdAt: string;
}
