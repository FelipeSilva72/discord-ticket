import { icon } from "#functions";
import settings from "#settings" with { type: "json" };
import { createContainer, createRow, createSeparator, createTextDisplay } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, type InteractionReplyOptions } from "discord.js";

export function setupMenu<R>(): R {
  const container = createContainer({
    accentColor: settings.colors.primary,
    components: [
        createTextDisplay(`## ${icon.mail} Sistema de Atendimentos`),
        createSeparator(),
        createTextDisplay("Para iniciar seu atendimento, clique no botão abaixo."),
        createSeparator(),
        createRow(
          new ButtonBuilder({
            customId: "ticket/start",
            style: ButtonStyle.Primary,
            label: "Iniciar Atendimento",
            emoji: icon.phone,
          })
        )
    ]
  });

  return {
    flags: ["Ephemeral", "IsComponentsV2"],
    components: [container],
  } satisfies InteractionReplyOptions as R;
}
