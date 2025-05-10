const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'sanctions',
    description: 'Affiche les sanctions d\'un utilisateur.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];

        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'executer cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const userIdToCheck = args[0]?.replace(/[<>@!]/g, '');
        if (!userIdToCheck) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const sanctions = await db.get(`sanctions_${userIdToCheck}`) || [];

        if (sanctions.length === 0) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Aucune sanction enregistrée pour cet utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const sanctionList = sanctions.map(s => {
            return `**${s.type}** - par <@${s.moderator}> le ${new Date(s.date).toLocaleString()}: **${s.reason}**`;
        }).join('\n');

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setTitle(`Sanctions pour <@${userIdToCheck}>`)
                .setDescription(sanctionList)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
