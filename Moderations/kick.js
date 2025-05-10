const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'kick',
    description: 'Expulse un utilisateur du serveur.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        const whitelist = await db.get('whitelist') || [];
        const whitelistRoles = await db.get('whitelistRoles') || [];

        if (!owners.includes(message.author.id) && !message.member.permissions.has('KickMembers')) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const userIdToKick = args[0]?.replace(/[<>@!]/g, '');
        const reason = args.slice(1).join(' ');

        if (!userIdToKick) {
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
                    .setDescription('Vous devez fournir une raison pour expulser cet utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (whitelist.includes(userIdToKick) || owners.includes(userIdToKick)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas expulser un Owner ou un membre de la Whitelist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const member = await message.guild.members.fetch(userIdToKick).catch(() => null);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas présent sur ce serveur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (whitelistRoles.some(roleId => member.roles.cache.has(roleId))) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas expulser un membre avec un rôle Whitelist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        try {
            await member.kick(reason);
            
            let sanctions = await db.get(`sanctions_${userIdToKick}`) || [];
            sanctions.push({
                type: 'Kick',
                reason: reason,
                date: new Date().toISOString(),
                moderator: message.author.id
            });
            await db.set(`sanctions_${userIdToKick}`, sanctions);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`L'utilisateur <@${userIdToKick}> a été expulsé pour : **${reason}**.`)
                    .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue lors de l\'expulsion de l\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    }
};
