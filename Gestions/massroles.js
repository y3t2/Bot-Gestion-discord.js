const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');
const db = new QuickDB();

module.exports = {
    name: 'massroles',
    description: 'Ajoute un rôle à tous les membres du serveur après confirmation.',
    usage: '+massroles <id_role>',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        if (!Array.isArray(owners)) {
            console.error('Les owners ne sont pas un tableau, réinitialisez votre base de données.');
            return message.reply('Une erreur est survenue, contactez un administrateur.');
        }

        if (!owners.includes(message.author.id)) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande. Seuls les owners peuvent l'utiliser.`)
                .setFooter({ text: config.footer })
            ]});
        }

        if (!args[0]) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Veuillez fournir un rôle. Exemple : +massroles <id_role>')
                .setFooter({ text: config.footer })
            ]});
        }

        const targetRole = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === args.join(' ').toLowerCase());
        if (!targetRole) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Rôle introuvable.')
                .setFooter({ text: config.footer })
            ]});
        }

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('Confirmation d\'attribution de rôle')
            .setDescription(`Êtes-vous sûr de vouloir attribuer le rôle ${targetRole} à tous les membres ?`)
            .setFooter({ text: config.footer });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yes')
                    .setLabel('YES')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('no')
                    .setLabel('NO')
                    .setStyle(ButtonStyle.Danger)
            );

        await message.reply({ embeds: [embed], components: [row] });
    }
};
