import Feedback from "../models/Feedback";

class FeedbackService {
  async create(data: {
    type: "suggestion" | "bug";
    message: string;
    imageUrl?: string | null;
    deviceId?: string | null;
  }): Promise<Feedback> {
    return Feedback.create({
      type: data.type,
      message: data.message,
      imageUrl: data.imageUrl ?? null,
      deviceId: data.deviceId ?? null,
    });
  }

  async findAll(limit = 100, offset = 0): Promise<Feedback[]> {
    return Feedback.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
  }
}

export default new FeedbackService();
