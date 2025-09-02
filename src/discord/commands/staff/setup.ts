import { createCommand, logger } from "#base";
import { icon, res } from "#functions";
import { menus } from "#menus";
import {
  createLinkButton,
  createRow,
  createSeparator,
} from "@magicyan/discord";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

createCommand({
  name: "setup",
  description: "Comando de setups.",
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "ticket",
      description: "Enviar o setup de tickets.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "canal",
          description: "Canal onde o setup será enviado.",
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildText],
          required: true,
        },
      ],
    },
  ],
  async run(interaction) {
    await interaction.deferReply({ flags: ["Ephemeral"] });

    const { options } = interaction;
    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case "ticket": {
        const channel = options.getChannel("canal", true, [
          ChannelType.GuildText,
        ]);

        await channel
          .send(menus.ticket.setup())
          .then(async (message) => {
            const row = createRow(
              createLinkButton({
                url: message.url,
                label: "Ir para Mensagem",
              })
            );

            await interaction.editReply(
              res.success(
                `${icon.check} Parabéns, o setup foi enviado com sucesso.`,
                createSeparator(),
                row
              )
            );
          })
          .catch(async (err) => {
            logger.error(err);
            await interaction.editReply(
              res.danger(
                `${icon.cancel} Desculpe, não foi possível enviar o setup.`
              )
            );
          });
        return;
      }
    }
  },
});
