import { Event } from "#base";
import { ActivityType } from "discord.js";

new Event({
  name: "Ready",
  event: "ready",
  run(client) {
    client.user.setPresence({
      activities: [
        {
          name: "Bot de Ticket",
          type: ActivityType.Listening,
        },
      ],
    });
  },
});
