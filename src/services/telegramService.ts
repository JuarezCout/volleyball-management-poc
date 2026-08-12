// Simulated Telegram integration — no real API calls
export interface TelegramMessage {
  chatId: string;
  text: string;
}

export const telegramService = {
  isConnected(groupId: string): boolean {
    const connected = ["g2", "g7"];
    return connected.includes(groupId);
  },

  buildEventMessage(params: {
    groupName: string;
    date: string;
    time: string;
    location: string;
    price: number;
    slots: number;
    link?: string;
  }): string {
    return `🏐 *NOVO JOGO ABERTO*

📅 ${params.groupName}
🕐 ${params.date} às ${params.time}
📍 ${params.location}
💶 €${params.price}
👥 ${params.slots} vagas

Inscrições abertas!

👉 [PARTICIPAR](${params.link ?? "https://voleiclub.pt/events"})`;
  },

  // Simulated send — returns fake delay
  async sendMessage(
    chatId: string,
    text: string,
  ): Promise<{ ok: boolean; messageId?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { ok: true, messageId: `msg${Date.now()}` };
  },

  async sendTestMessage(
    groupId: string,
  ): Promise<{ ok: boolean; preview: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      ok: true,
      preview: `🏐 NOVO JOGO ABERTO\n\nTerça-feira — 20:00\n📍 Clube Central\n💶 €8\n👥 16 vagas\n\nInscrições abertas!\n\n👉 [PARTICIPAR]`,
    };
  },
};
