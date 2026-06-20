import { publicApi } from "./api";

export type FeedbackType = "suggestion" | "bug";

export interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  imageUri?: string;
  deviceId?: string;
}

export const FeedbackService = {
  send: async (payload: FeedbackPayload): Promise<void> => {
    const formData = new FormData();

    formData.append("type", payload.type);
    formData.append("message", payload.message);

    if (payload.deviceId) {
      formData.append("deviceId", payload.deviceId);
    }

    if (payload.imageUri) {
      const filename = payload.imageUri.split("/").pop() ?? "screenshot.jpg";
      const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";

      formData.append("image", {
        uri: payload.imageUri,
        name: filename,
        type: mimeType,
      } as any);
    }

    await publicApi.post("/feedback", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
