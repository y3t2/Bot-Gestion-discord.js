const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'antichanneldelete',
    description: 'Active ou désactive le système anti-suppression de canaux.',
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
        const isAntichannelDeleteEnabled = await db.get(`antichanneldelete_${message.guild.id}`);

        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('Statut du système Anti-Suppression de Canaux')
                    .setDescription(`Le système anti-suppression de canaux est actuellement **${isAntichannelDeleteEnabled ? 'activé' : 'désactivé'}**.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antichanneldelete on\` pour activer le système.\nUtilisez \`${prefix}antichanneldelete off\` pour désactiver le système.`
                    })
                    .setColor(config.color)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const option = args[0].toLowerCase();

        if (option === 'on') {
            await db.set(`antichanneldelete_${message.guild.id}`, true);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système anti-suppression de canaux a été **activé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else if (option === 'off') {
            await db.set(`antichanneldelete_${message.guild.id}`, false);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système anti-suppression de canaux a été **désactivé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Commande invalide. Utilisez \`${prefix}antichanneldelete on\` pour activer ou \`${prefix}antichanneldelete off\` pour désactiver.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antichanneldelete on\` pour activer le système.\nUtilisez \`${prefix}antichanneldelete off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
