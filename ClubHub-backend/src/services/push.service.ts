import deviceService from "./device.service";

const EXPO_URL = "https://exp.host/--/api/v2/push/send";
const RECEIPTS_URL = "https://exp.host/--/api/v2/push/getReceipts";

class PushService {
  // 📤 ENVIAR NOTIFICAÇÕES
  async sendToDevices(devices: any[], payload: any) {
    const messages = devices.map((d) => ({
      to: d.pushToken,
      sound: "default",
      ...payload,
    }));

    const response = await fetch(EXPO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });

    const data = await response.json();

    // 🔗 mapear ticket → token
    return data.data.map((ticket: any, index: number) => ({
      ...ticket,
      pushToken: devices[index].pushToken,
    }));
  }

  // 📥 TRATAR RECEIPTS (erros)
  async handleReceipts(tickets: any[]) {
    if (!tickets || tickets.length === 0) return;

    // 📌 map ticketId -> pushToken
    const ticketMap = new Map<string, string>();

    tickets.forEach((t) => {
      if (t.id && t.pushToken) {
        ticketMap.set(t.id, t.pushToken);
      }
    });

    const receiptIds = tickets
      .filter((t) => t.status === "ok")
      .map((t) => t.id);

    if (receiptIds.length === 0) return;

    const response = await fetch(RECEIPTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: receiptIds }),
    });

    const receipts = await response.json();

    const invalidTokens: string[] = [];

    for (const id in receipts.data) {
      const receipt = receipts.data[id];

      if (receipt.status === "error") {
        if (receipt.details?.error === "DeviceNotRegistered") {
          const pushToken = ticketMap.get(id);

          if (pushToken) {
            invalidTokens.push(pushToken);
          }
        }
      }
    }

    // 🧹 remover tokens inválidos da DB
    if (invalidTokens.length > 0) {
      await deviceService.deleteByTokens(invalidTokens);
    }
  }
}

export default new PushService();