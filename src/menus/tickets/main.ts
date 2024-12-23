import { settings } from "#settings";
import {
  brBuilder,
  createEmbed,
  createEmbedAuthor,
  createRow,
} from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild } from "discord.js";

export function ticketMainMenu(guild: Guild) {
  const embed = createEmbed({
    color: settings.colors.primary,
    author: createEmbedAuthor(guild, {
      suffix: " | Ticket",
    }), 
    description: brBuilder(
      "Inicie seu atendimento clicando no botão abaixo",
      "-# Por favor, não abra um ticket sem necessidade"
    ),
  });

  const row = createRow(
    new ButtonBuilder({
      customId: "ticket/panel/open",
      style: ButtonStyle.Primary,
      label: "Iniciar Atendimento",
    })
  );

  return {
    embeds: [embed],
    components: [row],
  };
}
