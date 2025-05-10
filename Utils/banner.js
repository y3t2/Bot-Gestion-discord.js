const { EmbedBuilder } = require('discord.js');
const config = require('../../Client/config');

module.exports = {
    name: 'banner',
    description: 'Affiche la bannière d\'un utilisateur ou du serveur.',
    usage: '+banner [@user|user_id|server]',
    async execute(message, args) {
        let targetUser;
        const guild = message.guild;
        const isServer = args[0] && args[0].toLowerCase() === 'server';

        if (isServer) {
            const bannerURL = guild.bannerURL({ size: 2048, dynamic: true });
            
            if (!bannerURL) {
                const noBannerEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Le serveur ${guild.name} n'a pas de bannière.`)
                    .setFooter({ text: config.footer });

                return message.channel.send({ embeds: [noBannerEmbed] });
            }

            const bannerEmbed = new EmbedBuilder()
                .setTitle(`Bannière du serveur ${guild.name}`)
                .setImage(bannerURL)
                .setColor(config.color)
                .setFooter({ text: config.footer });

            return message.channel.send({ embeds: [bannerEmbed] });
        }

        if (args.length > 0) {
            const userId = args[0].replace(/[<@!>]/g, ''); 
            targetUser = await message.client.users.fetch(userId).catch(() => null);
            
            if (!targetUser) {
                const userNotFoundEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Utilisateur introuvable.')
                    .setFooter({ text: config.footer });

                return message.channel.send({ embeds: [userNotFoundEmbed] });
            }
        } else {
            targetUser = message.author;
        }

        try {
            const user = await message.client.users.fetch(targetUser.id, { force: true });
            const bannerURL = user.bannerURL({ size: 2048, dynamic: true });

            if (!bannerURL) {
                const noBannerEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`${user.username} n'a pas de bannière.`)
                    .setFooter({ text: config.footer });

                return message.channel.send({ embeds: [noBannerEmbed] });
            }

            const bannerEmbed = new EmbedBuilder()
                .setTitle(`Bannière de ${user.username}`)
                .setImage(bannerURL)
                .setColor(config.color)
                .setFooter({ text: config.footer });

            return message.channel.send({ embeds: [bannerEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Une erreur est survenue en récupérant la bannière.')
                .setFooter({ text: config.footer });

            return message.channel.send({ embeds: [errorEmbed] });
        }
    }
};
