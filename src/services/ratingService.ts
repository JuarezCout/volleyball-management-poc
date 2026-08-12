import type { RatingEntry, PlayerStats } from "@/types";
import { mockRatings, mockPlayerStats } from "@/mock";

let ratingsStore: RatingEntry[] = [...mockRatings];

export const ratingService = {
  getPlayerRatings(playerId: string): RatingEntry[] {
    return ratingsStore.filter((r) => r.playerId === playerId);
  },

  getEventRatings(eventId: string): RatingEntry[] {
    return ratingsStore.filter((r) => r.eventId === eventId);
  },

  getPlayerStats(playerId: string): PlayerStats | undefined {
    // Return pre-computed stats for main players, otherwise derive from store
    if (mockPlayerStats[playerId]) return mockPlayerStats[playerId];
    const ratings = ratingsStore.filter((r) => r.playerId === playerId);
    if (ratings.length === 0) return undefined;
    const avg = ratings.reduce((s, r) => s + r.score, 0) / ratings.length;
    return {
      playerId,
      totalParticipations: ratings.length,
      totalRatings: ratings.length,
      currentRating: Math.round(avg * 10) / 10,
      evolution: 0,
      ratingHistory: ratings.map((r) => ({
        date: r.createdAt.slice(5, 10).replace("-", "/"),
        score: r.score,
        eventId: r.eventId,
      })),
    };
  },

  submitRatings(
    eventId: string,
    captainId: string,
    scores: { playerId: string; score: number }[],
  ): void {
    const now = new Date().toISOString();
    scores.forEach(({ playerId, score }) => {
      ratingsStore.push({
        id: `r${Date.now()}-${playerId}`,
        eventId,
        playerId,
        captainId,
        score,
        createdAt: now,
      });
      // Update precomputed stats
      const stats = mockPlayerStats[playerId];
      if (stats) {
        const newAvg =
          (stats.currentRating * stats.totalRatings + score) /
          (stats.totalRatings + 1);
        stats.evolution = Math.round((newAvg - stats.currentRating) * 10) / 10;
        stats.currentRating = Math.round(newAvg * 10) / 10;
        stats.totalRatings++;
        stats.totalParticipations++;
        stats.ratingHistory.push({
          date: now.slice(5, 10).replace("-", "/"),
          score,
          eventId,
        });
      }
    });
  },

  getClubAverageRating(): number {
    if (ratingsStore.length === 0) return 0;
    const avg =
      ratingsStore.reduce((s, r) => s + r.score, 0) / ratingsStore.length;
    return Math.round(avg * 10) / 10;
  },
};
