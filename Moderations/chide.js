const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'chide',
    description: 'Rend le salon invisible pour tout le monde.',
    async execute(message) {
        const owners = await db.get('owners') || [];

        if (!owners.includes(message.author.id) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const channel = message.channel;

        try {
            await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                ViewChannel: false, 
                Connect: false, 
                Speak: false, 
            });

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Le salon <#${channel.id}> est maintenant invisible pour tout le monde.`)
                    .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue lors de la tentative de rendre le salon invisible.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    }
};
