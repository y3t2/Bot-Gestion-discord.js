const { EmbedBuilder } = require('discord.js');
const configticket = require('../../Data/configticket.json');
const config = require('../../Client/config.js');

module.exports = {
    name: 'rename',
    description: 'Renomme le ticket actuel.',
    async execute(message, args) {
        const hasRole = message.member.roles.cache.some(role => configticket.view_role_ids.includes(role.id));
        if (!hasRole) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        if (!message.channel.name.startsWith('ticket-')) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`<@${message.author.id}>, ce salon n'est pas un ticket.`)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        if (!args.length) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`Veuillez fournir un nouveau nom pour le ticket.`)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const newName = `ticket-${args.join(' ')}`;
        await message.channel.setName(newName);

        // Confirmation du renommage
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Le ticket a été renommé en **${newName}**.`)
                    .setFooter({ text: config.footer })
            ]
        });
    }
};
