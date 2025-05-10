const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'unwhitelist',
    aliases: ['unwl'],
    description: 'Retire un utilisateur de la whitelist.',
    async execute(message, args) {
        const userIdToRemove = args[0]?.replace(/[<>@!]/g, '');
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

        if (!userIdToRemove) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let whitelist = await db.get('whitelist') || [];
        if (!whitelist.includes(userIdToRemove)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas dans la whitelist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        whitelist = whitelist.filter(id => id !== userIdToRemove);
        await db.set('whitelist', whitelist);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToRemove}> a été retiré de la whitelist.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
