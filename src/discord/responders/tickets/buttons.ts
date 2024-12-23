import { Responder, ResponderType } from "#base";
import { res } from "#functions";
import { menus } from "#menus";
import { log } from "#settings";
import {
  createLinkButton,
  createRow,
  findChannel,
  sleep,
} from "@magicyan/discord";
import { CategoryChannel, ChannelType } from "discord.js";

new Responder({
  customId: "ticket/panel/:action",
  cache: "cached",
  type: ResponderType.Button,
  async run(interaction, { action }) {
    await interaction.deferUpdate();

    const { guild, member } = interaction;

    const channelTicket = findChannel(guild).byName(`ticket-${member.id}`);

    switch (action) {
      case "open": {
        if (channelTicket) {
          const row = createRow(
            createLinkButton({
              url: channelTicket.url,
              label: "Ir Para Ticket",
            })
          );

          await interaction.followUp(
            res.primary("Desculpe, você já possui um atendimento em aberto", {
              components: [row],
            })
          );
          return;
        }

        const parent = interaction.channel?.parent as CategoryChannel | null;

        await guild.channels
          .create({
            name: `ticket-${member.id}`,
            parent,
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: ["ViewChannel"],
                allow: ["SendMessages", "AttachFiles"],
              },
              {
                id: member.id,
                allow: ["ViewChannel"],
              },
            ],
          })
          .then(async (ticketCreated) => {
            const message = await ticketCreated.send(
              menus.ticket.panel(member)
            );

            const row = createRow(
              createLinkButton({
                url: message.url,
                label: "Ir Para Ticket",
              })
            );

            await interaction.followUp(
              res.success(
                "Parabéns, seu atendimento foi iniciado com sucesso",
                {
                  components: [row],
                }
              )
            );
          })
          .catch(async (err) => {
            log.error(err);
            await interaction.followUp(
              res.danger("Desculpe, não foi possível iniciar seu atendimento")
            );
          });
        return;
      }
      case "close": {
        if (!channelTicket) return;
        if (!member.permissions.has("Administrator")) {
          await interaction.followUp(
            res.primary(
              "Desculpe, você não possui permissão para usar esse botão"
            )
          );
          return;
        }

        await interaction.editReply(
          res.warning("Aviso, esse ticket será fechado em alguns segundos", {
            components: [],
          })
        );
        await sleep(3000);
        await channelTicket.delete().catch(() => null);
        return;
      }
    }
  },
});
