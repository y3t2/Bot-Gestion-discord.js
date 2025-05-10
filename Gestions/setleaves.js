const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../../Client/config');

module.exports = {
    name: 'setleaves',
    description: 'Active ou désactive les messages de départ et définit le canal.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        if (!Array.isArray(owners) || !owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (args.length === 0) {
            const isEnabled = await db.get(`leaves_enabled_${message.guild.id}`);
            const leaveChannelId = await db.get(`leaves_channel_${message.guild.id}`);
            const statusMessage = isEnabled ? `activé dans le salon <#${leaveChannelId}>` : 'désactivé';

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Les messages de leaves sont actuellement ${statusMessage}.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (args.length === 2 && (args[0] === 'on' || args[0] === 'off')) {
            const isEnabled = args[0] === 'on';
            const channel = message.mentions.channels.first();

            if (isEnabled && !channel) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez mentionner un salon valide pour les messages de leaves.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            await db.set(`leaves_enabled_${message.guild.id}`, isEnabled);
            if (isEnabled) {
                await db.set(`leaves_channel_${message.guild.id}`, channel.id);
            }

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Les messages de leaves sont désormais ${isEnabled ? `activés dans le salon <#${channel.id}>` : 'désactivés'}.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Veuillez utiliser la commande de cette manière : `+setleaves on/off #channel`.') 
                .setFooter({ text: config.footer })
            ]
        });
    },
};
