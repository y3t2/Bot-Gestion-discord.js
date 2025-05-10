const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'unautokick',
    description: 'Retire un utilisateur de la liste des auto-kicks.',
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

        const userIdToRemove = args[0]?.replace(/[<>@!]/g, '');

        if (!userIdToRemove) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let autokickList = await db.get('autokick') || [];
        if (!autokickList.includes(userIdToRemove)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas dans la liste des auto-kicks.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        autokickList = autokickList.filter(id => id !== userIdToRemove);
        await db.set('autokick', autokickList);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToRemove}> a été retiré de la liste des auto-kicks.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
