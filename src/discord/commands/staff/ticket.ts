import { Command } from "#base";
import { res } from "#functions";
import { log } from "#settings";
import {
  createEmbed,
  createEmbedFooter,
  createLinkButton,
  createRow,
} from "@magicyan/discord";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  codeBlock,
} from "discord.js";

new Command({
  name: "ticket",
  description: "Comando de Ticket",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "Por favor, selecione o canal de ticket",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required,
    },
  ],
  async run(interaction) {
    await interaction.deferReply({ ephemeral });

    const { options } = interaction;
    const channel = options.getChannel("canal", true, [ChannelType.GuildText]);

    const embed = createEmbed({
      title: "Sistema de Ticket",
      description: codeBlock(
        "Para iniciar seu atendimento, clique no botão abaixo"
      ),
      footer: createEmbedFooter({
        text: "Por favor, não abrir ticket sem necessidade",
      }),
      color: "Blurple",
    });

    const row = createRow(
      new ButtonBuilder({
        customId: "button/ticket/open",
        label: "Iniciar Atendimento",
        style: ButtonStyle.Primary,
      })
    );

    await channel
      .send({
        embeds: [embed],
        components: [row],
      })
      .then(async (message) => {
        const rowShortcut = createRow(
          createLinkButton({
            url: message.url,
            label: "Ir Para Mensagem",
          })
        );

        await interaction.editReply(
          res.success("Parabéns, o sistema de ticket foi enviado com sucesso", {
            components: [rowShortcut],
          })
        );
      })
      .catch(async (err: Error) => {
        log.error(err.message);
        await interaction.editReply(
          res.danger("Desculpe, não foi possível enviar o sistema de ticket")
        );
      });
  },
});
