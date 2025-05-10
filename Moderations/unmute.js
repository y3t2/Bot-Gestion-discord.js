const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'unmute',
    description: 'Unmute un utilisateur.',
    async execute(message, args) {
        const userIdToUnmute = args[0]?.replace(/[<>@!]/g, '');
        const owners = await db.get('owners') || [];

        if (!userIdToUnmute) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!owners.includes(message.author.id) && !message.member.permissions.has('ModerateMembers')) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const member = await message.guild.members.fetch(userIdToUnmute).catch(() => null);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Utilisateur introuvable.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let sanctions = await db.get(`sanctions_${userIdToUnmute}`) || [];
        sanctions.push({
            type: 'Unmute',
            reason: 'Unmute effectué',
            date: new Date().toISOString(),
            moderator: message.author.id
        });
        await db.set(`sanctions_${userIdToUnmute}`, sanctions);

        await member.timeout(null, 'Unmute effectué').catch(err => {
            console.error(err);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue lors de l\'unmute de l\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        });

        await member.send({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Vous avez été unmute par <@${message.author.id}>.`)
                .setFooter({ text: config.footer })
            ]
        }).catch(() => null);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToUnmute}> a été unmute.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
