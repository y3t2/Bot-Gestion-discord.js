const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'pin',
    description: 'Épingle un message spécifié par son ID.',
    args: true,
    usage: '<message_id>',
    async execute(message, args) {
        const ownerIds = await db.get('owners') || [];

        if (!ownerIds.includes(message.author.id) && !message.member.permissions.has(PermissionBitField.ManageMessages)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'executer cette commande.`)
                        .setFooter({ text: config.footer })
                ],
                ephemeral: true
            });
        }

        const messageId = args[0];
        const channel = message.channel;

        try {
            const msg = await channel.messages.fetch(messageId);
            await msg.pin();

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`Le message avec l'ID **${messageId}** a été épinglé avec succès.`)
                        .setFooter({ text: config.footer })
                ]
            });

        } catch (error) {
            console.error('Erreur lors de l\'épinglage du message :', error);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`Le message avec l'ID **${messageId}** n'a pas pu être épinglé. Vérifiez l'ID et vos permissions.`)
                        .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
