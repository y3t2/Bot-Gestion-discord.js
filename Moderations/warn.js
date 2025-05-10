const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'warn',
    description: 'Avertit un utilisateur.',
    async execute(message, args) {
        const userIdToWarn = args[0]?.replace(/[<>@!]/g, '');
        const reason = args.slice(1).join(' ');

        const owners = await db.get('owners') || [];
        const canSeeLogs = message.member.permissions.has(PermissionsBitField.Flags.ViewAuditLog);

        if (!owners.includes(message.author.id) && !canSeeLogs) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!userIdToWarn) {
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
                    .setDescription('Vous devez fournir une raison pour avertir cet utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        try {
            const user = await message.client.users.fetch(userIdToWarn);
            await user.send({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Vous avez été averti par <@${message.author.id}> pour la raison suivante : **${reason}**.`)
                    .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Impossible d\'envoyer un message privé à cet utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let sanctions = await db.get(`sanctions_${userIdToWarn}`) || [];
        sanctions.push({
            type: 'Warn',
            reason: reason,
            date: new Date().toLocaleString(),
            moderator: message.author.id
        });
        await db.set(`sanctions_${userIdToWarn}`, sanctions);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToWarn}> a été averti pour : **${reason}**.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
