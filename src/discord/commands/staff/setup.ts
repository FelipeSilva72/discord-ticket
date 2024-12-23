import { Command } from "#base";
import { res } from "#functions";
import { menus } from "#menus";
import { log } from "#settings";
import { createLinkButton, createRow } from "@magicyan/discord";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

new Command({
  name: "setup",
  description: "Comando de Setup",
  options: [
    {
      name: "ticket",
      description: "Comando para enviar o sistema de ticket",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "canal",
          description: "Por favor, selecione o canal de ticket",
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildText],
          required,
        },
      ],
    },
  ],
  async run(interaction) {
    await interaction.deferReply({ ephemeral });

    const { options, guild } = interaction;
    const subCommand = options.getSubcommand(true);

    const channel = options.getChannel("canal", true, [ChannelType.GuildText]);

    switch (subCommand) {
      case "ticket": {
        await channel
          .send(menus.ticket.main(guild))
          .then(async (message) => {
            const row = createRow(
              createLinkButton({
                url: message.url,
                label: "Ir Para Mensagem",
              })
            );

            await interaction.editReply(
              res.success(
                "Parabéns, seu sistema de tickets foi enviado com sucesso",
                {
                  components: [row],
                }
              )
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.editReply(
              res.danger(
                "Desculpe, não foi possível enviar o sistema de tickets"
              )
            );
          });
        return;
      }
    }
  },
});
