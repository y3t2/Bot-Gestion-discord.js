const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'antibot',
    description: 'Activer ou désactiver le système Anti-Bot.',
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
        const isAntibotEnabled = await db.get(`antibot_${message.guild.id}`);

        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('Statut du système Anti-Bot')
                    .setDescription(`Le système Anti-Bot est actuellement **${isAntibotEnabled ? 'Activé' : 'Désactivé'}**.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antibot on\` pour activer le système.\nUtilisez \`${prefix}antibot off\` pour désactiver le système.`
                    })
                    .setColor(config.color)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const option = args[0].toLowerCase();

        if (option === 'on') {
            await db.set(`antibot_${message.guild.id}`, true);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système Anti-Bot a été **activé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else if (option === 'off') {
            await db.set(`antibot_${message.guild.id}`, false);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système Anti-Bot a été **désactivé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Commande invalide. Utilisez \`${prefix}antibot on\` ou \`${prefix}antibot off\`.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antibot on\` pour activer le système.\nUtilisez \`${prefix}antibot off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
