const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config.js');

const db = new QuickDB();

module.exports = {
    name: 'unblacklistrank',
    aliases: ['unblrank'],
    description: 'Retire un utilisateur de la liste noire.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez mentionner un utilisateur valide ou fournir son ID.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let blacklistedUsers = await db.get(`blacklisted_users_${message.guild.id}`) || [];
        if (!blacklistedUsers.includes(user.id)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${user.id}> n'est pas dans la BlackListRank.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        blacklistedUsers = blacklistedUsers.filter(id => id !== user.id);
        await db.set(`blacklisted_users_${message.guild.id}`, blacklistedUsers);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`<@${user.id}> a été retiré de la BlackListRank.`)
                .setFooter({ text: config.footer })
            ]
        });
    },
};
