import type { User } from "@/types";
import { mockUsers } from "@/mock";

export const playerService = {
  getAll(): User[] {
    return mockUsers.filter((u) => u.role !== "admin");
  },

  getById(id: string): User | undefined {
    return mockUsers.find((u) => u.id === id);
  },

  getByIds(ids: string[]): User[] {
    return mockUsers.filter((u) => ids.includes(u.id));
  },

  getByGroup(groupId: string): User[] {
    return mockUsers.filter((u) => u.groupIds.includes(groupId));
  },
};
