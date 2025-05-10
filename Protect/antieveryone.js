const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'antieveryone',
    description: 'Activer ou désactiver le système Anti-Everyone.',
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
        const isAntieveryoneEnabled = await db.get(`antieveryone_${message.guild.id}`);
        const sanction = 'derank all'; 

        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setTitle('Statut du système Anti-Everyone')
                    .setDescription(`Le système Anti-Everyone est actuellement **${isAntieveryoneEnabled ? 'Activé' : 'Désactivé'}**.\nSanction : **${sanction}**`)
                    .setColor(config.color)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antieveryone on\` pour activer le système.\nUtilisez \`${prefix}antieveryone off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const action = args[0].toLowerCase();
        if (action === 'on') {
            await db.set(`antieveryone_${message.guild.id}`, true);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système Anti-Everyone a été **activé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else if (action === 'off') {
            await db.set(`antieveryone_${message.guild.id}`, false);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Le système Anti-Everyone a été **désactivé**.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Commande invalide. Utilisez \`${prefix}antieveryone on\` ou \`${prefix}antieveryone off\`.`)
                    .addFields({
                        name: 'Comment utiliser cette commande',
                        value: `Utilisez \`${prefix}antieveryone on\` pour activer le système.\nUtilisez \`${prefix}antieveryone off\` pour désactiver le système.`
                    })
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
