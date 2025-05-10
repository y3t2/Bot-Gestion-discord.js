const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../Client/config');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    name: 'infoban',
    description: 'Vérifie si un utilisateur est banni sur le serveur.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        const isOwner = owners.includes(message.author.id);

        if (!isOwner && !message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                .setFooter({ text: config.footer });
            return message.reply({ embeds: [embed] });
        }

        const memberId = args[0]?.replace(/[<>@!]/g, '');
        if (!memberId) {
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Veuillez fournir l\'ID du membre à vérifier.')
                .setFooter({ text: config.footer });
            return message.reply({ embeds: [embed] });
        }

        try {
            const banList = await message.guild.bans.fetch();
            const isBanned = banList.has(memberId);

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle('Statut de Ban')
                .setDescription(isBanned
                    ? `L'utilisateur avec l'ID \`${memberId}\` est **banni** du serveur.`
                    : `L'utilisateur avec l'ID \`${memberId}\` n'est **pas banni** du serveur.`)
                .setFooter({ text: config.footer });

            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste des bans:', error);
            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Une erreur est survenue lors de la vérification du ban.')
                .setFooter({ text: config.footer });
            return message.reply({ embeds: [embed] });
        }
    },
};
