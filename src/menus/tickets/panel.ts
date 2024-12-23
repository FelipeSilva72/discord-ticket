import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";

export function ticketPanelMenu(member: GuildMember) {
  const embed = createEmbed({
    color: settings.colors.primary,
    description: brBuilder(
      `Olá ${member.displayName}, seja bem-vindo(a) ao seu ticket`,
      "Para um melhor atendimento informe o motivo do seu contato"
    ),
  });

  const row = createRow(
    new ButtonBuilder({
      customId: "ticket/panel/close",
      style: ButtonStyle.Danger,
      label: "Fechar Atendimento",
    })
  );

  return {
    embeds: [embed],
    components: [row],
  };
}
