const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config');

module.exports = {
    name: 'setjoiners',
    description: 'Configure le canal et l\'état pour les messages de bienvenue.',
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

        if (args.length === 0) {
            const isEnabled = await db.get(`joiners_enabled_${message.guild.id}`) || false;
            const channelId = await db.get(`joiners_channel_${message.guild.id}`) || 'Aucun salon défini';

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle('État actuel des messages de bienvenue')
                .addFields(
                    { name: 'Statut', value: isEnabled ? 'Activé' : 'Désactivé', inline: true },
                    { name: 'Canal', value: channelId !== 'Aucun salon défini' ? `<#${channelId}>` : 'Aucun salon défini', inline: true }
                )
                .setFooter({ text: config.footer });

            return message.reply({ embeds: [embed] });
        }

        if (args.length === 2 && (args[0] === 'on' || args[0] === 'off')) {
            const status = args[0] === 'on';
            const channel = message.mentions.channels.first();

            if (!channel) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez mentionner un salon valide.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            await db.set(`joiners_enabled_${message.guild.id}`, status);
            await db.set(`joiners_channel_${message.guild.id}`, channel.id);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Les messages de bienvenue sont désormais ${status ? 'activés' : 'désactivés'} dans le salon <#${channel.id}>.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Utilisation incorrecte. Utilisez `+setjoiners on/off #channel` pour configurer.')
                .setFooter({ text: config.footer })
            ]
        });
    },
};
