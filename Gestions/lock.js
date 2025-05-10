const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'lock',
    description: 'Verrouille tous les salons pour empêcher les membres de parler.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        const isOwner = owners.includes(message.author.id);
        const hasAdminPermission = message.member.permissions.has(PermissionsBitField.Flags.Administrator);

        if (!hasAdminPermission && !isOwner) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                .setFooter({ text: config.footer });

            return message.reply({ embeds: [embed] });
        }

        try {
            if (args[0] === "all") {
                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                        [PermissionsBitField.Flags.SendMessages]: false,
                        [PermissionsBitField.Flags.Speak]: false,
                        [PermissionsBitField.Flags.AddReactions]: false,
                        [PermissionsBitField.Flags.Connect]: false,
                    });
                });

                const embed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`${message.guild.channels.cache.size} salons verrouillés.`)
                    .setFooter({ text: config.footer });

                return message.reply({ embeds: [embed] });
            } else {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    [PermissionsBitField.Flags.SendMessages]: false,
                    [PermissionsBitField.Flags.Speak]: false,
                    [PermissionsBitField.Flags.AddReactions]: false,
                    [PermissionsBitField.Flags.Connect]: false,
                });

                const embed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Les membres ne peuvent plus parler dans <#${channel.id}>.`)
                    .setFooter({ text: config.footer });

                return message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Erreur lors du verrouillage des salons:', error);
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Une erreur est survenue lors de la tentative de verrouillage des salons.')
                .setFooter({ text: config.footer });

            return message.reply({ embeds: [embed] });
        }
    }
};
