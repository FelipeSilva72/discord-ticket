import { createResponder, logger, ResponderType } from "#base";
import { generateTicketId, res } from "#functions";
import { menus } from "#menus";
import {
  createLinkButton,
  createRow,
  createSeparator,
} from "@magicyan/discord";
import { ChannelType, OverwriteData } from "discord.js";

createResponder({
  customId: "ticket/start",
  cache: "cached",
  types: [ResponderType.ModalComponent],
  async run(interaction) {
    await interaction.deferUpdate();

    const { fields, guild, member } = interaction;

    const permissionOverwrites: OverwriteData[] = [
      {
        id: guild.roles.everyone.id,
        deny: ["ViewChannel"],
        allow: [
          "SendMessages",
          "ReadMessageHistory",
          "AttachFiles",
          "EmbedLinks",
        ],
      },
      {
        id: member.id,
        allow: ["ViewChannel"],
      },
    ];

    const parent = interaction.channel?.parentId;

    await guild.channels
      .create({
        name: `ticket-${member.id}`,
        type: ChannelType.GuildText,
        permissionOverwrites,
        parent,
      })
      .then(async (ticketCreated) => {
        const id = generateTicketId();
        const reason = fields.getTextInputValue("reason");
        const createdAt = ticketCreated.createdAt;

        const message = await ticketCreated.send(
          menus.ticket.main({ id, reason, createdAt })
        );

        const row = createRow(
          createLinkButton({
            url: message.url,
            label: "Ir para Atendimento",
          })
        );

        await interaction.followUp(
          res.success(
            "Parabéns, seu atendimento foi iniciado com sucesso.",
            createSeparator(),
            row
          )
        );
      })
      .catch(async (err) => {
        logger.error(err);
        await interaction.followUp(
          res.danger("Desculpe, não foi possível iniciar seu atendimento.")
        );
      });
  },
});
