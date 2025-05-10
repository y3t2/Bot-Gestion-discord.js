const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'pic',
    description: 'Affiche l\'avatar d\'un utilisateur ou l\'icône du serveur.',
    usage: '+pic [@user|user_id|server]',
    async execute(message, args) {
        try {
            const isServer = args[0] && args[0].toLowerCase() === 'server';

            if (isServer) {
                const serverIconURL = message.guild.iconURL({ size: 4096, dynamic: true });
                if (!serverIconURL) {
                    const noIconEmbed = new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription(`Le serveur ${message.guild.name} n'a pas d'icône.`)
                        .setFooter({ text: config.footer });
                    
                    return message.reply({ embeds: [noIconEmbed] });
                }

                const serverIconEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle(`Icône du serveur ${message.guild.name}`)
                    .setImage(serverIconURL)
                    .setFooter({ text: config.footer });

                return message.reply({ embeds: [serverIconEmbed] });
            }

            let userId = args[0] || message.author.id;

            if (userId.startsWith('<@') && userId.endsWith('>')) {
                userId = userId.replace(/[<@!>]/g, '');
            }

            let user;
            try {
                user = await message.client.users.fetch(userId);
            } catch (err) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', err);
                const userNotFoundEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('L\'utilisateur spécifié est introuvable.')
                    .setFooter({ text: config.footer });

                return message.reply({ embeds: [userNotFoundEmbed] });
            }

            const member = message.guild.members.cache.get(user.id);
            const accountCreationDate = user.createdAt.toDateString(); 
            const joinDate = member ? member.joinedAt.toDateString() : 'Non membre du serveur'; 
            const timeOnServer = member ? `${Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24))} jours` : 'Non membre du serveur'; 

            const userEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle(`Informations sur ${user.username}`)
                .setDescription(`
                **Nom d'utilisateur :** ${user.username}
                **ID :** ${user.id} 
                **Temps sur le serveur :** ${timeOnServer}
                `) 
                .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 })) 
                .setFooter({ text: config.footer });

            await message.reply({ embeds: [userEmbed] });
        } catch (error) {
            console.error('Erreur lors de la création de l\'embed pour l\'utilisateur:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Une erreur est survenue lors de la création de l\'embed pour l\'utilisateur.')
                .setFooter({ text: config.footer });

            message.reply({ embeds: [errorEmbed] });
        }
    },
};
