// services/push.service.ts
import admin from "./firebase.service";
import Device from "../models/Device";

class PushService {
  async sendToDevices(
    devices: any[],
    payload: { title: string; body: string },
  ) {
    const tokens = devices
      .map((d) => d.pushToken)
      .filter((t): t is string => typeof t === "string" && t.length > 10);

    if (!tokens.length) {
      console.log("⚠️ No valid FCM tokens");
      return null;
    }

    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
    });

    const invalidTokens: string[] = [];

    response.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error?.code;

        if (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token"
        ) {
          invalidTokens.push(tokens[i]);
        }
      }
    });

    if (invalidTokens.length) {
      await Device.destroy({
        where: { pushToken: invalidTokens },
      });
    }

    console.log("FCM response:", response);

    return response;
  }

  async handleReceipts(response: any) {
    if (!response) return;
    console.log("FCM receipts:", response.responses);
  }
}

export const pushService = new PushService();
