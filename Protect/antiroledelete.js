const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config.js'); 

module.exports = {
    name: 'antiroledelete',
    description: 'Activer ou désactiver le système anti-suppression de rôles.',
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
        if (args.length === 0) {
            const status = await db.get(`antiroledelete_${message.guild.id}`);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('Statut du système Anti-Suppression de Rôles')
                    .setDescription(`L'anti-suppression de rôles est actuellement **${status ? 'activé' : 'désactivé'}**.`)
                    .setColor(config.color)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antiroledelete on\` pour activer le système.\nUtilisez \`${prefix}antiroledelete off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (args.length === 1 && (args[0].toLowerCase() === 'on' || args[0].toLowerCase() === 'off')) {
            const status = args[0].toLowerCase() === 'on';
            await db.set(`antiroledelete_${message.guild.id}`, status);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`L'anti-suppression de rôles est désormais **${status ? 'activé' : 'désactivé'}**.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Commande invalide. Utilisez \`${prefix}antiroledelete on\` ou \`${prefix}antiroledelete off\`.`)
                .addFields({
                    name: 'Comment utiliser cette commande',
                    value: `Utilisez \`${prefix}antiroledelete on\` pour activer le système.\nUtilisez \`${prefix}antiroledelete off\` pour désactiver le système.`
                })
                .setFooter({ text: config.footer })
            ]
        });
    },
};
