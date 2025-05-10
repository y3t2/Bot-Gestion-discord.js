const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'unowner',
    description: 'Retire un Owner.',
    async execute(message, args) {
        const userIdToRemove = args[0]?.replace(/[<>@!]/g, '');
        const owners = await db.get('owners') || [];
        const isStaff = config.staff.includes(message.author.id);
        const isOwner = owners.includes(message.author.id);

        if (!isOwner && !isStaff) {
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

        if (!owners.includes(userIdToRemove)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas un owner.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (config.staff.includes(userIdToRemove) && userIdToRemove !== message.author.id) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Tu ne peux pas retirer un staff d\'une position d\'owner.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const updatedOwners = owners.filter(id => id !== userIdToRemove);
        await db.set('owners', updatedOwners);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToRemove}> a été retiré des owners.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
