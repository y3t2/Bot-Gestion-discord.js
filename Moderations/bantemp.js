const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');
const ms = require('ms');

const db = new QuickDB();

module.exports = {
    name: 'bantemp',
    description: 'Bannit un utilisateur temporairement pour une durée spécifiée.',
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
        const durationString = args[1];
        const reason = args.slice(2).join(' ') || 'Aucune raison fournie';

        if (!userIdToBan) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!durationString || !ms(durationString)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier une durée valide (ex: `1h`, `30m`, `1d`).')
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

        const member = await message.guild.members.fetch(userIdToBan).catch(() => null);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas présent sur ce serveur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const duration = ms(durationString);

        if (whitelistRoles.some(roleId => member.roles.cache.has(roleId))) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas bannir un membre avec un rôle Whitelist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const user = await message.client.users.fetch(userIdToBan).catch(() => null);
        if (user) {
            const dmEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle('Bannissement temporaire')
                .setDescription(`Vous avez été temporairement banni du serveur **${message.guild.name}** pour une durée de **${ms(duration, { long: true })}**.`)
                .addFields({ name: 'Raison', value: reason }, { name: 'Modérateur', value: `<@${message.author.id}>` })
                .setFooter({ text: config.footer });

            user.send({ embeds: [dmEmbed] }).catch(() => {
                console.log(`Impossible d'envoyer un message à l'utilisateur ${userIdToBan}.`);
            });
        }

        message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToBan}> sera banni dans **3 secondes**.`)
                .setFooter({ text: config.footer })
            ]
        });
        await new Promise(resolve => setTimeout(resolve, 3000));

        await member.ban({ reason: `Banni temporairement par ${message.author.tag} pour: ${reason} (Durée: ${ms(duration, { long: true })})` });

        await db.set(`tempban_${userIdToBan}`, {
            guildId: message.guild.id,
            endTime: Date.now() + duration,
            reason: reason
        });

        let sanctions = await db.get(`sanctions_${userIdToBan}`) || [];
        sanctions.push({
            type: 'TempBan',
            reason: reason,
            date: new Date().toISOString(),
            moderator: message.author.id,
            duration: durationString
        });
        await db.set(`sanctions_${userIdToBan}`, sanctions);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToBan}> a été temporairement banni pour : **${reason}**\nDurée: **${ms(duration, { long: true })}**.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
