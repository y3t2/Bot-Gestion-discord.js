const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const config = require('../Client/config');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const channelId = await db.get(`welcomeChannel_${member.guild.id}`);
        const welcomeMessage = await db.get(`welcomeMessage_${member.guild.id}`);

        if (!channelId || !welcomeMessage) {
            console.log('Canal de bienvenue ou message de bienvenue non configuré.');
            return;
        }

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) {
            console.log('Canal de bienvenue non trouvé.');
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setDescription(`${welcomeMessage.replace(/{{user}}/g, `<@${member.id}>`)}`)
            .setFooter({ text: config.footer });

        try {
            await channel.send({ content: `<@${member.id}>`, embeds: [embed] });
            console.log(`Message de bienvenue envoyé à ${member.user.tag}.`);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message de bienvenue:', error);
        }
    },
};
