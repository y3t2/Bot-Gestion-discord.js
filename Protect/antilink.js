const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'antilink',
    description: 'Activer ou désactiver le système Anti-Link.',
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
        const isAntilinkEnabled = await db.get(`antilink_${message.guild.id}`);
        
        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('Statut du système Anti-Link')
                    .setDescription(`Le système Anti-Link est actuellement **${isAntilinkEnabled ? 'Activé' : 'Désactivé'}**.\nSanction : **Mute 1 minute**`)
                    .setColor(config.color)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antilink on\` pour activer le système.\nUtilisez \`${prefix}antilink off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (args[0].toLowerCase() === 'on' || args[0].toLowerCase() === 'off') {
            const isEnabled = args[0].toLowerCase() === 'on';
            await db.set(`antilink_${message.guild.id}`, isEnabled);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Le système Anti-Link a été **${isEnabled ? 'activé' : 'désactivé'}**.`)
                    .setFooter({ text: config.footer })
                ]
            });
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Commande invalide. Utilisez \`${prefix}antilink on\` ou \`${prefix}antilink off\`.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antilink on\` pour activer le système.\nUtilisez \`${prefix}antilink off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
