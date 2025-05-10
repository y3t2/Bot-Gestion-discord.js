const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'ownerbot',
    description: 'Affiche les informations concernant le propriétaire du bot.',
    async execute(message) {
        try {
            const owner = await message.client.users.fetch(config.staff[0]);

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`
                    **OWNER BOT :**
                     <@${config.staff[0]}> (${config.dev}) 
                    
                    **ID :** \`${config.staff[0]}\`

                    **Support :** [Rejoignez notre serveur de support !](${config.link})

                    **À propos de notre bot :**
                    Utilisez \`&help\` pour obtenir plus d'informations !  `)
                .setImage('https://cdn.discordapp.com/attachments/873510051692050442/873510120392056882/Banner.png')
                .setFooter({ 
                    text: config.footer, 
                    iconURL: message.client.user.displayAvatarURL({ dynamic: true, size: 512 }) 
                })
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération des informations de l\'owner:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(config.color) 
                .setDescription('Une erreur est survenue lors de la récupération des informations sur le propriétaire.');

            await message.reply({ embeds: [errorEmbed] });
        }
    },
};
