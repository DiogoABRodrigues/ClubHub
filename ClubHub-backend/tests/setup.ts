process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://clubhub:clubhub@localhost:5432/clubhub_test";
process.env.REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? "test-access-secret-at-least-32-chars";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ?? "test-refresh-secret-at-least-32-chars";
process.env.SUPABASE_URL = process.env.SUPABASE_URL ?? "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "test-service-role-key";
process.env.FIREBASE_PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ?? "clubhub-test";
process.env.FIREBASE_CLIENT_EMAIL =
  process.env.FIREBASE_CLIENT_EMAIL ?? "test@clubhub.invalid";
process.env.FIREBASE_PRIVATE_KEY =
  process.env.FIREBASE_PRIVATE_KEY ??
  "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n";
