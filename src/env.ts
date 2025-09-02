import { validateEnv } from "#base";
import { z } from "zod";

export const env = validateEnv(
  z.object({
    BOT_TOKEN: z.string("Discord Bot Token is required").min(1),
    GUILD_ID: z.string("Main guild ID is required").min(1),
    WEBHOOK_LOGS_URL: z.url().optional(),
  })
);
