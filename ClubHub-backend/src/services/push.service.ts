import admin from "./firebase.service";
import deviceService from "./device.service";

class PushService {
  async sendToDevices(
    devices: any[],
    payload: {
      title: string;
      body: string;
      imageUrl?: string;
      mainTeamLogoUrl?: string;
      otherTeamLogoUrl?: string;
    },
  ) {
    const tokens = Array.from(
      new Set(
        devices
          .map((device) => device.pushToken)
          .filter(
            (token): token is string =>
              typeof token === "string" && token.length > 10,
          ),
      ),
    );

    if (!tokens.length) return [];

    const invalidTokens: string[] = [];
    const responses = [];

    for (let offset = 0; offset < tokens.length; offset += 500) {
      const batch = tokens.slice(offset, offset + 500);
      const response = await admin.messaging().sendEachForMulticast({
        tokens: batch,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        android: {
          notification: {
            color: "#800000",
            icon: "icon_notifications",
            imageUrl: payload.imageUrl ?? undefined,
          },
        },
      });
      responses.push(response);

      response.responses.forEach((result, index) => {
        if (result.success) return;
        const code = result.error?.code;
        if (
          code === "messaging/registration-token-not-registered" ||
          code === "messaging/invalid-registration-token"
        ) {
          invalidTokens.push(batch[index]);
        }
      });
    }

    if (invalidTokens.length) {
      await deviceService.deleteByTokens(invalidTokens);
    }

    return responses;
  }

  async handleReceipts(response: unknown) {
    return response;
  }
}

export const pushService = new PushService();
