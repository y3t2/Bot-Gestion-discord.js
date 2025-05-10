const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'help',
    description: 'Affiche les informations de base sur le bot et les commandes disponibles.',
    async execute(message) {
        const botAvatarURL = message.client.user.displayAvatarURL({ dynamic: true });
        const userAvatarURL = message.author.displayAvatarURL({ dynamic: true });

        const embed = new EmbedBuilder()
            .setColor(config.color)  
            .setTitle('・━━━━━「 ℍ𝕖𝕝𝕡 」━━━━━・')
            .setDescription(`
                **Pour des informations détaillées sur les commandes :**
                Tapez la commande \`${config.prefix}helpall\` pour tout savoir
                
                ━━━━━━⊱✿⊰━━━━━━
                **Contact Owner :**
                Si vous avez des questions ou besoin d'aide, [cliquez ici](${config.link}) pour rejoindre le serveur officiel du bot
                ━━━━━━⊱✿⊰━━━━━━
                **Info sur l'Owner :**
                Utilisez la commande \`${config.prefix}ownerbot\` pour en savoir plus sur l'owner 
            `)
            .setThumbnail(botAvatarURL)  
            .setFooter({ 
                text: config.footer, 
                iconURL: userAvatarURL 
            });

        await message.reply({ embeds: [embed] });
    }
};
