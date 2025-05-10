const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'banip',
    description: 'Bannir un utilisateur par IP.',
    async execute(message, args) {
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

        const userIdOrMention = args[0];
        const reason = args.slice(1).join(' ');

        if (!userIdOrMention) {
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

        const userId = userIdOrMention.replace(/[<>@!]/g, '');

        if (!userId.match(/^\d+$/)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('L\'ID utilisateur fourni est invalide.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const guild = message.guild;

        try {
            const member = await guild.members.fetch(userId);

            // Vérifier si l'utilisateur a un rôle whitelisté
            if (whitelist.includes(userId) || whitelistRoles.some(roleId => member.roles.cache.has(roleId))) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(config.color)
                        .setDescription('Vous ne pouvez pas bannir un membre avec un rôle Whitelist.')
                        .setFooter({ text: config.footer })
                    ]
                });
            }

            await member.ban({ reason: `Bannissement par IP par ${message.author.tag}: ${reason}` });

            const ipBlacklist = await db.get('ipBlacklist') || [];
            ipBlacklist.push({ id: userId, username: member.user.username, bannedBy: message.author.id, date: new Date().toISOString(), reason: reason });
            await db.set('ipBlacklist', ipBlacklist);

            let sanctions = await db.get(`sanctions_${userId}`) || [];
            sanctions.push({
                type: 'BanIP',
                reason: reason,
                date: new Date().toISOString(),
                moderator: message.author.id
            });
            await db.set(`sanctions_${userId}`, sanctions);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`L'utilisateur <@${userId}> a été banni pour: **${reason}**.`)
                    .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            console.error(`Erreur lors du bannissement de ${userId}: ${error.message}`);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur s\'est produite lors du bannissement de l\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    }
};
