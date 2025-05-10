const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'anticreatelimit',
    description: 'Active ou désactive le système de limite de création de compte.',
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
        const isAntiCreateLimitEnabled = await db.get(`anticreatelimit_${message.guild.id}`);
        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('Statut du système Anti-Création de Compte')
                    .setDescription(`Le système anti-création de compte est actuellement **${isAntiCreateLimitEnabled ? 'activé' : 'désactivé'}**.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}anticreatelimit on\` pour activer le système.\nUtilisez \`${prefix}anticreatelimit off\` pour désactiver le système.`
                    })
                    .setColor(config.color)
                    .setFooter({ text: config.footer })
                ]
            });
        }
        const option = args[0].toLowerCase();

        if (option === 'on') {
            await db.set(`anticreatelimit_${message.guild.id}`, true); 

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système de limite de création de compte a été **activé** avec une limite de **48 heures**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else if (option === 'off') {
            await db.set(`anticreatelimit_${message.guild.id}`, false);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système de limite de création de compte a été **désactivé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Commande invalide. Utilisez \`${prefix}anticreatelimit on\` pour activer ou \`${prefix}anticreatelimit off\` pour désactiver.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}anticreatelimit on\` pour activer le système.\nUtilisez \`${prefix}anticreatelimit off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
