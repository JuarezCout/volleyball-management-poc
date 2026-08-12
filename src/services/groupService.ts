import type { Group } from "@/types";
import { mockGroups } from "@/mock";

let groupsStore: Group[] = [...mockGroups];

export const groupService = {
  getAll(): Group[] {
    return groupsStore;
  },

  getById(id: string): Group | undefined {
    return groupsStore.find((g) => g.id === id);
  },

  getByAdmin(adminId: string): Group[] {
    return groupsStore.filter((g) => g.adminId === adminId);
  },

  getByMember(userId: string): Group[] {
    return groupsStore.filter((g) => g.memberIds.includes(userId));
  },

  getTotalMembers(): number {
    return groupsStore.reduce((s, g) => s + g.memberCount, 0);
  },
};
