const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'mybot',
    description: 'Fournit le lien d\'invitation du bot avec les permissions nécessaires.',
    async execute(message) {
        if (!config.staff.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                        .setFooter({ text: config.footer })
                ]
            });
        }

        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&permissions=8&scope=bot%20applications.commands`;

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(`[Cliquez ici pour inviter vôtre BOT](${inviteLink})`)
            .setFooter({ text: config.footer });

        await message.reply({ embeds: [embed] });
    }
};
