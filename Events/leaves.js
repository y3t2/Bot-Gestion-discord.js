const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../Client/config');
const leaves = require('../Data/leaves.json'); 

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        const guild = member.guild;

        const isEnabled = await db.get(`leaves_enabled_${guild.id}`);
        const leaveChannelId = await db.get(`leaves_channel_${guild.id}`);

        if (!isEnabled || !leaveChannelId) return;

        const channel = guild.channels.cache.get(leaveChannelId);
        if (!channel) return;

        const leaveMessage = leaves.leaveMessage
            .replace('{user}', `<@${member.id}>`)
            .replace('{memberCount}', guild.memberCount);

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(leaveMessage)
            .setFooter({ text: config.footer });

        channel.send({ embeds: [embed] });
    },
};
