const { QuickDB } = require('quick.db');
const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'logs-antibot',
    description: 'Gérer les logs pour le système Anti-Bot.',
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
        const currentLogChannelId = await db.get(`log_channel_antibot_${message.guild.id}`);

        if (!args.length) {
            const status = currentLogChannelId 
                ? `Activé dans <#${currentLogChannelId}>.` 
                : 'Désactivé.';

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle('**Logs Anti-Bot**')
                    .setDescription(`Statut actuel : **${status}**\n\nUtilisez \`${prefix}logs-antibot on #channel\` pour définir un salon pour les logs ou \`${prefix}logs-antibot off\` pour les désactiver.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const option = args[0].toLowerCase();

        if (option === 'on') {
            const channel = message.mentions.channels.first();
            if (!channel) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez mentionner un salon valide pour activer les logs Anti-Bot.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            await db.set(`log_channel_antibot_${message.guild.id}`, channel.id);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Les logs Anti-Bot seront désormais envoyés dans le salon <#${channel.id}>.`)
                    .setFooter({ text: config.footer })
                ]
            });

        } else if (option === 'off') {
            if (!currentLogChannelId) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Les logs Anti-Bot sont déjà désactivés.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            await db.delete(`log_channel_antibot_${message.guild.id}`);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Les logs Anti-Bot ont été désactivés.')
                    .setFooter({ text: config.footer })
                ]
            });
        } else {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Option invalide. Utilisez \`${prefix}logs-antibot on #channel\` pour activer ou \`${prefix}logs-antibot off\` pour désactiver.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
