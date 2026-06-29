import admin from "./firebase.service";
import deviceService from "./device.service";
import { redis } from "../config/redis";
import { randomUUID } from "crypto";

type PushPayload = {
  title: string;
  body: string;
  imageUrl?: string;
  mainTeamLogoUrl?: string;
  otherTeamLogoUrl?: string;
};

type PushJob = {
  id: string;
  tokens: string[];
  payload: PushPayload;
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  lastError?: string;
};

const READY_QUEUE_KEY = "push:queue:ready";
const PROCESSING_QUEUE_KEY = "push:queue:processing";
const JOB_KEY_PREFIX = "push:queue:job:";
const POLL_INTERVAL_MS = 5_000;
const PROCESSING_TIMEOUT_MS = 120_000;
const MAX_JOBS_PER_TICK = 10;
const DEFAULT_MAX_ATTEMPTS = 5;
const RETRY_DELAYS_MS = [30_000, 120_000, 300_000, 900_000, 1_800_000];
const CLAIM_DUE_JOBS_SCRIPT = `
local ids = redis.call(
  "ZRANGEBYSCORE",
  KEYS[1],
  0,
  ARGV[1],
  "LIMIT",
  0,
  ARGV[3]
)
for _, id in ipairs(ids) do
  redis.call("ZREM", KEYS[1], id)
  redis.call("ZADD", KEYS[2], ARGV[2], id)
end
return ids
`;

function jobKey(id: string) {
  return `${JOB_KEY_PREFIX}${id}`;
}

class PushService {
  private worker?: NodeJS.Timeout;
  private processing = false;

  private tokensFromDevices(devices: any[]) {
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

    return tokens;
  }

  async sendToDevices(devices: any[], payload: PushPayload) {
    return this.enqueueToDevices(devices, payload);
  }

  async enqueueToDevices(devices: any[], payload: PushPayload) {
    const tokens = this.tokensFromDevices(devices);
    if (!tokens.length) return null;

    const now = Date.now();
    const job: PushJob = {
      id: randomUUID(),
      tokens,
      payload,
      attempts: 0,
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      createdAt: now,
    };

    await redis.set(jobKey(job.id), JSON.stringify(job));
    await redis.zAdd(READY_QUEUE_KEY, { score: now, value: job.id });

    return { id: job.id, queued: tokens.length };
  }

  startWorker() {
    if (this.worker) return;
    this.worker = setInterval(() => {
      void this.processDueJobs();
    }, POLL_INTERVAL_MS);
    this.worker.unref();
    void this.processDueJobs();
  }

  stopWorker() {
    if (!this.worker) return;
    clearInterval(this.worker);
    this.worker = undefined;
  }

  private async processDueJobs() {
    if (this.processing || !redis.isOpen) return;
    this.processing = true;

    try {
      await this.recoverExpiredJobs();

      const now = Date.now();
      const claimedIds = await redis.eval(CLAIM_DUE_JOBS_SCRIPT, {
        keys: [READY_QUEUE_KEY, PROCESSING_QUEUE_KEY],
        arguments: [
          String(now),
          String(now + PROCESSING_TIMEOUT_MS),
          String(MAX_JOBS_PER_TICK),
        ],
      });
      const jobIds = Array.isArray(claimedIds) ? claimedIds : [];

      for (const jobId of jobIds) {
        if (typeof jobId === "string") {
          await this.processJob(jobId);
        }
      }
    } catch (error) {
      console.error("Erro no worker de notificações push:", error);
    } finally {
      this.processing = false;
    }
  }

  private async recoverExpiredJobs() {
    const now = Date.now();
    const expiredIds = await redis.zRangeByScore(PROCESSING_QUEUE_KEY, 0, now, {
      LIMIT: { offset: 0, count: MAX_JOBS_PER_TICK },
    });

    for (const jobId of expiredIds) {
      const claimed = await redis.zRem(PROCESSING_QUEUE_KEY, jobId);
      if (!claimed) continue;

      const exists = await redis.exists(jobKey(jobId));
      if (!exists) continue;
      await redis.zAdd(READY_QUEUE_KEY, { score: now, value: jobId });
    }
  }

  private async processJob(jobId: string) {
    const raw = await redis.get(jobKey(jobId));
    if (!raw) {
      await redis.zRem(PROCESSING_QUEUE_KEY, jobId);
      return;
    }

    const job = JSON.parse(raw) as PushJob;

    try {
      await this.sendToTokens(job.tokens, job.payload);
      await redis
        .multi()
        .zRem(PROCESSING_QUEUE_KEY, jobId)
        .del(jobKey(jobId))
        .exec();
    } catch (error) {
      const nextJob: PushJob = {
        ...job,
        attempts: job.attempts + 1,
        lastError: error instanceof Error ? error.message : String(error),
      };

      await redis.zRem(PROCESSING_QUEUE_KEY, jobId);

      if (nextJob.attempts >= nextJob.maxAttempts) {
        console.error("Notificação push esgotou tentativas:", {
          jobId,
          attempts: nextJob.attempts,
          lastError: nextJob.lastError,
        });
        await redis.del(jobKey(jobId));
        return;
      }

      const retryDelay =
        RETRY_DELAYS_MS[
          Math.min(nextJob.attempts - 1, RETRY_DELAYS_MS.length - 1)
        ];
      await redis.set(jobKey(jobId), JSON.stringify(nextJob));
      await redis.zAdd(READY_QUEUE_KEY, {
        score: Date.now() + retryDelay,
        value: jobId,
      });
    }
  }

  private async sendToTokens(tokens: string[], payload: PushPayload) {
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
