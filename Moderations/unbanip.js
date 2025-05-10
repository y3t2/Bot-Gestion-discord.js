const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'unbanip',
    description: 'Délivrer un utilisateur précédemment banni par IP.',
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

        const userIdOrMention = args[0];
        if (!userIdOrMention) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous devez fournir un ID utilisateur ou une mention.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const userId = userIdOrMention.replace(/[<@!>]/g, '');

        if (!userId.match(/^\d+$/)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('L\'ID utilisateur fourni est invalide.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const ipBlacklist = await db.get('ipBlacklist') || [];
        const index = ipBlacklist.findIndex(entry => entry.id === userId);

        if (index === -1) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas dans la liste de bannissement par IP.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        ipBlacklist.splice(index, 1); 
        await db.set('ipBlacklist', ipBlacklist);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'IP de <@${userId}> a été dé-bannie par <@${message.author.id}>.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
