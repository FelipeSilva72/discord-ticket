import { setupCreators } from "#base";
import { env } from "#env";

export const { createCommand, createEvent, createResponder } = setupCreators({
  commands: {
    guilds: [env.GUILD_ID],
  },
});
