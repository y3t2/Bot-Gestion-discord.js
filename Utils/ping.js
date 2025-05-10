const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'ping',
    description: 'Affiche la latence du bot.',
    async execute(message) {
        const sent = await message.reply('Calcul de la latence...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(message.client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('Pong  ')
            .addFields(
                { name: 'Latence du bot', value: `${latency}ms`, inline: true })
            .setFooter({text: config.footer})

        await sent.edit({ content: null, embeds: [embed] });
    }
};
