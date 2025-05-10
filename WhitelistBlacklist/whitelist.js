const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'whitelist',
    aliases: ['wl'],
    description: 'Ajoute un utilisateur à la whitelist.',
    async execute(message, args) {
        const userIdToAdd = args[0]?.replace(/[<>@!]/g, '');
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

        if (!userIdToAdd) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let whitelist = await db.get('whitelist') || [];
        if (whitelist.includes(userIdToAdd)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur est déjà sur la whitelist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        whitelist.push(userIdToAdd);
        await db.set('whitelist', whitelist);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToAdd}> a été ajouté à la whitelist.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
