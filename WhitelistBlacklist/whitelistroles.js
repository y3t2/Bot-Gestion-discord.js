const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'whitelistroles',
    aliases: ['wlroles'],
    description: 'Liste tous les rôles sur la whitelist.',
    async execute(message) {
        const owners = await db.get('owners') || [];

        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const whitelistRoles = await db.get('whitelistRoles') || [];
        if (whitelistRoles.length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Aucun rôle n\'est actuellement dans la whitelistRoles.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const rolesList = whitelistRoles.map(roleId => `<@&${roleId}>`).join(', ');

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Les rôles dans la whitelistRoles :\n${rolesList}`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
