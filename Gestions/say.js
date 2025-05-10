const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'say',
    description: 'Fait dire au bot un message dans un salon spécifique.',
    async execute(message, args) {
        const ownerIds = await db.get('owners') || [];

        if (!ownerIds.includes(message.author.id) && !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const channel = message.mentions.channels.first();
        if (!channel) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous devez mentionner un salon valide.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const sayMessage = args.slice(1).join(' ');
        if (!sayMessage) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous devez fournir un message à envoyer.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        try {
            await channel.send(sayMessage);
            message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Message envoyé dans <#${channel.id}>`)
                    .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            console.error(error);
            message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue lors de l\'envoi du message.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    }
};
