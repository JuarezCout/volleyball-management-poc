import type { Team } from "@/types";
import { mockTeams } from "@/mock";

let teamsStore: Team[] = [...mockTeams];

export const teamService = {
  getAll(): Team[] {
    return teamsStore;
  },

  getByEvent(eventId: string): Team[] {
    return teamsStore.filter((t) => t.eventId === eventId);
  },

  getById(id: string): Team | undefined {
    return teamsStore.find((t) => t.id === id);
  },

  addPlayerToTeam(teamId: string, playerId: string): boolean {
    const team = teamsStore.find((t) => t.id === teamId);
    if (!team) return false;
    if (team.playerIds.includes(playerId)) return false;
    if (team.playerIds.length >= team.maxPlayers) return false;
    team.playerIds = [...team.playerIds, playerId];
    return true;
  },

  addBackupToTeam(teamId: string, playerId: string): boolean {
    const team = teamsStore.find((t) => t.id === teamId);
    if (!team) return false;
    if (team.backupIds.includes(playerId)) return false;
    if (team.backupIds.length >= team.maxBackups) return false;
    team.backupIds = [...team.backupIds, playerId];
    return true;
  },

  removePlayerFromTeam(teamId: string, playerId: string): boolean {
    const team = teamsStore.find((t) => t.id === teamId);
    if (!team) return false;
    team.playerIds = team.playerIds.filter((id) => id !== playerId);
    team.backupIds = team.backupIds.filter((id) => id !== playerId);
    return true;
  },

  createTeam(data: Omit<Team, "id">): Team {
    const team: Team = { ...data, id: `t${Date.now()}` };
    teamsStore.push(team);
    return team;
  },
};
