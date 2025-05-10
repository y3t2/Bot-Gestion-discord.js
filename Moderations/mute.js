const { EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../../Client/config');

const db = new QuickDB();

module.exports = {
    name: 'mute',
    description: 'Mute un utilisateur pour une durée par défaut ou spécifiée.',
    async execute(message, args) {
        const userIdToMute = args[0]?.replace(/[<>@!]/g, '');
        const durationArg = args[1];
        const reason = args.slice(durationArg ? 2 : 1).join(' ') || 'Aucune raison spécifiée';
        const owners = await db.get('owners') || [];
        const DEFAULT_DURATION = 28 * 24 * 60 * 60 * 1000; 

        if (!userIdToMute) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier un ID ou une mention d\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`<@${message.author.id}>, vous n'avez pas la permission d'exécuter cette commande.`)
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const member = await message.guild.members.fetch(userIdToMute).catch(() => null);
        if (!member) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Cet utilisateur n\'est pas présent sur ce serveur.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        if (owners.includes(userIdToMute)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Vous ne pouvez pas muter un Owner.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        const duration = durationArg ? parseDuration(durationArg) : DEFAULT_DURATION;
        if (isNaN(duration)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Veuillez spécifier une durée valide (ex: 1m, 30s), ou laissez vide pour 28 jours.')
                    .setFooter({ text: config.footer })
                ]
            });
        }

        await member.timeout(duration, `Mute effectué pour : ${reason}`).catch(err => {
            console.error(err);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription('Une erreur est survenue lors du mute de l\'utilisateur.')
                    .setFooter({ text: config.footer })
                ]
            });
        });

        let sanctions = await db.get(`sanctions_${userIdToMute}`) || [];
        sanctions.push({
            type: 'Mute',
            reason: reason,
            date: new Date().toISOString(),
            moderator: message.author.id
        });
        await db.set(`sanctions_${userIdToMute}`, sanctions);

        await member.send({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`Vous avez été mute par <@${message.author.id}> pour : ${reason}.\nDurée : ${formatDuration(duration)}.`)
                .setFooter({ text: config.footer })
            ]
        }).catch(() => null);

        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(config.color)
                .setDescription(`L'utilisateur <@${userIdToMute}> a été mute pour : **${reason}**.\nDurée : ${formatDuration(duration)}.`)
                .setFooter({ text: config.footer })
            ]
        });
    }
};

function parseDuration(durationArg) {
    const match = durationArg.match(/(\d+)([smh])/);
    if (!match) return NaN;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000; 
        case 'm': return value * 60 * 1000; 
        case 'h': return value * 60 * 60 * 1000; 
        default: return NaN;
    }
}

function formatDuration(duration) {
    const days = Math.floor(duration / (24 * 60 * 60 * 1000));
    const hours = Math.floor((duration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((duration % (60 * 1000)) / 1000);

    return `${days > 0 ? `${days}j ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds > 0 ? `${seconds}s` : ''}`.trim();
}
