const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'autokick',
    description: 'Ajoute un utilisateur à la liste des auto-kicks.',
    async execute(message, args) {
        const owners = await db.get('owners') || [];
        const whitelist = await db.get('whitelist') || [];

        if (!owners.includes(message.author.id)) {
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
                    .setDescription('Vous devez fournir une raison pour ajouter cet utilisateur à la liste des auto-kicks.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (whitelist.includes(userIdToKick) || owners.includes(userIdToKick)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas ajouter un Owner ou un membre Whitelist à la liste des auto-kicks.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        let autokickList = await db.get('autokick') || [];
        if (autokickList.includes(userIdToKick)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur est déjà dans la liste des auto-kicks.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        autokickList.push(userIdToKick);
        await db.set('autokick', autokickList);

        const member = await message.guild.members.fetch(userIdToKick).catch(() => null);
        if (member) {
            await member.kick(`Ajouté à la liste des auto-kicks pour : ${reason}`);

            let sanctions = await db.get(`sanctions_${userIdToKick}`) || [];
            sanctions.push({
                type: 'Auto-Kick',
                reason: reason,
                date: new Date().toISOString(),
                moderator: message.author.id
            });
            await db.set(`sanctions_${userIdToKick}`, sanctions);
        }

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToKick}> a été ajouté à la liste des auto-kicks, expulsé et une sanction a été enregistrée pour : **${reason}**.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};
