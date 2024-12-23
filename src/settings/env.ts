import { z } from "zod";

const envSchema = z.object({
  // Env vars...
  BOT_TOKEN: z.string({ description: "Discord Bot Token is required" }).min(1),
  WEBHOOK_LOGS_URL: z.string().url().optional(),
  MAIN_GUILD_ID: z.string({ description: "Main guild id is required" }).min(1),
});

type EnvSchema = z.infer<typeof envSchema>;

export { envSchema, type EnvSchema };
