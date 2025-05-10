const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'unban',
    description: 'Unban un utilisateur.',
    async execute(message, args) {
        const userIdToUnban = args[0]?.replace(/[<>@!]/g, '');
        const owners = await db.get('owners') || [];
        const blacklist = await db.get('blacklist') || [];

        if (!userIdToUnban) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (blacklist.some(user => user.id === userIdToUnban)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas débannir un utilisateur qui est dans la blacklist.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers) && !owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        try {
            await message.guild.members.unban(userIdToUnban);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`L'utilisateur <@${userIdToUnban}> a été débanni.`)
                    .setFooter({ text: config.footer })
                ]
            });
        } catch (error) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Impossible de débannir cet utilisateur. Vérifiez si l\'ID est correct.')
                    .setFooter({ text: config.footer })
                ]
            });
        }
    }
};
