import { icon } from "#functions";
import {
  createContainer,
  createRow,
  createSeparator,
  createTextDisplay,
} from "@magicyan/discord";
import {
  ButtonBuilder,
  ButtonStyle,
  type InteractionReplyOptions,
} from "discord.js";

export function setupMenu<R>(): R {
  const container = createContainer({
    accentColor: constants.colors.primary,
    components: [
      createTextDisplay(`# ${icon.mail} Sistema de Atendimentos`),
      createSeparator(),
      createTextDisplay(
        "Para iniciar seu atendimento, clique no botão abaixo."
      ),
      createSeparator(),
      createRow(
        new ButtonBuilder({
          customId: "ticket/start",
          style: ButtonStyle.Primary,
          label: "Iniciar Atendimento",
          emoji: icon.mail,
        })
      ),
    ],
  });

  return {
    flags: ["Ephemeral", "IsComponentsV2"],
    components: [container],
  } satisfies InteractionReplyOptions as R;
}
