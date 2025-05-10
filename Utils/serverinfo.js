const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');
module.exports = {
    name: 'serverinfo',
    description: 'Affiche les informations relatives au serveur.',
    async execute(message) {
    
        const guild = message.guild;

        
        const embed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`Informations sur le serveur`)
            .setDescription(
                `**ID:** ${guild.id}\n` +
                `**Nom:** ${guild.name}\n` +
                `**Propriétaire:** <@${guild.ownerId}>\n` +
                `**Région:** ${guild.preferredLocale}\n` +
                `**Créé le:** <t:${Math.floor(guild.createdTimestamp / 1000)}:D>\n` +
                `**Membres:** ${guild.memberCount}\n` +
                `**Rôles:** ${guild.roles.cache.size}\n` +
                `**Salons:** ${guild.channels.cache.size}\n` +
                `**Boosts:** ${guild.premiumSubscriptionCount}`
            )
            .setFooter({ text: config.footer})
            

      
        await message.reply({ embeds: [embed] });
    }
};
