const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'unblacklist',
    aliases: ['unbl'],
    description: 'Retire un utilisateur de la blacklist.',
    async execute(message, args) {
        const userIdToUnblacklist = args[0]?.replace(/[<>@!]/g, '');
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

        if (!userIdToUnblacklist) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let blacklist = await db.get('blacklist') || [];
        const userToRemove = blacklist.find(user => user.id === userIdToUnblacklist);
        if (!userToRemove) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas dans la blacklist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        blacklist = blacklist.filter(user => user.id !== userIdToUnblacklist);
        await db.set('blacklist', blacklist);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToUnblacklist}> a été retiré de la blacklist.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
