const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'mp',
    description: 'Envoie un message privé à un membre spécifique.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const userIdOrMention = args[0]?.replace(/[<@!>]/g, '');
        const dmMessage = args.slice(1).join(' ');

        if (!userIdOrMention) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez spécifier un ID ou mentionner un utilisateur.')
                        .setFooter({ text: config.footer })
                ]
            });
        }

        if (!dmMessage) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Veuillez fournir un message à envoyer.')
                        .setFooter({ text: config.footer })
                ]
            });
        }

        try {
            const user = await message.client.users.fetch(userIdOrMention);
            await user.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(dmMessage)
                        .setFooter({ text: config.footer })
                ]
            });

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`Message envoyé à **${user.tag}**.`)
                        .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Une erreur est survenue lors de l\'envoi du message. Veuillez vérifier l\'ID ou la mention.')
                        .setFooter({ text: config.footer })
                ]
            });
        }
    }
};
