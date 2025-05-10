const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config.js');

module.exports = {
    name: 'members',
    aliases: [],
    execute: async (message) => {
        const embed = new EmbedBuilder()
            .setDescription(`Nous sommes __**${message.guild.memberCount}**__ sur le __serveur__ !`)
            .setColor(config.color)
            .setFooter({ text: config.footer });

        await message.reply({ embeds: [embed] });
    },
};
