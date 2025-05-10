const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const configticket = require('../Data/configticket.json');
const config = require('../Client/config');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { guild, user, customId } = interaction;

        if (customId === 'create_ticket') {
            let alreadyOpened = guild.channels.cache.some(c => c.topic === user.id);

            if (alreadyOpened) {
                return interaction.reply({
                    content: 'Vous avez déjà un ticket ouvert.',
                    ephemeral: true,
                });
            }

            const ticketChannel = await guild.channels.create({
                name: `ticket-${user.username}`,
                type: ChannelType.GuildText,
            });

            await ticketChannel.setTopic(user.id);

            await ticketChannel.setParent(configticket.ticket_category_id);

            const everyone = guild.roles.everyone;

            await ticketChannel.permissionOverwrites.edit(everyone, {
                [PermissionsBitField.Flags.ViewChannel]: false,
            });

            await ticketChannel.permissionOverwrites.edit(user.id, {
                [PermissionsBitField.Flags.ViewChannel]: true,
                [PermissionsBitField.Flags.SendMessages]: true,
                [PermissionsBitField.Flags.ReadMessageHistory]: true,
                [PermissionsBitField.Flags.EmbedLinks]: true,
                [PermissionsBitField.Flags.AttachFiles]: true,
                [PermissionsBitField.Flags.AddReactions]: true,
            });

            const roles = configticket.view_role_ids;

            if (Array.isArray(roles)) {
                for (const roleId of roles) {
                    const role = guild.roles.cache.get(roleId);
                    if (role) {
                        await ticketChannel.permissionOverwrites.edit(role, {
                            [PermissionsBitField.Flags.ViewChannel]: true,
                            [PermissionsBitField.Flags.SendMessages]: true,
                            [PermissionsBitField.Flags.ReadMessageHistory]: true,
                            [PermissionsBitField.Flags.EmbedLinks]: true,
                            [PermissionsBitField.Flags.AttachFiles]: true,
                            [PermissionsBitField.Flags.AddReactions]: true,
                        });
                    } else {
                        console.warn(`Le rôle avec l'ID ${roleId} n'existe pas dans ce serveur.`);
                    }
                }
            } else {
                console.warn('Les rôles ne sont pas sous forme de tableau dans la configuration.');
            }

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle(configticket.title)
                .setDescription(`Vueillez patenter, un **Staff** vous viendra en aide dans très peu de temps.`)
                .setFooter({ text: configticket.footer });

            await ticketChannel.send({ embeds: [embed] });

            await interaction.reply({ content: `Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });
        }
    },
};
