const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const configticket = require('../../Data/configticket.json');
const config = require('../../Client/config.js');

module.exports = {
    name: 'claim',
    description: 'Réclamer un ticket',
    async execute(interaction) {
        const ticketChannel = interaction.channel;

        if (!ticketChannel.name.startsWith('ticket-')) {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Cette commande ne peut être utilisée que dans un ticket.')
                .setFooter({ text: config.footer });
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const member = ticketChannel.guild.members.cache.get(interaction.member.id);
        const viewRoleIds = configticket.view_role_ids;

        // Vérifiez si le membre a l'un des rôles requis
        const hasViewRole = viewRoleIds.some(roleId => member.roles.cache.has(roleId));

        if (!hasViewRole) {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${interaction.member.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                .setFooter({ text: config.footer });
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        await ticketChannel.permissionOverwrites.edit(ticketChannel.guild.roles.everyone, {
            [PermissionsBitField.Flags.SendMessages]: false,
        });
        await ticketChannel.permissionOverwrites.edit(member, {
            [PermissionsBitField.Flags.SendMessages]: true,
        });

        const claimedEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(`${interaction.member} a claim ce ticket. Vous êtes maintenant le seul à pouvoir parler ici.`)
            .setFooter({ text: config.footer });

        await ticketChannel.send({ embeds: [claimedEmbed] });
    },
};
