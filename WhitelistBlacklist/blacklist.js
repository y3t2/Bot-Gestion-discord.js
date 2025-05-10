const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'blacklist',
    aliases: ['bl'],
    description: 'Ajoute un utilisateur à la blacklist et le ban de tous les serveurs.',
    async execute(message, args) {
        const userIdToBlacklist = args[0]?.replace(/[<>@!]/g, '');
        const reason = args.slice(1).join(' ') || 'Aucune raison spécifiée';
        const owners = await db.get('owners') || [];
        const whitelist = await db.get('whitelist') || [];
        const whitelistRoles = await db.get('whitelistRoles') || [];

        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!userIdToBlacklist) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const member = await message.guild.members.fetch(userIdToBlacklist).catch(() => null);
        if (member && whitelistRoles.some(roleId => member.roles.cache.has(roleId))) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas ajouter un membre avec un rôle Whitelist à la Blacklist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (whitelist.includes(userIdToBlacklist) || owners.includes(userIdToBlacklist)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas ajouter un Owner ou un membre Whitelist à la Blacklist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let blacklist = await db.get('blacklist') || [];
        if (blacklist.some(user => user.id === userIdToBlacklist)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur est déjà dans la blacklist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        blacklist.push({ id: userIdToBlacklist, reason });
        await db.set('blacklist', blacklist);

        let bannedServers = 0;
        let failedServers = 0;

        const guilds = message.client.guilds.cache;
        for (const guild of guilds.values()) {
            const memberToBan = await guild.members.fetch(userIdToBlacklist).catch(() => null);
            if (memberToBan) {
                await memberToBan.ban({ reason: `Blacklisted: ${reason}` }).then(() => {
                    bannedServers++;
                }).catch(() => {
                    failedServers++;
                });
            } else {
                failedServers++;
            }
        }

        let sanctions = await db.get(`sanctions_${userIdToBlacklist}`) || [];
        sanctions.push({
            type: 'Blacklist',
            reason: reason,
            date: new Date().toISOString(),
            moderator: message.author.id
        });
        await db.set(`sanctions_${userIdToBlacklist}`, sanctions);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToBlacklist}> a été ajouté à la blacklist pour : **${reason}**.\n\n**Banni de :** ${bannedServers} serveurs.\n**Échec du ban sur :** ${failedServers} serveurs.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
