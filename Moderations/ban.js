const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'ban',
    description: 'Bannit un utilisateur.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        const whitelist = await db.get('whitelist') || [];
        const whitelistRoles = await db.get('whitelistRoles') || [];

        if (!owners.includes(message.author.id) && !message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const userIdToBan = args[0]?.replace(/[<>@!]/g, '');
        const reason = args.slice(1).join(' ');

        if (!userIdToBan) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!reason) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous devez fournir une raison pour bannir cet utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const member = await message.guild.members.fetch(userIdToBan).catch(() => null);
        if (member && whitelistRoles.some(roleId => member.roles.cache.has(roleId))) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas bannir un membre avec un rôle Whitelist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (whitelist.includes(userIdToBan) || owners.includes(userIdToBan)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas bannir un Owner ou un membre Whitelist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas présent sur ce serveur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        await member.ban({ reason: `Banni par ${message.author.tag} pour: ${reason}` });

        let sanctions = await db.get(`sanctions_${userIdToBan}`) || [];
        sanctions.push({
            type: 'Ban',
            reason: reason,
            date: new Date().toISOString(),
            moderator: message.author.id
        });
        await db.set(`sanctions_${userIdToBan}`, sanctions);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToBan}> a été banni pour : **${reason}**.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
