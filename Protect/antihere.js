const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'antihere',
    description: 'Activer ou désactiver le système anti-mention @here.',
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

        const prefix = config.prefix;  
        const status = await db.get(`antihere_${message.guild.id}`);

        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('Statut du système anti-mention @here')
                    .setDescription(`Le système anti-mention @here est actuellement **${status ? 'Activé' : 'Désactivé'}**.`)
                    .setColor(config.color)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antihere on\` pour activer le système.\nUtilisez \`${prefix}antihere off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (args[0].toLowerCase() === 'on' || args[0].toLowerCase() === 'off') {
            const isEnabled = args[0].toLowerCase() === 'on';
            await db.set(`antihere_${message.guild.id}`, isEnabled);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`L'anti-mention @here est désormais **${isEnabled ? 'activé' : 'désactivé'}**.`)
                    .setFooter({ text: config.footer })
                ]
            });
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Commande invalide. Utilisez \`${prefix}antihere on\` ou \`${prefix}antihere off\`.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antihere on\` pour activer le système.\nUtilisez \`${prefix}antihere off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
