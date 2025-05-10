const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'unlock',
    description: 'Déverrouille tous les salons pour permettre aux membres de parler.',
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
                        [PermissionsBitField.Flags.SendMessages]: true,
                        [PermissionsBitField.Flags.Speak]: true,
                        [PermissionsBitField.Flags.AddReactions]: true,
                        [PermissionsBitField.Flags.Connect]: true,
                    });
                });

                const embed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`${message.guild.channels.cache.size} salons ouverts.`)
                    .setFooter({ text: config.footer });

                return message.reply({ embeds: [embed] });
            } else {
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

                await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                    [PermissionsBitField.Flags.SendMessages]: true,
                    [PermissionsBitField.Flags.Speak]: true,
                    [PermissionsBitField.Flags.AddReactions]: true,
                    [PermissionsBitField.Flags.Connect]: true,
                });

                const embed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Les membres peuvent parler dans <#${channel.id}>.`)
                    .setFooter({ text: config.footer });

                return message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Erreur lors du déverrouillage des salons:', error);
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(' Une erreur est survenue lors de la tentative de déverrouillage des salons.')
                .setFooter({ text: config.footer });

            return message.reply({ embeds: [embed] });
        }
    }
};
