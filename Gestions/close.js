const { EmbedBuilder } = require('discord.js');
const configticket = require('../../Data/configticket.json');
const config = require('../../Client/config.js');

module.exports = {
    name: 'close',
    description: 'Ferme le ticket et le supprime dans 10 secondes.',
    async execute(message) {
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

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(`Le ticket a été fermé par <@${message.author.id}>. Il sera supprimé dans 10 secondes.`)
            .setFooter({ text: config.footer });

        await message.channel.send({ embeds: [embed] });

        setTimeout(async () => {
            await message.channel.delete();
        }, 10000);
    }
};
