import { createResponder, logger, ResponderType } from "#base";
import { generateId, icon, res } from "#functions";
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
    const ticketId = generateId();

    await guild.channels
      .create({
        name: `ticket-${ticketId}`,
        type: ChannelType.GuildText,
        topic: member.id,
        parent,
        permissionOverwrites,
      })
      .then(async (ticketCreated) => {
        const reason = fields.getTextInputValue("reason");
        const createdAt = ticketCreated.createdAt;

        const message = await ticketCreated.send(
          menus.ticket.main({
            ticketId,
            reason,
            memberName: member.displayName,
            createdAt,
          })
        );

        const row = createRow(
          createLinkButton({
            url: message.url,
            label: "Ir para Atendimento",
          })
        );

        await interaction.followUp(
          res.success(
            `${icon.check} Parabéns, seu atendimento foi iniciado com sucesso.`,
            createSeparator(),
            row
          )
        );
      })
      .catch(async (err) => {
        logger.error(err);
        await interaction.followUp(
          res.danger(
            `${icon.info} Desculpe, não foi possível iniciar seu atendimento.`
          )
        );
      });
  },
});
