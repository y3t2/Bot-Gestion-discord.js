const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config.js');

module.exports = {
    name: 'stat',
    aliases: [],
    execute: async (message) => {
        const embed = new EmbedBuilder()
            .setDescription(`Le bot est présent sur : **__${message.client.guilds.cache.size} serveurs !__**`)
            .setColor(config.color) // Utilise la couleur définie dans config.js
            .setFooter({ text: config.footer }); // Utilise le footer défini dans config.js

        await message.reply({ embeds: [embed] });
    },
};
