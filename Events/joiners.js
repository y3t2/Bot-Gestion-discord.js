const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../Client/config');
const joiners = require('../Data/joiners.json'); 

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const guild = member.guild;

        const isEnabled = await db.get(`joiners_enabled_${guild.id}`);
        const joinChannelId = await db.get(`joiners_channel_${guild.id}`);

        if (!isEnabled || !joinChannelId) return;

        const channel = guild.channels.cache.get(joinChannelId);
        if (!channel) return;

        const joinMessage = joiners.joinMessage
            .replace('{user}', `<@${member.id}>`)
            .replace('{memberCount}', guild.memberCount);

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(joinMessage)
            .setFooter({ text: config.footer });

        channel.send({ embeds: [embed] });
    },
};
