import { formatDate, icon } from "#functions";
import {
  createContainer,
  createRow,
  createSeparator,
  createTextDisplay,
} from "@magicyan/discord";
import {
  ButtonBuilder,
  ButtonStyle,
  bold,
  codeBlock,
  type InteractionReplyOptions,
} from "discord.js";

interface TicketData {
  ticketId: string;
  reason: string;
  createdAt: Date;
}

export function mainMenu<R>(data: TicketData): R {
  const container = createContainer({
    accentColor: constants.colors.primary,
    components: [
      createTextDisplay("# Atendimento"),
      createSeparator(),
      createTextDisplay(
        `${icon.key} ${bold("ID")} ${codeBlock(data.ticketId)}`
      ),
      createTextDisplay(
        `${icon.file} ${bold("Motivo")} ${codeBlock(data.reason)}`
      ),
      createTextDisplay(
        `${icon.calendar} ${bold("Data de Criação")} ${codeBlock(
          formatDate(data.createdAt)
        )}`
      ),
      createSeparator(),
      createRow(
        new ButtonBuilder({
          customId: "ticket/close",
          style: ButtonStyle.Danger,
          label: "Fecha Atendimento",
          emoji: icon.trash,
        })
      ),
    ],
  });

  return {
    flags: ["Ephemeral", "IsComponentsV2"],
    components: [container],
  } satisfies InteractionReplyOptions as R;
}
