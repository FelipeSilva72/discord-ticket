import { formatDate, icon } from "#functions";
import settings from "#settings" with { type: "json" };
import { createContainer, createRow, createSeparator, createTextDisplay } from "@magicyan/discord";
import {
    ButtonBuilder,
    ButtonStyle,
    codeBlock,
    type InteractionReplyOptions
} from "discord.js";

interface TicketData {
    id: string;
    reason: string;
    createdAt: Date
}

export function mainMenu<R>(data: TicketData): R {
  const container = createContainer({
    accentColor: settings.colors.primary,
    components: [
        createTextDisplay("## Atendimento"),
        createSeparator(),
        createTextDisplay(`ID: ${codeBlock(data.id)}`),
        createTextDisplay(`Motivo: ${codeBlock(data.reason)}`),
        createTextDisplay(`Data de Criação: ${codeBlock(formatDate(data.createdAt))}`),
        createSeparator(),
        createRow(
            new ButtonBuilder({
                customId: "ticket/close",
                style: ButtonStyle.Danger,
                label: "Fecha Atendimento",
                emoji: icon.phonecancel
            })
        )
    ]
  });

  return {
    flags: ["Ephemeral", "IsComponentsV2"],
    components: [container],
  } satisfies InteractionReplyOptions as R;
}
