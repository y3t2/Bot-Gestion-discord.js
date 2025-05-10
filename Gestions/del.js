const { EmbedBuilder } = require('discord.js');
const configticket = require('../../Data/configticket.json');
const config = require('../../Client/config.js');

module.exports = {
    name: 'del',
    description: 'Retire un utilisateur du ticket en lui enlevant l\'accès à ce salon.',
    async execute(message, args) {
        const hasPermission = message.member.roles.cache.some(role => configticket.view_role_ids.includes(role.id));
        if (!hasPermission) {
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

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`<@${message.author.id}>, veuillez mentionner un utilisateur valide ou fournir son ID.`)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        await message.channel.permissionOverwrites.edit(user, {
            ViewChannel: false,
            SendMessages: false,
            ReadMessageHistory: false
        });

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(`${user} a été retiré du ticket.`)
            .setFooter({ text: config.footer });

        return message.channel.send({ embeds: [embed] });
    }
};
