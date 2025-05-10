const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const{ QuickDB} = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'voice',
    aliases: ["vc"],
    description: 'Affiche les stats vocal.',
    async execute(message) {
        const owners = await db.get('owners') || [];

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !owners.includes(message.author.id)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                .setFooter({ text: config.footer});
            
            return message.reply({ embeds: [noPermissionEmbed], allowedMentions: { repliedUser: true } });
        }

        const voiceChannels = message.guild.channels.cache.filter(channel => channel.isVoiceBased());
        const totalVoiceChannels = voiceChannels.size;
        const totalVoiceMembers = voiceChannels.reduce((acc, channel) => acc + channel.members.size, 0);

        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle('Stats Vocals')
            .setDescription(`🎧 **Salons vocaux**: \`${totalVoiceChannels}\`\n👥 **Membres en vocal**: \`${totalVoiceMembers}\``)
            .setFooter({ text: config.footer });

        await message.reply({ embeds: [embed] });
    },
};
