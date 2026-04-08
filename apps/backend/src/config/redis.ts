// src/config/redis.ts

// This disables Redis gracefully when not available locally
// Prevents ECONNREFUSED crashes during development

class RedisMock {
  async get(_key: string) {
    return null;
  }

  async set(_key: string, _value: string, _expiry?: number) {
    return "OK";
  }

  async del(_key: string) {
    return 1;
  }

  async quit() {
    return "OK";
  }
}

// Toggle Redis usage via environment variable
const useRedis = process.env.USE_REDIS === "true";

export const redis = useRedis
  ? require("./redisClient").default // your real Redis client
  : new RedisMock();