const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'whitelistrole',
    aliases: ['wlrole'],
    description: 'Ajoute un rôle à la WhiteList.',
    async execute(message, args) {
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

        const roleId = args[0]?.replace(/[<>@!]/g, '');
        if (!roleId) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention de rôle.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const existingWhitelist = await db.get('whitelistRoles') || [];
        if (existingWhitelist.includes(roleId)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Ce rôle est déjà dans la WhiteListRoles.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        existingWhitelist.push(roleId);
        await db.set('whitelistRoles', existingWhitelist);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Le rôle <@&${roleId}> a été ajouté à la WhiteListRoles.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
