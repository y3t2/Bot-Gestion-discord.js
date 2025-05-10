const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'addrole',
    aliases: ['ar'],
    description: 'Ajoute un rôle à un utilisateur.',
    usage: 'ou +ar @user <id_role> [raison]',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        if (!Array.isArray(owners)) {
            console.error('Les owners ne sont pas un tableau, réinitialisez votre base de données.');
            return message.reply('Une erreur est survenue, contactez un administrateur.');
        }

        if (!owners.includes(message.author.id) && 
            !message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                .setFooter({ text: config.footer })
            ]});
        }

        if (args.length < 2) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Veuillez mentionner un utilisateur et un rôle. Exemple: +ar @user <id_role> [raison]')
                .setFooter({ text: config.footer })
            ]});
        }

        let targetUser = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        if (!targetUser) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Utilisateur introuvable.')
                .setFooter({ text: config.footer })
            ]});
        }

        let targetRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());
        
        if (!targetRole) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Rôle introuvable.')
                .setFooter({ text: config.footer })
            ]});
        }

        if (!owners.includes(message.author.id) && 
            targetRole.position >= message.member.roles.highest.position) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Vous ne pouvez pas ajouter un rôle supérieur ou égal à votre propre rôle.')
                .setFooter({ text: config.footer })
            ]});
        }

        if (targetUser.roles.cache.has(targetRole.id)) {
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`${targetUser.user.username} a déjà ce rôle.`)
                .setFooter({ text: config.footer })
            ]});
        }

        const reason = args.slice(2).join(' ') || 'Aucune raison fournie';

        try {
            await targetUser.roles.add(targetRole);
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Le rôle ${targetRole} a été ajouté à ${targetUser}. Raison : ${reason}`)
                .setFooter({ text: config.footer })
            ]});
        } catch (error) {
            console.error(error);
            return message.reply({ embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription('Une erreur est survenue lors de l\'ajout du rôle.')
                .setFooter({ text: config.footer })
            ]});
        }
    }
};
