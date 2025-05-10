const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'clearsanctions',
    description: 'Supprime toutes les sanctions d\'un utilisateur.',
    async execute(message, args) {
        const userIdToClear = args[0]?.replace(/[<>@!]/g, '');
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

        if (!userIdToClear) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let sanctions = await db.get(`sanctions_${userIdToClear}`) || [];
        if (sanctions.length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Aucune sanction trouvée pour cet utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        await db.set(`sanctions_${userIdToClear}`, []); 

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Toutes les sanctions de <@${userIdToClear}> ont été supprimées.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
