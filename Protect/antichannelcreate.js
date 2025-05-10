const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'antichannelcreate',
    description: 'Active ou désactive le système anti-création de canaux.',
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
        const isAntichannelCreateEnabled = await db.get(`antichannelcreate_${message.guild.id}`);

        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('Statut du système Anti-Création de Canaux')
                    .setDescription(`Le système anti-création de canaux est actuellement **${isAntichannelCreateEnabled ? 'activé' : 'désactivé'}**.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antichannelcreate on\` pour activer le système.\nUtilisez \`${prefix}antichannelcreate off\` pour désactiver le système.`
                    })
                    .setColor(config.color)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const option = args[0].toLowerCase();

        if (option === 'on') {
            await db.set(`antichannelcreate_${message.guild.id}`, true);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système anti-création de canaux a été **activé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else if (option === 'off') {
            await db.set(`antichannelcreate_${message.guild.id}`, false);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système anti-création de canaux a été **désactivé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Commande invalide. Utilisez \`${prefix}antichannelcreate on\` pour activer ou \`${prefix}antichannelcreate off\` pour désactiver.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antichannelcreate on\` pour activer le système.\nUtilisez \`${prefix}antichannelcreate off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
