import { createResponder, ResponderType } from "#base";
import { icon, res } from "#functions";
import {
  createLinkButton,
  createModalInput,
  createRow,
  createSeparator,
  findChannel,
  sleep,
} from "@magicyan/discord";
import {
  ChannelType,
  ModalBuilder,
  TextChannel,
  TextInputStyle,
} from "discord.js";

createResponder({
  customId: "ticket/:action",
  cache: "cached",
  types: [ResponderType.Button],
  async run(interaction, { action }) {
    const { guild, member, customId } = interaction;

    switch (action) {
      case "start": {
        const ticketChannel = findChannel(
          guild,
          ChannelType.GuildText
        ).byFilter((c) => Boolean(c.topic?.includes(member.id)));

        if (ticketChannel) {
          await interaction.reply(
            res.primary(
              `${icon.info} Desculpe, você já possui um atendimento em aberto.`,
              createSeparator(),
              createRow(
                createLinkButton({
                  url: ticketChannel.url,
                  label: "Ir para Atendimento",
                })
              )
            )
          );
          return;
        }

        const modal = new ModalBuilder({
          customId,
          title: "Criação de Ticket",
          components: [
            createModalInput({
              customId: "reason",
              label: "Motivo",
              placeholder: "Por favor, informe o motivo do seu contato.",
              maxLength: 100,
              minLength: 5,
              style: TextInputStyle.Short,
              required: true,
            }),
          ],
        });

        await interaction.showModal(modal);
        return;
      }
      case "close": {
        if (!member.permissions.has("Administrator")) {
          await interaction.reply(
            res.warning(`${icon.info} Desculpe, você não possui permissão.`)
          );
          return;
        }

        const channel = interaction.channel as TextChannel;

        await interaction.update(
          res.warning(
            `${icon.info} Aviso, esse atendimento será excluído em alguns segundos.`
          )
        );

        await sleep.seconds(5);
        channel.delete().catch(() => null);
        return;
      }
    }
  },
});
