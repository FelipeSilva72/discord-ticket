import { bootstrapApp } from "#base";

await bootstrapApp({
  workdir: import.meta.dirname,
  commands: {
    guilds: [process.env.MAIN_GUILD_ID],
  },
  loadLogs: false,
});
