import { Responder, ResponderType } from "#base";
import { res } from "#functions";
import { log } from "#settings";
import {
  createEmbed,
  createLinkButton,
  createRow,
  findChannel,
} from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";

new Responder({
  customId: "button/ticket/:action",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction, { action }) {
    await interaction.deferUpdate();

    const { guild, member } = interaction;
    const channel = findChannel(guild).byName(`ticket-${member.id}`);

    switch (action) {
      case "open": {
        if (channel) {
          const rowShortcut = createRow(
            createLinkButton({
              url: channel.url,
              label: "Ir Para Ticket",
            })
          );

          await interaction.followUp(
            res.primary("Desculpe, você já possui um atendimento em aberto", {
              components: [rowShortcut],
            })
          );
          return;
        }

        await guild.channels
          .create({
            name: `ticket-${member.id}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: ["ViewChannel"],
              },
              {
                id: member.id,
                allow: [
                  "ViewChannel",
                  "SendMessages",
                  "AttachFiles",
                  "EmbedLinks",
                  "UseApplicationCommands",
                  "ReadMessageHistory",
                ],
              },
            ],
          })
          .then(async (channelCreated) => {
            const embed = createEmbed({
              description: `Olá ${member.displayName}, para um melhor atendimento informe o assunto sobre o seu contato`,
              color: "Blurple",
            });

            const row = createRow(
              new ButtonBuilder({
                customId: "button/ticket/close",
                label: "Fechar Atendimento",
                style: ButtonStyle.Danger,
              })
            );

            await channelCreated
              .send({
                embeds: [embed],
                components: [row],
              })
              .then(async (message) => {
                const rowShortcut = createRow(
                  createLinkButton({
                    url: message.url,
                    label: "Ir Para Ticket",
                  })
                );

                await interaction.followUp(
                  res.success("Parabéns, seu ticket foi aberto com sucesso", {
                    components: [rowShortcut],
                  })
                );
              })
              .catch(async (err: Error) => {
                log.error(err.message);
                await interaction.followUp(
                  res.danger("Desculpe, não foi possível abrir seu ticket")
                );
              });
          });
        return;
      }
      case "close": {
        if (!channel) return;

        if (!member.permissions.has("ManageChannels")) {
          await interaction.followUp(
            res.primary(
              "Desculpe, você não possui permissão para usar esse botão"
            )
          );
          return;
        }

        const embed = createEmbed({
          description: "Esse ticket será excluído em alguns segundos",
          color: "Yellow",
        });

        await interaction
          .editReply({
            embeds: [embed],
            components: [],
          })
          .then(() => {
            setTimeout(async () => {
              await channel.delete().catch(async (err: Error) => {
                log.error(err.message);
                await interaction.editReply(
                  res.primary(
                    "Desculpe, ocorreu um erro ao tentar excluir o ticket"
                  )
                );
              });
            }, 5000);
          })
          .catch(async (err: Error) => {
            log.error(err.message);
            await interaction.editReply(
              res.danger("Desculpe, não foi possível excluir o ticket")
            );
          });
        return;
      }
    }
  },
});
