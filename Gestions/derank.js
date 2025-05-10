const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'derank',
    description: 'Retire tous les rôles d\'un utilisateur.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        if (!Array.isArray(owners)) {
            console.error('Les owners ne sont pas un tableau, réinitialisez votre base de données.');
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue, contactez un administrateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!owners.includes(message.author.id) && 
            !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (args.length < 1) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez mentionner un utilisateur ou fournir son ID.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const targetUser = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
        if (!targetUser) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Utilisateur introuvable.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (targetUser.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas retirer les rôles d\'un utilisateur ayant un rôle égal ou supérieur au vôtre.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        try {
            const rolesToRemove = targetUser.roles.cache.filter(role => role.id !== message.guild.id);

            if (rolesToRemove.size === 0) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('L\'utilisateur n\'a aucun rôle à retirer.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            await targetUser.roles.remove(rolesToRemove);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Tous les rôles ont été retirés de l'utilisateur <@${targetUser.id}>.`)
                    .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            console.error('Erreur lors de la tentative de retirer les rôles:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue lors de la tentative de retirer les rôles.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    },
};
